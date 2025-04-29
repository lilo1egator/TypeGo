import React, { useState, useEffect, useRef, useContext } from 'react';
import TypingBox from './TypingBox';
import Controls from './Controls';
import StatsPanel from './StatsPanel';
import HistoryPanel from './HistoryPanel';
import TimeUpMessage from './TimeUpMessage';
import { LocaleContext } from '../contexts/LocaleContext';
import '../styles/TypingTrainer.scss';

const getPhrases = async (locale) => {
  const res = await fetch(`http://localhost:4000/api/phrases?lang=${locale}`);
  const data = await res.json();
  return data.phrases;
};

const TypingTrainer = ({ t }) => {
  const { locale } = useContext(LocaleContext);
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timer, setTimer] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('typingHistory')) || []);
  const [fetchError, setFetchError] = useState(false);
  const duration = 60;
  const phrasesCount = 7;
  const typingBoxRef = useRef();

  useEffect(() => {
    loadText();
    // eslint-disable-next-line
  }, [locale]);

  const loadText = async () => {
    setFetchError(false);
    try {
      const phrases = await getPhrases(locale);
      let arr = [];
      for (let i = 0; i < phrasesCount; i++) {
        arr.push(phrases[Math.floor(Math.random() * phrases.length)]);
      }
      setText(arr.join(' '));
      setUserInput([]);
      setCurrentIndex(0);
      setIsTimeUp(false);
      setTimeLeft(duration);
      setErrorCount(0);
    } catch (e) {
      setFetchError(true);
      setText('');
    }
  };

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      setTimer(setTimeout(() => setTimeLeft(timeLeft - 1), 1000));
    } else if (isStarted && timeLeft === 0) {
      finishTest();
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [isStarted, timeLeft]);

  useEffect(() => {
    if (isStarted && typingBoxRef.current) {
      typingBoxRef.current.focus();
    }
  }, [isStarted]);

  const handleKeyDown = (e) => {
    if (!isStarted || isTimeUp || fetchError) return;
    const chars = text.split('');
    // Якщо попередній символ неправильний, дозволяємо тільки Backspace
    if (
      currentIndex > 0 &&
      userInput[currentIndex - 1] !== undefined &&
      userInput[currentIndex - 1] !== chars[currentIndex - 1]
    ) {
      if (e.key === 'Backspace') {
        setCurrentIndex(currentIndex - 1);
        setUserInput((prev) => {
          const copy = [...prev];
          copy[currentIndex - 1] = undefined;
          return copy;
        });
      }
      return;
    }
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    if (e.key === ' ' || e.code === 'Space') e.preventDefault();
    if (e.key === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setUserInput((prev) => {
          const copy = [...prev];
          copy[currentIndex - 1] = undefined;
          return copy;
        });
      }
    } else {
      const expectedChar = chars[currentIndex];
      if (
        e.key === expectedChar ||
        (e.key === ' ' && expectedChar === ' ') ||
        (expectedChar === '-' && e.key === '-') ||
        (expectedChar === '—' && (e.key === '-' || e.key === '—'))
      ) {
        setUserInput((prev) => {
          const copy = [...prev];
          copy[currentIndex] = e.key;
          return copy;
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        setUserInput((prev) => {
          const copy = [...prev];
          copy[currentIndex] = e.key;
          return copy;
        });
        setErrorCount((c) => c + 1);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const startTest = () => {
    setIsStarted(true);
    setIsTimeUp(false);
    setUserInput([]);
    setCurrentIndex(0);
    setErrorCount(0);
    setTimeLeft(duration);
  };

  const stopTest = () => {
    setIsStarted(false);
    setIsTimeUp(false);
    setUserInput([]);
    setCurrentIndex(0);
    setErrorCount(0);
    setTimeLeft(duration);
    loadText();
  };

  const finishTest = () => {
    setIsStarted(false);
    setIsTimeUp(true);
    const typedCharacters = userInput.length;
    const typedWords = typedCharacters / 5;
    const wpm = Math.round(typedWords);
    const result = {
      wpm,
      errors: errorCount,
      date: new Date().toLocaleString()
    };
    const newHistory = [result, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('typingHistory', JSON.stringify(newHistory));
    loadText();
  };

  return (
    <main className="main-layout" tabIndex={0} ref={typingBoxRef} onKeyDown={handleKeyDown}>
      <section className="typing-area">
        <TypingBox text={text} userInput={userInput} currentIndex={currentIndex} />
        <div className="timer-progress">
          <div className="timer-progress__bar" style={{ width: `${(timeLeft / duration) * 100}%` }} />
          <div className="timer-progress__time">
            <span className={`timer${timeLeft <= 10 && isStarted ? ' timer--pulse' : ''}`}>{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>
        <Controls isStarted={isStarted || fetchError} onStart={startTest} onStop={stopTest} t={t} />
        {fetchError && <div style={{color: 'red', marginTop: 12}}>Не вдалося завантажити фрази. Спробуйте пізніше.</div>}
      </section>
      <aside className="side-panel">
        <StatsPanel speed={Math.round(userInput.length / 5)} errors={errorCount} t={t} />
        <HistoryPanel history={history} t={t} />
      </aside>
      <TimeUpMessage visible={isTimeUp} t={t} />
    </main>
  );
};

export default TypingTrainer; 