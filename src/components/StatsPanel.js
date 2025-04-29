import React from 'react';
import '../styles/StatsPanel.scss';

const StatsPanel = ({ speed, errors, t }) => (
  <section className="stats-panel">
    <div className="stat">
      <span className="stat-label">{t('speed')}</span>
      <span className="speed stat-value">{speed}</span>
      <span className="stat-unit">{t('wpm')}</span>
    </div>
    <div className="stat">
      <span className="stat-label">{t('errors')}</span>
      <span className="errors stat-value">{errors}</span>
    </div>
  </section>
);

export default StatsPanel; 