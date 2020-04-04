import React, { useReducer, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { Animated, Easing, ViewPropTypes } from 'react-native';

import { useIsMounted } from './useIsMounted';

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

function FadeView({ children, data, duration, style }) {
  const isMounted = useIsMounted();

  const prevData = useRef(data);
  const currentChildren = useRef(children);
  const hiding = useRef(false);

  const [opacity] = useState(() => new Animated.Value(1));
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (!isEqual(prevData.current, data)) {
    prevData.current = data;
    hiding.current = true;

    Animated.timing(opacity, {
      duration,
      easing: EASING,
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || !isMounted()) {
        return;
      }

      hiding.current = false;
      forceUpdate({});

      Animated.timing(opacity, {
        duration,
        easing: EASING,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  } else if (!hiding.current) {
    currentChildren.current = children;
  }

  return <Animated.View style={[style, { opacity }]}>{currentChildren.current}</Animated.View>;
}

FadeView.propTypes = {
  children: PropTypes.node,
  data: PropTypes.any,
  duration: PropTypes.number,
  style: ViewPropTypes.style,
};

FadeView.defaultProps = {
  duration: 150,
};

export default FadeView;
