import React from 'react';
import ReactDOM from 'react-dom';
import SimpleVScrollbar from './lib';

ReactDOM.render(
  <SimpleVScrollbar
    width={400}
    height={400}
    className="svs"
    autoHide={false}
  >
    <div>
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'red',
        opacity: '.5',
      }} />
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'orange',
        opacity: '.5',
      }} />
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'yellow',
        opacity: '.5',
      }} />
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'green',
        opacity: '.5',
      }} />
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'blue',
        opacity: '.5',
      }} />
    </div>
  </SimpleVScrollbar>,
  document.getElementById('root')
);
