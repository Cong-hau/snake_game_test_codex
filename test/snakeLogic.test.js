import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  nextDirectionFromKey,
  randomFreeCell,
  stepGame,
} from '../src/snakeLogic.js';

test('snake moves one cell in current direction', () => {
  const state = createInitialState({ width: 10, height: 10 });
  const next = stepGame(state);

  assert.deepEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.equal(next.snake.length, 1);
});

test('snake grows and score increases when eating food', () => {
  const state = {
    ...createInitialState({ width: 8, height: 8 }),
    snake: [{ x: 3, y: 3 }],
    direction: { x: 1, y: 0 },
    pendingDirection: { x: 1, y: 0 },
    food: { x: 4, y: 3 },
  };

  const next = stepGame(state, () => 0);

  assert.equal(next.snake.length, 2);
  assert.equal(next.score, 1);
  assert.notDeepEqual(next.food, { x: 4, y: 3 });
});

test('snake dies when crossing wall boundary', () => {
  const state = {
    ...createInitialState({ width: 4, height: 4 }),
    snake: [{ x: 3, y: 1 }],
    direction: { x: 1, y: 0 },
    pendingDirection: { x: 1, y: 0 },
  };

  const next = stepGame(state);
  assert.equal(next.gameOver, true);
});

test('snake dies on self collision', () => {
  const state = {
    ...createInitialState({ width: 6, height: 6 }),
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
    ],
    direction: { x: 0, y: 1 },
    pendingDirection: { x: 0, y: 1 },
    food: { x: 0, y: 0 },
  };

  const next = stepGame(state);
  assert.equal(next.gameOver, true);
});

test('opposite direction is ignored when snake length > 1', () => {
  const state = {
    ...createInitialState({ width: 6, height: 6 }),
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: { x: 1, y: 0 },
    pendingDirection: { x: 1, y: 0 },
  };

  const nextDirection = nextDirectionFromKey(state, 'ArrowLeft');
  assert.deepEqual(nextDirection, { x: 1, y: 0 });
});

test('food placement selects only free cells', () => {
  const state = {
    ...createInitialState({ width: 3, height: 2 }),
    snake: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  };

  const food = randomFreeCell(state, () => 0);
  assert.deepEqual(food, { x: 2, y: 1 });
});
