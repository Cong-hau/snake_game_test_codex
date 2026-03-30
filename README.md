# Classic Snake

A minimal classic Snake implementation using vanilla HTML/CSS/JS.

## Run locally

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/index.html`

## Run tests

```bash
npm test
```

## Manual verification checklist

- [ ] Snake moves every tick, and Arrow keys/WASD change direction.
- [ ] Opposite direction turns are ignored while snake length is greater than 1.
- [ ] Eating food increases score and grows snake by 1 segment.
- [ ] Hitting wall or self sets game over.
- [ ] Restart button resets score/board.
- [ ] Pause toggles with button and Space key.
- [ ] On-screen arrow buttons work for touch/click input.
