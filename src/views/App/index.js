import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';
import React from 'react';
import less from './index.module.less';

setConfig({
  reloadHooks: false,
});

function App() {
  return (
    <div className={less.fullPage}>
      <div className={less.box}>
        <h1>Hello, Development</h1>
      </div>
    </div>
  );
}
export default hot(App);
