import React from 'react';
import '../styles/TypingBox.scss';

const TypingBox = ({ text, userInput, currentIndex }) => {
  return (
    <div className="typing-box">
      {text.split('').map((char, idx) => {
        let className = 'default';
        if (userInput[idx] !== undefined) {
          className = userInput[idx] === char ? 'correct' : 'incorrect';
        }
        return (
          <span key={idx} className={className}>{char}</span>
        );
      })}
    </div>
  );
};

export default TypingBox; 