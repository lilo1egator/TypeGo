import React from 'react';
import '../styles/HistoryPanel.scss';

const HistoryPanel = ({ history, t }) => (
  <section className="history-panel">
    <h3 className="history-title">{t('history')}</h3>
    <ul className="history-list">
      {history.length === 0 && <li>{t('noHistory')}</li>}
      {history.map((result, idx) => {
        let className = '';
        if (idx === 0) className = 'gold';
        else if (idx === 1) className = 'silver';
        else if (idx === 2) className = 'bronze';
        return (
          <li key={idx} className={className}>
            {`${result.date} — ${t('speed')}: ${result.wpm} ${t('wpm')}, ${t('errors')}: ${result.errors}`}
          </li>
        );
      })}
    </ul>
  </section>
);

export default HistoryPanel; 