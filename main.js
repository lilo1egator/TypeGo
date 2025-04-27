'use strict'

document.addEventListener('DOMContentLoaded', () => {
    updateHistory();
    const textWrapper = document.querySelector('.text-box'),
          userInput = [],
          start = document.querySelector('.start'),
          timerWrap = document.querySelector('.timer'),
          speedWrap = document.querySelector('.speed'),
          errorsWrap = document.querySelector('.errors'),
          text = [];
          

    let currentIndex = 0,
        isStarted = false,
        timeLeft = 60,
        timerInterval = null,
        errorCount = 0;

    timerWrap.textContent = formatTime(timeLeft);
    speedWrap.textContent = '0';
    errorsWrap.textContent = '0';

    async function loadPhrases() {
        try {
            text.length = 0;
            const res = await fetch('words.json');
            const data = await res.json();
            const phrases = data.phrases;

            for (let i = 0; i < 7; i++) {
                text.push(phrases[Math.floor(Math.random() * phrases.length)]);
            }

            const fullText = text.join(' ');
            textWrapper.innerHTML = fullText
                .split('')
                .map(char => `<span class="default">${char}</span>`)
                .join('');
        } catch (error) {
            console.error('Помилка при завантаженні JSON:', error);
        }
    }

    function formatTime(seconds) {
        return seconds < 10 ? `0${seconds}` : seconds;
    }

    function startTimer() {
        timerWrap.textContent = formatTime(timeLeft);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerWrap.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishTest();
            }
        }, 1000);
    }

    function saveResult(wpm, errors) {
        const result = {
            wpm,
            errors,
            date: new Date().toLocaleString()
        };
    
        const history = JSON.parse(localStorage.getItem('typingHistory')) || [];
        history.unshift(result); 
    
        if (history.length > 10) {
            history.pop();
        }
    
        localStorage.setItem('typingHistory', JSON.stringify(history));
    
        updateHistory();
    }

    function updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
    
        let history = JSON.parse(localStorage.getItem('typingHistory')) || [];
    
        history.sort((a, b) => {
            const scoreA = a.wpm / (a.errors + 1);
            const scoreB = b.wpm / (b.errors + 1);
            return scoreB - scoreA; // більший результат вище
        });
    
        history.forEach((result, index) => {
            const li = document.createElement('li');
            li.textContent = `${result.date} — Швидкість: ${result.wpm} WPM, Помилки: ${result.errors}`;
    
            // Підсвітка для перших трьох
            if (index === 0) {
                li.style.color = 'gold';
            } else if (index === 1) {
                li.style.color = 'silver';
            } else if (index === 2) {
                li.style.color = '#cd7f32'; // бронза
            }
    
            historyList.appendChild(li);
        });
    }
    

    function finishTest() {
        isStarted = false;

        const typedCharacters = userInput.length;
        const typedWords = typedCharacters / 5;
        const wpm = Math.round(typedWords);

        speedWrap.textContent = wpm;
        errorsWrap.textContent = errorCount;

        saveResult(wpm, errorCount);
    }

    start.addEventListener('click', async () => {
        isStarted = false;
        clearInterval(timerInterval);
        timeLeft = 60;
        currentIndex = 0;
        errorCount = 0;
        userInput.length = 0;
        textWrapper.innerHTML = '';
        speedWrap.textContent = '0';
        errorsWrap.textContent = '0';
        timerWrap.textContent = formatTime(timeLeft);

        await loadPhrases();

        isStarted = true;
        startTimer();
    });

    document.addEventListener('keydown', (e) => {
        if (!isStarted) return;

        const spans = textWrapper.querySelectorAll('span');

        if (e.key.length > 1 && e.key !== 'Backspace') {
            return;
        }

        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
        }

        if (e.key === 'Backspace') {
            if (currentIndex > 0) {
                currentIndex--;
                userInput.pop();
                spans[currentIndex].classList.remove('correct', 'incorrect');
                spans[currentIndex].classList.add('default');
            }
        } else {
            const expectedChar = spans[currentIndex]?.textContent;
            if (!expectedChar) return;

            userInput.push(e.key);

            if (e.key === expectedChar || (e.key === ' ' && expectedChar === ' ')) {
                spans[currentIndex].classList.remove('default', 'incorrect');
                spans[currentIndex].classList.add('correct');
            } else {
                spans[currentIndex].classList.remove('default', 'correct');
                spans[currentIndex].classList.add('incorrect');
                errorCount++;
            }

            currentIndex++;
        }
    });
    
});