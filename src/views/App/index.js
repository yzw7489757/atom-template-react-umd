import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';
import React from 'react';
import less from './index.module.css';

setConfig({
  reloadHooks: false
});

function App() {
  return (
    <div className={less.page}>
      Hello
    </div>
  );
}
export default hot(App);
