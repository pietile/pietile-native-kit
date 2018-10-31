import React, { Component } from 'react';

import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { Animated, Easing, ViewPropTypes } from 'react-native';

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

// Fade animate on data change
class FadeView extends Component {
  constructor(props) {
    super(props);

    const { children } = props;
    this.state = {
      opacity: new Animated.Value(1),
      children,
    };
  }

  componentWillReceiveProps({ children: newChildren, data: newData, duration }) {
    const { data, children } = this.props;

    const dataIsEqual = isEqual(data, newData);

    if (dataIsEqual && !isEqual(children, newChildren)) {
      this.setState({ children: newChildren });
      return;
    }

    if (dataIsEqual) {
      return;
    }

    Animated.timing(this.state.opacity, {
      duration,
      easing: EASING,
      toValue: 0,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      this.setState({ children: newChildren });
      Animated.timing(this.state.opacity, {
        duration,
        easing: EASING,
        toValue: 1,
      }).start();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props.style !== nextProps.style;
  }

  render() {
    const { opacity, children } = this.state;
    return <Animated.View style={[this.props.style, { opacity }]}>{children}</Animated.View>;
  }
}

FadeView.propTypes = {
  children: PropTypes.node,
  data: PropTypes.any,
  style: ViewPropTypes.style,
  duration: PropTypes.number,
};

FadeView.defaultProps = {
  duration: 150,
};

export default FadeView;
