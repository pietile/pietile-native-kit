import { ExpandableView } from '@pietile-native-kit/expandable-view';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export function ExpandableViewExample({ style }) {
  const [show, setShow] = useState(false);

  function onPress() {
    setShow(!show);
  }

  return (
    <View style={style}>
      <TouchableHighlight style={styles.touchable} underlayColor="#2286c3" onPress={onPress}>
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

ExpandableViewExample.propTypes = {
  // style: ViewPropTypes.style,
};

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
