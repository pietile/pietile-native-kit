import { ExpandableView } from '@pietile-native-kit/expandable-view';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function ExpandableViewExample({ style }: Props): JSX.Element {
  const [show, setShow] = useState(false);

  return (
    <View style={style}>
      <TouchableHighlight
        style={styles.touchable}
        underlayColor="#2286c3"
        onPress={() => {
          setShow(!show);
        }}
      >
        <Text style={styles.text}>Press me</Text>
      </TouchableHighlight>
      <ExpandableView show={show}>
        <View style={styles.content}>
          <Text style={styles.mushroom}>🍄🍄🍄</Text>
        </View>
      </ExpandableView>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    padding: 16,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#64b5f6',
    justifyContent: 'center',
  },
  mushroom: {
    fontSize: 86,
  },
});
