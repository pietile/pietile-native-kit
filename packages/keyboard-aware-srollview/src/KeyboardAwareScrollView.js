import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
  Animated,
  DeviceInfo,
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

const ANIMATION_DURATION = 125;

const IPHONE_X_INSET = 44;

/**
 * Keyboard aware scroll view.
 * Based on react-native KeyboardAvoidingView and react-native-keyboard-aware-scroll-view.
 *
 * Scheme:
 * +-------------------------+ <---+ 0
 * | Inset                   |
 * +-------------------------+
 * |                         |
 * |                         |
 * XXXXXXXXXXXXXXXXXXXXXXXXXXX <---+ Scroll distance
 * X Extra height            X
 * X-------------------------X
 * X                         X
 * X                         X
 * X +---------------------+ X <---+ Top
 * X | Input height        | X
 * X +---------------------+ X
 * X                         X
 * X                         X
 * X                         X
 * ########################### <---+ Keyboard
 * #                         #
 * #                         #
 * #-------------------------#
 * # Extra height            #
 * #XXXXXXXXXXXXXXXXXXXXXXXXX#
 * #                         #
 * #                         #
 * #                         #
 * ###########################
 *
 */
class KeyboardAwareScrollView extends Component {
  _subscriptions = [];

  _scrollToFocusedInputTimeout = null;

  _scrollView = React.createRef();

  _mounted = false;

  state = { paddingBottom: new Animated.Value(0), keyboardShown: false };

  componentDidMount() {
    this._mounted = true;

    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardChange),
      ];
      return;
    }

    this._subscriptions = [
      Keyboard.addListener('keyboardDidShow', this.onKeyboardChange),
      Keyboard.addListener('keyboardDidHide', this.onKeyboardChange),
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

  onKeyboardChange = async event => {
    if (!this._scrollView.current) {
      return;
    }

    if (!event || !event.endCoordinates.height) {
      Animated.timing(this.state.paddingBottom, {
        duration: (event && event.duration) || ANIMATION_DURATION,
        toValue: 0,
        easing: EASING,
      }).start();

      this.setState({ keyboardShown: false });

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

    // Animate keyboard height change
    Animated.timing(this.state.paddingBottom, {
      duration: event.duration || ANIMATION_DURATION,
      toValue: paddingBottom,
      easing: EASING,
    }).start();

    this.setState({ keyboardShown: true });

    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    if (!currentlyFocusedField) {
      return;
    }

    this.scrollToInput(currentlyFocusedField);
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

        let { top: innerViewPositionY } = await measureInWindow(findNodeHandle(innerViewNode));

        if (!this._mounted) {
          return;
        }

        const scrollDistance = this._scrollViewPosY - innerViewPositionY;

        let inset = 0;
        if (DeviceInfo.isIPhoneX_deprecated && this._scrollViewPosY < IPHONE_X_INSET) {
          inset = IPHONE_X_INSET - this._scrollViewPosY;
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
        {...props}
        keyboardDismissMode="interactive"
        onFocus={this.onFocus}
        ref={this._scrollView}
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
};

KeyboardAwareScrollView.defaultProps = {
  extraHeight: 24,
};

export default KeyboardAwareScrollView;
