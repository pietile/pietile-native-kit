import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
  Animated,
  DeviceInfo,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  ViewPropTypes,
  findNodeHandle,
} from 'react-native';

import { measureInWindow, measureLayout, viewIsDescendantOf } from './uiManagerPromises';

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

const ANIMATION_DURATION = Platform.select({ ios: 250, other: 125 });

const IPHONE_X_INSET = {
  top: 44,
  bottom: 34,
};

/**
 * Keyboard aware scroll view.
 * Based on react-native KeyboardAvoidingView and react-native-keyboard-aware-scroll-view.
 */
class KeyboardAwareScrollView extends Component {
  _subscriptions = [];

  _scrollToFocusedInputTimeout = null;

  _scrollView = React.createRef();

  _mounted = false;

  state = {
    paddingBottom: new Animated.Value(0),
    keyboardShown: false,
    scrollIndicatorBottomInset: 0,
  };

  componentDidMount() {
    this._mounted = true;

    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillShow', this.onKeyboardShow),
        Keyboard.addListener('keyboardWillHide', this.onKeyboardHide),
      ];
      return;
    }

    this._subscriptions = [
      Keyboard.addListener('keyboardDidShow', this.onKeyboardShow),
      Keyboard.addListener('keyboardDidHide', this.onKeyboardHide),
    ];
  }

  componentWillUnmount() {
    this._mounted = false;

    if (this._scrollToFocusedInputTimeout) {
      clearTimeout(this._scrollToFocusedInputTimeout);
      this._scrollToFocusedInputTimeout = null;
    }

    this._subscriptions.forEach(subscription => subscription.remove());
    this._subscriptions = [];
  }

  updateScrollViewRef = scrollView => {
    this._scrollView.current = scrollView;

    const { innerRef } = this.props;
    if (!innerRef) {
      return;
    }

    if (typeof innerRef === 'function') {
      innerRef(scrollView);
      return;
    }

    innerRef.current = scrollView;
  };

  onKeyboardShow = async event => {
    if (!this._scrollView.current) {
      return;
    }

    // Get scroll view height and top position
    const { height, top } = await measureInWindow(findNodeHandle(this._scrollView.current));

    if (!this._mounted) {
      return;
    }

    // Save scroll view Y position
    this._scrollViewPosY = top;

    // Get keyboard position by Y axis at current view.
    this._keyboardPosY = event.endCoordinates.screenY - top;

    // Subtract status bar height for android.
    if (StatusBar.currentHeight) {
      this._keyboardPosY -= StatusBar.currentHeight;
    }

    // Calc padding bottom
    const paddingBottom = height - this._keyboardPosY;

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
    }).start();

    this.setState({ keyboardShown: true, scrollIndicatorBottomInset });

    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    if (!currentlyFocusedField) {
      return;
    }

    this.scrollToInput(currentlyFocusedField);
  };

  onKeyboardHide = event => {
    Animated.timing(this.state.paddingBottom, {
      duration: (event && event.duration) || ANIMATION_DURATION,
      toValue: 0,
      easing: EASING,
    }).start();

    this.setState({ keyboardShown: false, scrollIndicatorBottomInset: 0 });
  };

  onFocus = e => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }

    if (!this.state.keyboardShown) {
      return;
    }

    this.scrollToInput(e.nativeEvent.target);
  };

  scrollToInput = async input => {
    if (!this._scrollView.current) {
      return;
    }

    const innerViewNode = this._scrollView.current.getInnerViewNode();

    // Check if current focused TextInput is ancestor of ScrollView
    const isAncestor = await viewIsDescendantOf(input, innerViewNode);
    if (!isAncestor || !this._mounted) {
      return;
    }

    if (this._scrollToFocusedInputTimeout) {
      clearTimeout(this._scrollToFocusedInputTimeout);
      this._scrollToFocusedInputTimeout = null;
    }

    this._scrollToFocusedInputTimeout = setTimeout(async () => {
      if (!this._mounted) {
        return;
      }

      try {
        const { extraHeight } = this.props;

        const { top, height } = await measureLayout(input, findNodeHandle(innerViewNode));

        if (!this._mounted) {
          return;
        }

        const { top: innerViewPositionY } = await measureInWindow(findNodeHandle(innerViewNode));

        if (!this._mounted) {
          return;
        }

        const scrollDistance = this._scrollViewPosY - innerViewPositionY;

        let inset = 0;

        // Calc inset for iphoneX
        if (DeviceInfo.isIPhoneX_deprecated && this._scrollViewPosY < IPHONE_X_INSET.top) {
          inset = IPHONE_X_INSET.top - this._scrollViewPosY;
        }

        let scrollTo;
        if (top - scrollDistance - inset < extraHeight) {
          // Input above the top
          scrollTo = top - extraHeight - inset;
        } else if (top + height + extraHeight - scrollDistance > this._keyboardPosY) {
          // Input below the bottom
          scrollTo = top + extraHeight + height - this._keyboardPosY;
        }

        if (scrollTo === undefined || !this._scrollView.current) {
          // No need to scroll
          return;
        }

        this._scrollView.current.scrollTo({
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

    const flatStyle = StyleSheet.flatten(contentStyles);

    // Get bottom padding by yoga styles priority
    let paddingBottom = 0;
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
        onFocus={this.onFocus}
        ref={this.updateScrollViewRef}
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

KeyboardAwareScrollView.propTypes = {
  children: PropTypes.node,
  contentContainerStyle: ViewPropTypes.style,
  contentContainerStyleKeyboardShown: ViewPropTypes.style,
  extraHeight: PropTypes.number,
  onFocus: PropTypes.func,
  scrollViewContentContainerStyle: ViewPropTypes.style,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
};

KeyboardAwareScrollView.defaultProps = {
  extraHeight: 24,
};

export default React.forwardRef((props, ref) => (
  <KeyboardAwareScrollView innerRef={ref} {...props} />
));
