import React from 'react'
import ReactDOM from 'react-dom'

function Demo() {
  return <h1>Everything seems to be running!</h1>;
}

const element = <Demo/>;
ReactDOM.render(
  element,
  document.getElementById('myapp')
);
