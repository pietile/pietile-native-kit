# ExpandableView

[![npm version](https://badgen.net/npm/v/@pietile-native-kit/expandable-view?color=56C838)](https://www.npmjs.com/package/@pietile-native-kit/expandable-view)

Manages content height gracefully allowing to alternate betweeen two states: expanded and collapsed.
ExpandableView doesn't require setting content height explicitly and measures it automatically.
Useful for building accordion-like components.

<img src="https://media.giphy.com/media/ejxlyN0ZkRTbgA8g81/giphy.gif" />

## Installation

Using yarn

```sh
yarn add @pietile-native-kit/expandable-view
```

or using npm

```sh
npm install -S @pietile-native-kit/expandable-view
```

## Usage

Usage is quite simple: put content in `ExpandableView` and control `show` property.

## Example

```jsx
import React, { useState } from 'react';

import ExpandableView from '@pietile-native-kit/expandable-view';
import { Text, TouchableHighlight, View, ViewPropTypes } from 'react-native';

function ExpandableViewExample({ style }) {
  const [show, setShow] = useState(true);

  function onPress() {
    setShow(!show);
  }

  return (
    <View>
      <TouchableHighlight onPress={onPress}>
        <Text style={{ padding: 8 }}>Toggle</Text>
      </TouchableHighlight>

      <ExpandableView show={show}>
        <Text style={{ fontSize: 86 }}>Expandable content</Text>
      </ExpandableView>
    </View>
  );
}
```

## API

### Properties

| name         | description                                                                   |    type | default |
| :----------- | :---------------------------------------------------------------------------- | ------: | :------ |
| children     | Content                                                                       |    Node | -       |
| contentStyle | Style of container that wraps children and used to measure content dimensions |   style | -       |
| show         | Show or hide content                                                          | boolean | false   |
| style        | Style of component itself                                                     |   style | -       |

## License

Pietile ExpandableView is MIT License.
