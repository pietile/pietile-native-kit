import { FadeView } from '@pietile-native-kit/fade-view';
import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function FadeViewExample({ style }: Props) {
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

const styles = StyleSheet.create({
  content: {
    borderRadius: 16,
    padding: 16,
  },
  text: {
    fontSize: 86,
  },
});
