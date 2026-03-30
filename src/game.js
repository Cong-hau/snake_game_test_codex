import {
  createInitialState,
  nextDirectionFromKey,
  randomFreeCell,
  stepGame,
} from './snakeLogic.js';

const GRID_SIZE = 18;
const TICK_MS = 140;

let state = initialize();
let timer = null;

const boardEl = document.querySelector('[data-board]');
const scoreEl = document.querySelector('[data-score]');
const statusEl = document.querySelector('[data-status]');
const restartBtn = document.querySelector('[data-restart]');
const pauseBtn = document.querySelector('[data-pause]');

function initialize() {
  const next = createInitialState({ width: GRID_SIZE, height: GRID_SIZE });
  const safeFood = randomFreeCell(next, () => 0.2);
  return { ...next, food: safeFood ?? next.food };
}

function draw() {
  boardEl.style.gridTemplateColumns = `repeat(${state.width}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${state.height}, 1fr)`;
  boardEl.innerHTML = '';

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (state.food.x === x && state.food.y === y) {
        cell.classList.add('food');
      }

      const index = state.snake.findIndex((part) => part.x === x && part.y === y);
      if (index === 0) {
        cell.classList.add('snake-head');
      } else if (index > 0) {
        cell.classList.add('snake');
      }

      boardEl.appendChild(cell);
    }
  }

  scoreEl.textContent = String(state.score);

  if (state.gameOver) {
    statusEl.textContent = 'Game over';
  } else if (state.paused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Running';
  }
}

function tick() {
  state = stepGame(state);
  draw();
}

function start() {
  if (timer) clearInterval(timer);
  timer = setInterval(tick, TICK_MS);
}

function restart() {
  state = initialize();
  draw();
  start();
}

function togglePause() {
  if (state.gameOver) return;
  state = { ...state, paused: !state.paused };
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    togglePause();
    return;
  }

  if (state.gameOver && event.code === 'Enter') {
    restart();
    return;
  }

  const nextDirection = nextDirectionFromKey(state, event.code);
  if (nextDirection !== state.pendingDirection) {
    state = { ...state, pendingDirection: nextDirection };
  }
});

restartBtn.addEventListener('click', restart);
pauseBtn.addEventListener('click', togglePause);

document.querySelectorAll('[data-control]').forEach((button) => {
  button.addEventListener('click', () => {
    const code = button.getAttribute('data-control');
    const nextDirection = nextDirectionFromKey(state, code);
    state = { ...state, pendingDirection: nextDirection };
  });
});

draw();
start();
