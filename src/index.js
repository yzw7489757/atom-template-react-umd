import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/styles/index.less';
import App from '@/views/App';

function renderWithHotReload(Index) {
  ReactDOM.render(
    <Index />,
    document.getElementById('root')
  );
}
renderWithHotReload(App);

if (module.hot) {
  module.hot.accept('./views/App/index', () => {
    const Index = require('./views/App/index').default;
    renderWithHotReload(Index);
  });
}
