import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
  Animated,
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

const ANIMATION_DURATION = 125;

/**
 * Keyboard aware scroll view.
 * Based on react-native KeyboardAvoidingView and react-native-keyboard-aware-scroll-view.
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

    // Destruction is necessary because keyboardDidHide on android return null
    const { duration = ANIMATION_DURATION, endCoordinates } = event || {};

    const { height: screenHeight } = Dimensions.get('screen');

    // Get scroll view height and top position
    const { height, top } = await measureInWindow(findNodeHandle(this._scrollView.current));

    if (!this._mounted) {
      return;
    }

    // Save scroll view Y position
    this._scrollViewPosY = top;

    /**
     * Get keyboard position by Y axis at current view.
     * Subtract status bar height for android.
     */
    this._keyboardPosY = endCoordinates
      ? endCoordinates.screenY - top - (StatusBar.currentHeight || 0)
      : screenHeight;

    // Calc padding bottom
    const paddingBottom =
      endCoordinates && endCoordinates.screenY !== screenHeight ? height - this._keyboardPosY : 0;

    // Animate keyboard height change
    Animated.timing(this.state.paddingBottom, {
      duration,
      toValue: paddingBottom,
      easing: EASING,
    }).start();

    if (paddingBottom === 0) {
      this.setState({ keyboardShown: false });
      return;
    }

    this.setState({ keyboardShown: true });

    if (this.props.disableAutoScroll) {
      return;
    }

    const currentlyFocusedField = TextInput.State.currentlyFocusedField();
    if (!currentlyFocusedField) {
      return;
    }

    this.scrollToFocusedInput(currentlyFocusedField);
  };

  scrollToFocusedInput = async currentlyFocusedField => {
    if (!this._scrollView.current) {
      return;
    }

    const innerViewNode = this._scrollView.current.getInnerViewNode();

    // Check if current focused TextInput is ancestor of ScrollView
    const isAncestor = await viewIsDescendantOf(currentlyFocusedField, innerViewNode);
    if (!isAncestor || !this._mounted) {
      return;
    }

    if (this._scrollToFocusedInputTimeout) {
      clearTimeout(this._scrollToFocusedInputTimeout);
      this._scrollToFocusedInputTimeout = null;
    }

    this._scrollToFocusedInputTimeout = setTimeout(async () => {
      try {
        const { extraHeight } = this.props;

        const { top, height } = await measureLayout(
          currentlyFocusedField,
          findNodeHandle(innerViewNode),
        );

        if (!this._mounted) {
          return;
        }

        const { top: innerViewPositionY } = await measureInWindow(findNodeHandle(innerViewNode));

        if (!this._mounted) {
          return;
        }

        const scrollDistance = this._scrollViewPosY - innerViewPositionY;

        let scrollTo;
        if (top - extraHeight - scrollDistance < 0) {
          // Input above the top
          scrollTo = top - extraHeight;
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
        ref={this._scrollView}
        keyboardDismissMode="interactive"
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
  disableAutoScroll: PropTypes.bool,
  extraHeight: PropTypes.number,
  onScrollViewLayout: PropTypes.func,
  scrollViewContentContainerStyle: ViewPropTypes.style,
};

KeyboardAwareScrollView.defaultProps = {
  extraHeight: 24,
};

export default KeyboardAwareScrollView;
