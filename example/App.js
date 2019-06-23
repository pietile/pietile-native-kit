/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { SafeAreaView, StyleSheet } from 'react-native';

import ExpandableViewExample from './src/ExpandableViewExample';
import FadeViewExample from './src/FadeViewExample';
import PageSliderExample from './src/PageSliderExample';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FadeViewExample style={[styles.example, styles.fadeView]} />
      <PageSliderExample style={styles.example} />
      <ExpandableViewExample />
    </SafeAreaView>
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
