import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ExpandableViewExample } from './src/ExpandableViewExample';
import { FadeViewExample } from './src/FadeViewExample';
import { KeyboardAwareScrollViewExample } from './src/KeyboardAwareScrollViewExample';
import { PageSliderExample } from './src/PageSliderExample';

export default function App() {
  return (
    <KeyboardAwareScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
      <FadeViewExample style={[styles.example, styles.fadeView]} />
      <PageSliderExample style={styles.example} />
      <ExpandableViewExample style={styles.example} />
      <KeyboardAwareScrollViewExample />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  example: {
    marginBottom: 8,
  },
  fadeView: {
    alignSelf: 'center',
  },
});
