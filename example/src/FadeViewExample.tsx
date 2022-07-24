import { FadeView } from '@pietile-native-kit/fade-view';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

export function FadeViewExample({ style }) {
  const [cat, setCat] = useState(true);

  function onPress() {
    setCat(!cat);
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style}>
        <FadeView data={cat}>
          <View style={[styles.content, { backgroundColor: cat ? '#c4c' : '#bfb' }]}>
            <Text style={[styles.text]}>{cat ? '🐱' : '🐶'}</Text>
          </View>
        </FadeView>
      </View>
    </TouchableWithoutFeedback>
  );
}

FadeViewExample.propTypes = {
  // style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  content: {
    borderRadius: 16,
    padding: 16,
  },
  text: {
    fontSize: 86,
  },
});
