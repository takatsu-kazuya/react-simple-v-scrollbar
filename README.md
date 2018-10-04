# react-simple-v-scrollbar

It is a simple vertical scroll library.

## Installation and usage

```
yarn add -D simple-v-scrollbar
```

Then use it in your app:

```js
import React from 'react';
import SimpleVScrollbar from 'simple-v-scrollbar';

class App extends React.Component {
  render() {
    return (
      <SimpleVScrollbar width={500} height={300}>
        <div>contents1</div>
        <div>contents2</div>
        <div>contents3</div>
        <div>contents4</div>
        <div>contents5</div>
      </SimpleVScrollbar>
    );
  }
}
```
Note: If width / height is not specified, 100% is specified.

## Props

* `className` - give the class name (string)
* `width` - width. If not specified, 100% (number)
* `height` - height. If not specified, 100% (number)
* `scrollEnd` - event to be executed when the scroll reaches the bottom (function)
* `autoHide` - automatic hiding of scroll bars (boolean)
* `autoHideTimeout` - hide time (number)

## License

MIT
