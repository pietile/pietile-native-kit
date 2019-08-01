# KeyboardAwareScrollView

[![npm](https://img.shields.io/npm/v/@pietile-native-kit/keyboard-aware-srollview.svg?color=%2356C838)](https://www.npmjs.com/package/@pietile-native-kit/keyboard-aware-srollview)

Solves the very [common](https://www.reddit.com/r/reactnative/comments/azuy4v/were_the_react_native_team_aua/eiaa8vs/)
React Native problem of software keyboard popping over focused text input and tries to do it accurate and smooth (even on Android).
Following focused input when keyboard is already open is also supported. Internally KeyboardAwareScrollView uses
[ScrollView](https://facebook.github.io/react-native/docs/scrollview),
[UIManager](https://facebook.github.io/react-native/docs/direct-manipulation#other-native-methods) and
[Animated](https://facebook.github.io/react-native/docs/animations) to position an input in the field of view.

## Features

- Accurate positioning
- Smooth animation
- Works both on iOS and Android
- Small and simple code

## Installation

Using yarn

```bash
yarn add @pietile-native-kit/keyboard-aware-srollview
```

or using npm

```bash
npm install -S @pietile-native-kit/keyboard-aware-srollview
```

## Usage

Just put the content with inputs in `KeyboardAwareScrollView` and that's it.

List of specific `KeyboardAwareScrollView` props and methods is available [below](#api).
Everything else is passing to underlying [ScrollView](https://facebook.github.io/react-native/docs/scrollview).

## Example

```jsx
import React from 'react';

import { TextInput, Text } from 'react-native';
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-srollview';

function KeyboardAwareScrollViewExample() {
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <Text>KeyboardAwareSrollview</Text>
      <TextInput />
    </KeyboardAwareScrollView>
  );
}
```

## How to use with FlatList or SectionList?

Just pass `renderScrollComponent` props to list like below in example.

```jsx
import React, { useCallback } from 'react';

import { FlatList } from 'react-native';
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-srollview';

function KeyboardAwareFlatList({ ...props }) {
  const renderScrollComponent = useCallback(
    scrollProps => <KeyboardAwareScrollView {...scrollProps} />,
    [],
  );

  return <FlatList {...props} renderScrollComponent={renderScrollComponent} />;
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
