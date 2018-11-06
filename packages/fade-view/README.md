# FadeView

View that changes content gracefully

<img src="https://media.giphy.com/media/1zgdmaNWIiMIJm9klY/giphy.gif" />

## Install

```sh
yarn add @pietile-native-kit/fade-view
or
npm install --save @pietile-native-kit/fade-view
```

## Code example

```jsx
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FadeView from '@pietile-native-kit/fade-view';

class FadeViewExample extends Component {
  state = { isCat: true };

  onPress = () => this.setState(({ isCat }) => ({ isCat: !isCat }));

  render() {
    const { isCat } = this.state;

    return (
      <FadeView style={styles.container} data={isCat}>
        <TouchableOpacity
          style={[styles.touchable, { backgroundColor: isCat ? '#c4c' : '#bfb' }]}
          onPress={this.onPress}
        >
          <Text style={styles.text}>{isCat ? '🐱' : '🐶'}</Text>
        </TouchableOpacity>
      </FadeView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    borderRadius: 16,
    padding: 16,
  },
  text: {
    fontSize: 86,
  },
});

export default FadeViewExample;
```
