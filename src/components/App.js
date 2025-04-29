import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LocaleProvider, LocaleContext } from '../contexts/LocaleContext';
import Header from './Header';
import TypingTrainer from './TypingTrainer';
import '../styles/main.scss';

const translations = {
  en: {
    start: 'Start',
    stop: 'Stop',
    speed: 'Speed',
    errors: 'Errors',
    wpm: 'WPM',
    history: 'History',
    noHistory: 'No history yet',
    timeup: 'Time is up!'
  },
  ua: {
    start: 'Старт',
    stop: 'Стоп',
    speed: 'Швидкість',
    errors: 'Помилки',
    wpm: 'ЗНХ',
    history: 'Історія',
    noHistory: 'Історія порожня',
    timeup: 'Час вийшов!'
  }
};

const App = () => (
  <ThemeProvider>
    <LocaleProvider>
      <LocaleContext.Consumer>
        {({ locale }) => {
          const t = (key) => translations[locale][key] || key;
          return (
            <div className="container">
              <Header />
              <TypingTrainer t={t} />
            </div>
          );
        }}
      </LocaleContext.Consumer>
    </LocaleProvider>
  </ThemeProvider>
);

export default App; 