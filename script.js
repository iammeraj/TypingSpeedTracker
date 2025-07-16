const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorDisplay = document.getElementById('errors');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const modeSelect = document.getElementById('mode');

let timer = null;
let timeLeft = 60;
let errors = 0;
let totalTyped = 0;
let currentQuote = '';
let indexMap = { quotes: 0, paragraphs: 0, code: 0 };

// ✅ Unlimited lists (can add 100s later)
const quoteList = [
  "Stay positive, work hard, make it happen.",
  "Do something today that your future self will thank you for.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Push yourself, because no one else is going to do it for you."
];

const paragraphList = [
  "Typing is an essential skill that improves with practice. The more you type, the better your accuracy and speed become. Start slow, and keep building up your confidence with consistent effort.",
  "Web development combines creativity and logic. From styling websites with CSS to handling logic with JavaScript, it's a field that keeps evolving and rewards those who keep learning.",
  "Artificial Intelligence is changing the world. From self-driving cars to smart assistants, the applications are endless and the potential is huge for upcoming developers."
];

const codeList = [
  "function factorial(n) {\n  return n === 0 ? 1 : n * factorial(n - 1);\n}",
  "let sum = 0;\nfor(let i = 1; i <= 100; i++) {\n  sum += i;\n}\nconsole.log(sum);",
  "const greet = (name) => {\n  return `Hello, ${name}`;\n};"
];

// ✅ Shuffle utility
function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ Shuffled, non-repeating lists
let quoteBank = shuffleArray(quoteList);
let paragraphBank = shuffleArray(paragraphList);
let codeBank = shuffleArray(codeList);

function getQuoteFromMode(mode) {
  let bank;
  switch (mode) {
    case 'quotes': bank = quoteBank; break;
    case 'paragraphs': bank = paragraphBank; break;
    case 'code': bank = codeBank; break;
  }

  if (indexMap[mode] >= bank.length) {
    // reshuffle if exhausted
    if (mode === 'quotes') quoteBank = shuffleArray(quoteList);
    if (mode === 'paragraphs') paragraphBank = shuffleArray(paragraphList);
    if (mode === 'code') codeBank = shuffleArray(codeList);
    indexMap[mode] = 0;
  }

  return bank[indexMap[mode]++];
}

function renderQuote() {
  const mode = modeSelect.value;
  currentQuote = getQuoteFromMode(mode);
  quoteDisplay.innerHTML = '';
  currentQuote.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });
  quoteInput.value = '';
  quoteInput.disabled = false;
  quoteInput.focus();
}

function updateStats() {
  const typed = quoteInput.value;
  const characters = quoteDisplay.querySelectorAll('span');
  let correct = 0;
  errors = 0;

  characters.forEach((char, idx) => {
    const typedChar = typed[idx];

    if (typedChar == null) {
      char.classList.remove('correct', 'incorrect');
    } else if (typedChar === char.innerText) {
      char.classList.add('correct');
      char.classList.remove('incorrect');
      correct++;
    } else {
      char.classList.add('incorrect');
      char.classList.remove('correct');
      errors++;
    }
  });

  totalTyped = typed.length;
  const accuracy = totalTyped ? ((correct / totalTyped) * 100).toFixed(0) : 100;
  const timeSpent = 60 - timeLeft;
  const wpm = timeSpent > 0 ? Math.round((correct / 5) / (timeSpent / 60)) : 0;

  wpmDisplay.innerText = wpm;
  accuracyDisplay.innerText = accuracy;
  errorDisplay.innerText = errors;
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
      } else {
        clearInterval(timer);
        quoteInput.disabled = true;
      }
    }, 1000);
  }
}

quoteInput.addEventListener('input', () => {
  startTimer();
  updateStats();
});

restartBtn.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  timeLeft = 60;
  timerDisplay.innerText = 60;
  wpmDisplay.innerText = 0;
  accuracyDisplay.innerText = 100;
  errorDisplay.innerText = 0;
  renderQuote();
});

modeSelect.addEventListener('change', () => {
  restartBtn.click();
});

// First render
renderQuote();
