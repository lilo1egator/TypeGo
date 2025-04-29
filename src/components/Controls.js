import React from 'react';
import '../styles/Controls.scss';

const Controls = ({ isStarted, onStart, onStop, t }) => (
  <div className="controls">
    <button className="start button" onClick={onStart} disabled={isStarted}>
      {t('start')}
    </button>
    <button className="stop button" onClick={onStop} disabled={!isStarted}>
      {t('stop')}
    </button>
  </div>
);

export default Controls; 