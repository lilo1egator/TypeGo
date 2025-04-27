'use strict'

class TypingTrainer {
  constructor(options = {}) {
    this.duration = options.duration || 60;
    this.phrasesCount = options.phrasesCount || 10;
    this.historyKey = 'typingHistory';
    this.text = [];
    this.userInput = [];
    this.currentIndex = 0;
    this.isStarted = false;
    this.timeLeft = this.duration;
    this.timerInterval = null;
    this.errorCount = 0;
    this.elements = {};
    this.isTimeUp = false;
    this.init();
  }

  init() {
    this.cacheElements();
    this.initTheme();
    this.initEventListeners();
    this.renderHistory();
    this.loadAndRenderText();
    this.updateStats();
  }

  cacheElements() {
    this.elements.typingBox = document.querySelector('.typing-box');
    this.elements.startButton = document.querySelector('.start');
    this.elements.timer = document.querySelector('.timer');
    this.elements.speed = document.querySelector('.speed');
    this.elements.errors = document.querySelector('.errors');
    this.elements.historyList = document.getElementById('history-list');
    this.elements.themeSwitch = document.getElementById('theme-switch');
    this.elements.body = document.body;
  }

  async loadAndRenderText() {
    try {
      const res = await fetch('words.json');
      const data = await res.json();
      const phrases = data.phrases;
      this.text = [];
      for (let i = 0; i < this.phrasesCount; i++) {
        this.text.push(phrases[Math.floor(Math.random() * phrases.length)]);
      }
      const fullText = this.text.join(' ');
      this.renderText(fullText);
      this.currentIndex = 0;
      this.userInput = [];
      this.isTimeUp = false;
    } catch (error) {
      this.elements.typingBox.textContent = 'Error loading text.';
    }
  }

  renderText(text) {
    this.elements.typingBox.innerHTML = text
      .split('')
      .map(char => `<span class="default">${char}</span>`)
      .join('');
    this.elements.typingBox.classList.remove('inactive');
    this.removeTimeUpMessage();
  }

  updateStats() {
    this.elements.timer.textContent = this.formatTime(this.timeLeft);
    this.elements.speed.textContent = '0';
    this.elements.errors.textContent = '0';
  }

  formatTime(seconds) {
    return seconds < 10 ? `0${seconds}` : seconds;
  }

  startTest() {
    this.isStarted = true;
    this.isTimeUp = false;
    this.timeLeft = this.duration;
    this.currentIndex = 0;
    this.errorCount = 0;
    this.userInput = [];
    this.updateStats();
    this.renderText(this.text.join(' '));
    this.elements.typingBox.classList.remove('inactive');
    this.removeTimeUpMessage();
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.timeLeft--;
    this.elements.timer.textContent = this.formatTime(this.timeLeft);
    if (this.timeLeft <= 10) {
      this.elements.timer.classList.add('timer--pulse');
    } else {
      this.elements.timer.classList.remove('timer--pulse');
    }
    if (this.timeLeft <= 0) {
      clearInterval(this.timerInterval);
      this.finishTest();
    }
  }

  finishTest() {
    this.isStarted = false;
    this.isTimeUp = true;
    const typedCharacters = this.userInput.length;
    const typedWords = typedCharacters / 5;
    const wpm = Math.round(typedWords);
    this.elements.speed.textContent = wpm;
    this.elements.errors.textContent = this.errorCount;
    this.saveResult(wpm, this.errorCount);
    this.showTimeUpMessage();
    this.elements.typingBox.classList.add('inactive');
    setTimeout(() => {
      this.loadAndRenderText();
    }, 1200);
  }

  showTimeUpMessage() {
    let msg = document.createElement('div');
    msg.className = 'timeup-message';
    msg.textContent = 'Time is up!';
    this.elements.typingBox.appendChild(msg);
    setTimeout(() => { msg.classList.add('visible'); }, 10);
  }

  removeTimeUpMessage() {
    const msg = this.elements.typingBox.querySelector('.timeup-message');
    if (msg) msg.remove();
  }

  saveResult(wpm, errors) {
    const result = {
      wpm,
      errors,
      date: new Date().toLocaleString()
    };
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.unshift(result);
    if (history.length > 10) history.pop();
    localStorage.setItem(this.historyKey, JSON.stringify(history));
    this.renderHistory();
  }

  renderHistory() {
    const historyList = this.elements.historyList;
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.sort((a, b) => (b.wpm / (b.errors + 1)) - (a.wpm / (a.errors + 1)));
    history.forEach((result, index) => {
      const li = document.createElement('li');
      li.textContent = `${result.date} — Speed: ${result.wpm} WPM, Errors: ${result.errors}`;
      if (index === 0) li.classList.add('gold');
      else if (index === 1) li.classList.add('silver');
      else if (index === 2) li.classList.add('bronze');
      historyList.appendChild(li);
    });
  }

  handleKeydown(e) {
    if (!this.isStarted || this.isTimeUp) return;
    const spans = this.elements.typingBox.querySelectorAll('span');
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    if (e.key === ' ' || e.code === 'Space') e.preventDefault();
    if (e.key === 'Backspace') {
      if (this.currentIndex === 0) {
        if (this.userInput[0]) {
          spans[0].classList.remove('correct', 'incorrect');
          spans[0].classList.add('default');
          this.userInput[0] = undefined;
        }
      } else {
        if (this.userInput[this.currentIndex] === undefined) {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            spans[this.currentIndex].classList.remove('correct', 'incorrect');
            spans[this.currentIndex].classList.add('default');
            this.userInput[this.currentIndex] = undefined;
          }
        } else {
          spans[this.currentIndex].classList.remove('correct', 'incorrect');
          spans[this.currentIndex].classList.add('default');
          this.userInput[this.currentIndex] = undefined;
        }
      }
    } else {
      const expectedChar = spans[this.currentIndex]?.textContent;
      if (!expectedChar) return;
      if (spans[this.currentIndex].classList.contains('incorrect')) return;
      this.userInput[this.currentIndex] = e.key;
      if (e.key === expectedChar || (e.key === ' ' && expectedChar === ' ')) {
        spans[this.currentIndex].classList.remove('default', 'incorrect');
        spans[this.currentIndex].classList.add('correct');
        this.currentIndex++;
      } else {
        spans[this.currentIndex].classList.remove('default', 'correct');
        spans[this.currentIndex].classList.add('incorrect');
        this.errorCount++;
      }
    }
  }

  initEventListeners() {
    this.elements.startButton.addEventListener('click', () => this.startTest());
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.elements.themeSwitch.addEventListener('click', () => this.toggleTheme());
  }

  // === Theme logic ===
  get sunSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#ffb300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Light theme</title><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  }
  get moonSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#00bcd4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Dark theme</title><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`;
  }
  setTheme(theme) {
    if (theme === 'light') {
      this.elements.body.classList.remove('theme-dark');
      this.elements.body.classList.add('theme-light');
      this.elements.themeSwitch.innerHTML = this.moonSVG;
    } else {
      this.elements.body.classList.remove('theme-light');
      this.elements.body.classList.add('theme-dark');
      this.elements.themeSwitch.innerHTML = this.sunSVG;
    }
    localStorage.setItem('theme', theme);
  }
  toggleTheme() {
    const current = this.elements.body.classList.contains('theme-dark') ? 'dark' : 'light';
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
  initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      this.setTheme(saved);
    } else {
      this.setTheme('dark');
    }
  }
}

// ініціалізація тренажера
window.addEventListener('DOMContentLoaded', () => {
  window.trainer = new TypingTrainer();
});

// стилі для повідомлення про закінчення часу і пульсації таймера
const style = document.createElement('style');
style.innerHTML = `
.typing-box.inactive { pointer-events: none; opacity: 0.7; }
.timeup-message {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  background: #fff;
  color: #00bcd4;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 1.1rem 2.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,188,212,0.08);
  opacity: 0;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.4s, transform 0.4s;
}
.theme-dark .timeup-message {
  background: #23272b;
  color: #00bcd4;
}
.timeup-message.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.timer--pulse {
  animation: timerPulse 0.7s infinite alternate;
  color: #e53935 !important;
}
@keyframes timerPulse {
  0% { color: #e53935; transform: scale(1); }
  100% { color: #ffbdbd; transform: scale(1.18); }
}
`;
document.head.appendChild(style);