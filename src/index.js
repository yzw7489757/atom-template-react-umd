import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/styles/index.less';
import App from '@/views/App';
console.log(process.env.REQUEST_BASE_URL);
ReactDOM.render(<App title="hello React.js" />, document.getElementById('root'));
