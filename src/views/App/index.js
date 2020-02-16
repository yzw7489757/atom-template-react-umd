import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.less';
import HightLine from '../../higthLine/index';
const propTypes = {
  title: PropTypes.string.isRequired,
};

function App({ title }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <HightLine
        ranges={[]}
        enabled={true}
        onTextHighlighted={e => console.log(e)}
        id={'3'}
        onMouseOverHighlightedWord={e => console.log(e)}
        highlightStyle={{
          backgroundColor: '#fff',
        }}
        text={'Hello'}
      />
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

App.propTypes = propTypes;

export default App;
