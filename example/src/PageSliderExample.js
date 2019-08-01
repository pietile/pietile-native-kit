import React, { useState } from 'react';

import PageSlider from '@pietile-native-kit/page-slider';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';

export default function PageSliderExample({ style }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <View style={style}>
      <PageSlider
        mode="card"
        selectedPage={selectedPage}
        onCurrentPageChange={setCurrentPage}
        onSelectedPageChange={setSelectedPage}
      >
        <View style={[styles.page, { backgroundColor: 'red' }]}>
          <Text style={styles.text}>{'🐱'}</Text>
        </View>
        <View style={[styles.page, { backgroundColor: 'orange' }]}>
          <Text style={styles.text}>{'🐶'}</Text>
        </View>
        <View style={[styles.page, { backgroundColor: 'yellow' }]}>
          <Text style={styles.text}>{'🦖'}</Text>
        </View>
        <View style={[styles.page, { backgroundColor: 'green' }]}>
          <Text style={styles.text}>{'🐟'}</Text>
        </View>
      </PageSlider>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedPage(Math.max(selectedPage - 1, 0));
          }}
        >
          <Text>Left</Text>
        </TouchableOpacity>
        <Text>{currentPage}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedPage(Math.min(3, selectedPage + 1));
          }}
        >
          <Text>Right</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

PageSliderExample.propTypes = {
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    height: 128,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    padding: 8,
  },
});
