import React, { Component } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  show: boolean;
  style?: StyleProp<ViewStyle>;
}

interface State {
  height: Animated.Value | 'auto';
  opacity: Animated.Value;
  state: number;
}

const COLLAPSE_DURATION = 250;
const EXPAND_DURATION = 250;

// ExpandableView state
const STATE = {
  COLLAPSING: 0,
  COLLAPSED: 1,
  START_EXPANDING: 2,
  EXPANDING: 3,
  EXPANDED: 4,
};

// Animated accordion with content of any height.
export class ExpandableView extends Component<Props, State> {
  private fullHeight = 0;

  private animation: Animated.CompositeAnimation | null = null;

  constructor(props: Props) {
    super(props);

    if (props.show) {
      this.state = {
        height: 'auto',
        opacity: new Animated.Value(1),
        state: STATE.EXPANDED,
      };
    } else {
      this.state = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
        state: STATE.COLLAPSED,
      };
    }
  }

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.show && this.props.show) {
      if (this.state.state === STATE.COLLAPSING) {
        // Already in transition state. Interrupt current animation and go opposite way.
        this.expand();

        return;
      }

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ state: STATE.START_EXPANDING });
    } else if (prevProps.show && !this.props.show) {
      this.collapse();
    }
  }

  private onLayout = (e: LayoutChangeEvent): void => {
    // Save full element height
    this.fullHeight = e.nativeEvent.layout.height;

    if (this.state.state === STATE.EXPANDED) {
      // Set initial height
      if (this.state.height === 'auto') {
        this.setState({ height: new Animated.Value(this.fullHeight) });
        return;
      }

      // ExpandableView was mounted expanded so initial height is full height
      this.state.height.setValue(this.fullHeight);
    } else if (this.state.state === STATE.START_EXPANDING) {
      this.expand();
    }
  };

  // Start collapsing
  private collapse = (): void => {
    if (this.state.state === STATE.COLLAPSED || this.state.state === STATE.COLLAPSING) {
      // Nothing to do
      return;
    }

    if (this.animation) {
      // Stop if animating
      this.animation.stop();
      this.animation = null;
    }

    // Set state and start animations
    this.setState({ state: STATE.COLLAPSING }, () => {
      if (this.state.height === 'auto') {
        // Shouldn't be here
        this.setState({ state: STATE.COLLAPSED });

        return;
      }

      this.animation = Animated.parallel([
        Animated.timing(this.state.height, {
          duration: COLLAPSE_DURATION,
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.opacity, {
          duration: COLLAPSE_DURATION,
          toValue: 0,
          useNativeDriver: false,
        }),
      ]);

      this.animation.start(({ finished }) => {
        if (!finished) {
          // If not finished then animation has been
          // interrupted and cleaned by other code
          return;
        }

        this.animation = null;
        this.setState({ state: STATE.COLLAPSED });
      });
    });
  };

  // Start expanding
  private expand = (): void => {
    if (this.state.state === STATE.EXPANDED || this.state.state === STATE.EXPANDING) {
      // Nothing to do
      return;
    }

    if (this.animation) {
      // Stop if animating
      this.animation.stop();
      this.animation = null;
    }

    // Set state and start animations
    this.setState({ state: STATE.EXPANDING }, () => {
      if (this.state.height === 'auto') {
        // Shouldn't be here
        this.setState({ state: STATE.EXPANDED });

        return;
      }

      this.animation = Animated.parallel([
        Animated.timing(this.state.height, {
          duration: EXPAND_DURATION,
          toValue: this.fullHeight,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.opacity, {
          duration: EXPAND_DURATION,
          toValue: 1,
          useNativeDriver: false,
        }),
      ]);

      this.animation.start(({ finished }) => {
        if (!finished) {
          // If not finished then animation has been
          // interrupted and cleaned by other code
          return;
        }

        this.animation = null;
        this.setState({ state: STATE.EXPANDED });
      });
    });
  };

  render(): JSX.Element | null {
    const { children, contentStyle, style } = this.props;
    const { height, opacity, state } = this.state;

    if (state === STATE.COLLAPSED) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, style, { height }]}>
        <Animated.View
          style={[state !== STATE.EXPANDED && styles.offscreen, { opacity }, contentStyle]}
          onLayout={this.onLayout}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  offscreen: {
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
  },
});
