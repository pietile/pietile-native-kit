# PageSlider

[![npm version](https://badgen.net/npm/v/@pietile-native-kit/page-slider?color=56C838)](https://www.npmjs.com/package/@pietile-native-kit/page-slider)

Helps to implement swipeable pages. `PageSlider` is controlled with `selectedPage` prop compnent and
can work in two modes: `page` when page occupies whole width of the screen and `card` when
adjacent pages are visible at sides.

<img src="https://media.giphy.com/media/IgX3ycAhBlONUdl9zd/giphy.gif" />

## Installation

Using yarn

```sh
yarn add @pietile-native-kit/page-slider
```

or using npm

```sh
npm install -S @pietile-native-kit/page-slider
```

## Usage

`PageSlider` should occupy whole width of the screen. Each element inside will be wrapped
with a view and you can safely use all available space in it. `PageSlider` is controlled so you should
pass at least `selectedPage` and implement `onSelectedPageChange`. There is also optional `onCurrentPageChange`
callback that fires currently active page (for example while the page is being dragged). By default
`PageSlider` works in `page` mode.

## Example

```jsx
import React, { useState } from 'react';

import PageSlider from '@pietile-native-kit/page-slider';
import { StyleSheet, Text, View } from 'react-native';

function PageSliderExample() {
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <PageSlider
      style={styles.pageSlider}
      selectedPage={selectedPage}
      onSelectedPageChange={setSelectedPage}
    >
      <View style={[styles.page, { backgroundColor: 'red' }]}>
        <Text>1</Text>
      </View>
      <View style={[styles.page, { backgroundColor: 'orange' }]}>
        <Text>2</Text>
      </View>
      <View style={[styles.page, { backgroundColor: 'yellow' }]}>
        <Text>3</Text>
      </View>
    </PageSlider>
  );
}

const styles = StyleSheet.create({
  pageSlider: {
    width: '100%',
  },
  page: {
    alignItems: 'center',
    height: 128,
    justifyContent: 'center',
    padding: 16,
  },
});
```

## API

### Properties

| name                   | description                               |     type | default |
| :--------------------- | :---------------------------------------- | -------: | :------ |
| children               | Content                                   |     Node | -       |
| mode                   | "page" or "card"                          |   string | page    |
| contentPaddingVertical | Vertical padding of content container     |   number | -       |
| pageMargin             | Space between pages                       |   number | 8       |
| peek                   | Space between page and edge of the screen |   number | 24      |
| selectedPage           | Selected page index                       |   number | -       |
| style                  | Style of component itself                 |    style | -       |
| onCurrentPageChange    | Fires when current page changed           | function | -       |
| onSelectedPageChange   | Fires when selected page changed          | function | -       |

## License

Pietile PageSlider is MIT License.
