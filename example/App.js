/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { StyleSheet } from 'react-native';

import ExpandableViewExample from './src/ExpandableViewExample';
import FadeViewExample from './src/FadeViewExample';
import KeyboardAwareScrollviewExample from './src/KeyboardAwareScrollviewExample';
import PageSliderExample from './src/PageSliderExample';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

export default function App() {
  return (
    <KeyboardAwareScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
      <FadeViewExample style={[styles.example, styles.fadeView]} />
      <PageSliderExample style={styles.example} />
      <ExpandableViewExample style={styles.example} />
      <KeyboardAwareScrollviewExample />
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
