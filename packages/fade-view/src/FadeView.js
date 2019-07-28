import React, { useRef, useState } from 'react';

import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { Animated, Easing, ViewPropTypes } from 'react-native';

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

function FadeView({ children, data, duration, style }) {
  const lastData = useRef(data);

  const lastChildren = useRef(children);
  lastChildren.current = children;

  const [childrenToRender, setChildrenToRender] = useState(() => ({ current: children }));
  const [opacity] = useState(() => new Animated.Value(1));

  const hideAnimationRunning = useRef(false);

  if (!isEqual(lastData.current, data)) {
    lastData.current = data;
    hideAnimationRunning.current = true;

    Animated.timing(opacity, {
      duration,
      easing: EASING,
      toValue: 0,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      hideAnimationRunning.current = false;
      setChildrenToRender({ current: lastChildren.current });

      Animated.timing(opacity, {
        duration,
        easing: EASING,
        toValue: 1,
      }).start();
    });
  } else if (!hideAnimationRunning.current) {
    childrenToRender.current = children;
  }

  return <Animated.View style={[style, { opacity }]}>{childrenToRender.current}</Animated.View>;
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
