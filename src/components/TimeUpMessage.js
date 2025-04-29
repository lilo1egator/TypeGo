import React from 'react';
import '../styles/TimeUpMessage.scss';

const TimeUpMessage = ({ visible, t }) => (
  <div className={`timeup-message${visible ? ' visible' : ''}`}>{t('timeup')}</div>
);

export default TimeUpMessage; 