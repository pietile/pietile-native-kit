import React, { useState } from 'react';

import PageSlider from '@pietile-native-kit/page-slider';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';

export default function PageSliderExample({ style }) {
  const [, setCurrentPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <PageSlider
      style={[styles.slider, style]}
      mode="card"
      selectedPage={selectedPage}
      onCurrentPageChange={setCurrentPage}
      onSelectedPageChange={setSelectedPage}
    >
      <View style={[styles.page, { backgroundColor: 'red' }]}>
        <Text style={styles.text}>1</Text>
      </View>
      <View style={[styles.page, { backgroundColor: 'orange' }]}>
        <Text style={styles.text}>2</Text>
      </View>
      <View style={[styles.page, { backgroundColor: 'yellow' }]}>
        <Text style={styles.text}>3</Text>
      </View>
      <View style={[styles.page, { backgroundColor: 'green' }]}>
        <Text style={styles.text}>4</Text>
      </View>
    </PageSlider>
  );
}

PageSliderExample.propTypes = {
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  slider: {
    flexGrow: 0,
  },
  page: {
    alignItems: 'center',
    height: 128,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 32,
  },
});
