import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.less';

const propTypes = {
  title: PropTypes.string.isRequired,
};

function App({ title }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

App.propTypes = propTypes;

export default App;
