import React, { Component } from 'react';
import {
  Animated,
  DeviceInfo,
  Dimensions,
  Easing,
  EmitterSubscription,
  findNodeHandle,
  Keyboard,
  KeyboardEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextInput,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { measureInWindow, measureLayout, viewIsDescendantOf } from './uiManagerPromises';

// Workaround for missing DeviceInfo types
declare module 'react-native' {
  const DeviceInfo: {
    isIPhoneX_deprecated: boolean;
  };
}

type Props = typeof KeyboardAwareScrollView.defaultProps & {
  contentContainerStyleKeyboardShown?: StyleProp<ViewProps>;
  scrollViewContentContainerStyle?: StyleProp<ViewProps>;
  scrollViewRef: any;
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
} & ScrollViewProps;

interface State {
  paddingBottom: Animated.Value;
  keyboardShown: boolean;
  scrollIndicatorBottomInset: number;
}

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

const ANIMATION_DURATION = Platform.select({ ios: 250, default: 125 });

const IPHONE_X_INSET = {
  top: 44,
  bottom: 34,
};

/**
 * Keyboard aware scroll view.
 * Based on react-native KeyboardAvoidingView and react-native-keyboard-aware-scroll-view.
 */
export class KeyboardAwareScrollView extends Component<Props, State> {
  static defaultProps: {
    extraHeight: 24;
  };

  private subscriptions: EmitterSubscription[] = [];

  private scrollToFocusedInputTimeout: number | null = null;

  private scrollView: ScrollView | null = null;

  private mounted = false;

  private scrollViewPosY = 0;

  private keyboardPosY = 0;

  constructor(props: Props) {
    super(props);

    this.state = {
      paddingBottom: new Animated.Value(0),
      keyboardShown: false,
      scrollIndicatorBottomInset: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillShow', this.onKeyboardShow),
        Keyboard.addListener('keyboardWillHide', this.onKeyboardHide),
      ];
      return;
    }

    this.subscriptions = [
      Keyboard.addListener('keyboardDidShow', this.onKeyboardShow),
      Keyboard.addListener('keyboardDidHide', this.onKeyboardHide),
    ];
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.scrollToFocusedInputTimeout) {
      clearTimeout(this.scrollToFocusedInputTimeout);
      this.scrollToFocusedInputTimeout = null;
    }

    this.subscriptions.forEach((subscription) => subscription.remove());
    this.subscriptions = [];
  }

  private onRef = (scrollView: ScrollView): void => {
    this.scrollView = scrollView;

    const { scrollViewRef } = this.props;
    if (!scrollViewRef) {
      return;
    }

    if (typeof scrollViewRef === 'function') {
      scrollViewRef(scrollView);
      return;
    }

    scrollViewRef.current = scrollView;
  };

  private onKeyboardShow = async (event: KeyboardEvent): Promise<void> => {
    if (!this.scrollView) {
      return;
    }

    const handle = findNodeHandle(this.scrollView);

    if (!handle) {
      return;
    }

    // Get scroll view height and top position
    const { height, top } = await measureInWindow(handle);

    if (!this.mounted) {
      return;
    }

    // Save scroll view Y position
    this.scrollViewPosY = top;

    // Get keyboard position by Y axis at current view.
    this.keyboardPosY = event.endCoordinates.screenY - top;

    // Subtract status bar height for android.
    if (StatusBar.currentHeight) {
      this.keyboardPosY -= StatusBar.currentHeight;
    }

    // Calc padding bottom
    const paddingBottom = height - this.keyboardPosY;

    let scrollIndicatorBottomInset = paddingBottom;

    // Check if scrollview intersects iOS bottom inset
    if (DeviceInfo.isIPhoneX_deprecated) {
      const { height: screenHeight } = Dimensions.get('screen');

      if (top + height > screenHeight - IPHONE_X_INSET.bottom) {
        // Subtract inset if needed
        scrollIndicatorBottomInset -= screenHeight - top - height + IPHONE_X_INSET.bottom;
      }
    }

    // Animate keyboard height change
    Animated.timing(this.state.paddingBottom, {
      duration: event.duration || ANIMATION_DURATION,
      toValue: paddingBottom,
      easing: EASING,
      useNativeDriver: false,
    }).start();

    this.setState({ keyboardShown: true, scrollIndicatorBottomInset });

    const currentlyFocusedField = TextInput.State.currentlyFocusedInput
      ? findNodeHandle(TextInput.State.currentlyFocusedInput())
      : TextInput.State.currentlyFocusedField();
    if (!currentlyFocusedField) {
      return;
    }

    void this.scrollToInput(currentlyFocusedField);
  };

  private onKeyboardHide = (event: KeyboardEvent): void => {
    Animated.timing(this.state.paddingBottom, {
      duration: (event && event.duration) || ANIMATION_DURATION,
      toValue: 0,
      easing: EASING,
      useNativeDriver: false,
    }).start();

    this.setState({ keyboardShown: false, scrollIndicatorBottomInset: 0 });
  };

  private onFocus = (e: NativeSyntheticEvent<TargetedEvent>): void => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }

    if (!this.state.keyboardShown) {
      return;
    }

    void this.scrollToInput(e.nativeEvent.target);
  };

  scrollToInput = async (input: number): Promise<void> => {
    if (!this.scrollView) {
      return;
    }

    const innerViewNode = this.scrollView.getInnerViewNode();

    // Check if current focused TextInput is ancestor of ScrollView
    const isAncestor = await viewIsDescendantOf(input, innerViewNode);
    if (!isAncestor || !this.mounted) {
      return;
    }

    if (this.scrollToFocusedInputTimeout) {
      clearTimeout(this.scrollToFocusedInputTimeout);
      this.scrollToFocusedInputTimeout = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.scrollToFocusedInputTimeout = setTimeout(async () => {
      if (!this.mounted) {
        return;
      }

      try {
        const { extraHeight } = this.props;

        const handle = findNodeHandle(innerViewNode);

        if (!handle) {
          return;
        }

        const { top, height } = await measureLayout(input, handle);

        if (!this.mounted) {
          return;
        }

        const { top: innerViewPositionY } = await measureInWindow(handle);

        if (!this.mounted) {
          return;
        }

        const scrollDistance = this.scrollViewPosY - innerViewPositionY;

        let inset = 0;

        // Calc inset for iphoneX
        if (DeviceInfo.isIPhoneX_deprecated && this.scrollViewPosY < IPHONE_X_INSET.top) {
          inset = IPHONE_X_INSET.top - this.scrollViewPosY;
        }

        let scrollTo;

        if (top + height + extraHeight - scrollDistance > this.keyboardPosY) {
          // Input below the bottom
          scrollTo = top + extraHeight + height - this.keyboardPosY;
        } else if (top - scrollDistance - inset < extraHeight) {
          // Input above the top
          scrollTo = top - extraHeight - inset;
        }

        if (scrollTo === undefined || !this.scrollView) {
          // No need to scroll
          return;
        }

        this.scrollView.scrollTo({
          animated: true,
          x: 0,
          y: Math.max(0, scrollTo),
        });
      } catch {
        // nothing
      }
    }, ANIMATION_DURATION);
  };

  render() {
    const {
      contentContainerStyle,
      contentContainerStyleKeyboardShown,
      children,
      scrollViewContentContainerStyle,
      ...props
    } = this.props;
    const { keyboardShown } = this.state;

    const contentStyles = [
      contentContainerStyle,
      keyboardShown && contentContainerStyleKeyboardShown,
    ];

    const flatStyle: ViewStyle = StyleSheet.flatten(contentStyles);

    // Get bottom padding by yoga styles priority
    let paddingBottom: string | number = 0;
    if (flatStyle.paddingBottom !== undefined) {
      ({ paddingBottom } = flatStyle);
    } else if (flatStyle.paddingVertical !== undefined) {
      paddingBottom = flatStyle.paddingVertical;
    } else if (flatStyle.padding !== undefined) {
      paddingBottom = flatStyle.padding;
    }

    return (
      <ScrollView
        contentContainerStyle={[styles.contentContainer, scrollViewContentContainerStyle]}
        scrollIndicatorInsets={{ bottom: this.state.scrollIndicatorBottomInset }}
        {...props}
        keyboardDismissMode="interactive"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onFocus={this.onFocus}
        ref={this.onRef}
      >
        <Animated.View
          style={[
            contentStyles,
            { paddingBottom: Animated.add(this.state.paddingBottom, paddingBottom) },
          ]}
        >
          {children}
        </Animated.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
