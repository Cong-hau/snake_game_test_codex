const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
};

export function createInitialState({ width = 16, height = 16 } = {}) {
  const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  return {
    width,
    height,
    snake: [center],
    direction: { x: 1, y: 0 },
    pendingDirection: { x: 1, y: 0 },
    food: { x: Math.max(0, center.x - 3), y: center.y },
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function isOppositeDirection(current, next) {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

export function nextDirectionFromKey(state, code) {
  const next = DIRECTIONS[code];
  if (!next) return state.pendingDirection;
  if (isOppositeDirection(state.direction, next) && state.snake.length > 1) {
    return state.pendingDirection;
  }
  return next;
}

export function randomFreeCell(state, random = Math.random) {
  const occupied = new Set(state.snake.map(({ x, y }) => `${x},${y}`));
  const freeCells = [];

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) return null;

  const idx = Math.floor(random() * freeCells.length);
  return freeCells[idx];
}

export function stepGame(state, random = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  const outOfBounds =
    newHead.x < 0 ||
    newHead.x >= state.width ||
    newHead.y < 0 ||
    newHead.y >= state.height;

  if (outOfBounds) {
    return { ...state, gameOver: true };
  }

  const eatsFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const bodyToCheck = eatsFood ? state.snake : state.snake.slice(0, -1);
  const collidedWithSelf = bodyToCheck.some(
    (segment) => segment.x === newHead.x && segment.y === newHead.y,
  );

  if (collidedWithSelf) {
    return { ...state, gameOver: true };
  }

  const nextSnake = [newHead, ...state.snake];
  if (!eatsFood) {
    nextSnake.pop();
  }

  let nextFood = state.food;
  let nextScore = state.score;

  if (eatsFood) {
    nextScore += 1;
    nextFood = randomFreeCell({ ...state, snake: nextSnake }, random) ?? state.food;
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: nextFood,
    score: nextScore,
  };
}
