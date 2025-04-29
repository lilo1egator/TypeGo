import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LocaleContext } from '../contexts/LocaleContext';
import '../styles/Header.scss';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { locale, toggleLocale } = useContext(LocaleContext);
  return (
    <header className="header">
      <div className="logo">Type<span className="accent">Go</span></div>
      <button className="theme-switch" onClick={toggleTheme} aria-label="Switch theme">
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      <button className="lang-switch" onClick={toggleLocale} aria-label="Switch language">
        {locale === 'en' ? 'UA' : 'EN'}
      </button>
    </header>
  );
};

export default Header; 