import React, { useReducer, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Animated, Easing, StyleProp, ViewProps } from 'react-native';
import { useIsMounted } from './useIsMounted';

interface Props {
  children?: React.ReactNode;
  data: unknown;
  duration?: number;
  style?: StyleProp<ViewProps>;
}

const EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function FadeView({ children, data, duration = 150, style }: Props): JSX.Element {
  const isMounted = useIsMounted();

  const prevData = useRef(data);
  const currentChildren = useRef(children);
  const hiding = useRef(false);

  const [opacity] = useState(() => new Animated.Value(1));
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

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
      forceUpdate();

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
