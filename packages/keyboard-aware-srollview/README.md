# KeyboardAwareScrollView

Solves the very [common](https://www.reddit.com/r/reactnative/comments/azuy4v/were_the_react_native_team_aua/eiaa8vs/)
React Native problem of software keyboard popping over focused text input and tries to do it accurate and smooth(even on Android).
Following focused input when keyboaed is already open is also supported. Internaly Pietile KeyboardAwareScrollView uses
[ScrollView](https://facebook.github.io/react-native/docs/scrollview),
[UIManager](https://facebook.github.io/react-native/docs/direct-manipulation#other-native-methods) and
[Animated](https://facebook.github.io/react-native/docs/animations) to position an input in the field of view.

## Features

- Accurate positioning
- Smooth animation
- Works both on iOS and Android
- Small and simple code

## Usage

Just put the content with inputs in `KeyboardAwareScrollView` and that's it.

List of specific `KeyboardAwareScrollView` props and methods is available [below](#api).
Everything else is passing to underlying [ScrollView](https://facebook.github.io/react-native/docs/scrollview).

## Example

```jsx
import React from 'react';

import { TextInput, Text } from 'react-native';
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-srollview';

function Screen() {
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <Text>KeyboardAwareSrollview</Text>
      <TextInput />
    </KeyboardAwareScrollView>
  );
}
```

## API

### Properties

| name                               | description                                                                                                |   type | default |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------- | -----: | :------ |
| children                           | Content                                                                                                    |   Node | -       |
| contentContainerStyle              | Style of container that wraps children and used to adjust bottom padding to keyboard                       |  style | -       |
| contentContainerStyleKeyboardShown | Style that applied to contentContainerStyle when keyboard is shown                                         |  style | -       |
| extraHeight                        | Additional height between keyboard and focused input                                                       | number | 24      |
| scrollViewContentContainerStyle    | See [contentContainerStyle](https://facebook.github.io/react-native/docs/scrollview#contentcontainerstyle) |  style | -       |

### Methods

| name                 | description     |
| :------------------- | :-------------- |
| scrollToInput(input) | Scroll to input |

## Acknowledge

Inspired by [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) and [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview)

## License

Pietile KeyboardAwareScrollView is MIT License.
