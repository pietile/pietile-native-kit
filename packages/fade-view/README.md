# FadeView

[![npm version](https://badgen.net/npm/v/@pietile-native-kit/fade-view?color=56C838)](https://www.npmjs.com/package/@pietile-native-kit/fade-view)
[![install size](https://badgen.net/packagephobia/install/@pietile-native-kit/fade-view)](https://packagephobia.now.sh/result?p=@pietile-native-kit/fade-view)

Changes content with _FadeOut-FadeIn_ animation. `FadeView` uses `data` prop to know when start
the transition. Useful in situations when you want to change content smoothly, implementing tabs
content for example.

<img src="https://media.giphy.com/media/1zgdmaNWIiMIJm9klY/giphy.gif" />

## Installation

Using yarn

```sh
yarn add @pietile-native-kit/fade-view
```

or using npm

```sh
npm install -S @pietile-native-kit/fade-view
```

## Usage

Wrap the content in `FadeView` and set `data` to value that controls content. Every time data
changes `FadeView` will remember children, play _FadeOut_ animation and then _FadeIn_ with current children
already. So it's important to notice that `FadeView` passthrough children all the time except when
playing _FadeOut_.

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

## API

### Properties

| name     | description                                                     |   type | default |
| :------- | :-------------------------------------------------------------- | -----: | :------ |
| children | Content                                                         |   Node | -       |
| data     | Marker property for telling the FadeView to do _FadeOut-FadeIn_ |    any | -       |
| duration | Hide and show animations duration                               | number | 150     |
| style    | Style of component                                              |  style | -       |

## License

Pietile FadeView is MIT License.
