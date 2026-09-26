# Endless Runner – City & Forest

## How to run

1. Copy your `assets` folder into this directory (next to index.html).
2. Serve with a local server:

```bash
python -m http.server 8000
# or
npx serve .
```

3. Open http://localhost:8000

## What’s fixed / new

- Full-screen canvas
- Level 1 (City) → score 40 → **pause + modal** (“Continue to Level 2” or “Quit”)
- Level 2 (Forest) only starts after you click Continue
- Level 2 win condition = score ≥ 100
- Slightly higher enemy spawn rate in Level 2
- Boom (collision) animation on every hit
- Larger, visible forest enemy sizes + proper frame animation
- Level indicator and goal shown on screen

## Controls

| Key   | Action             |
|-------|--------------------|
| ← →   | Move               |
| ↑     | Jump               |
| ↓     | Sit / Dive         |
| Enter | Roll               |
| d     | Toggle debug boxes |

## Enemy size note

If any forest enemy still looks wrong, open the browser console and run:

```js
console.log("digger", document.getElementById("enemy_digger").naturalWidth, document.getElementById("enemy_digger").naturalHeight);
```

Then adjust `spriteWidth` / `spriteHeight` and the display `width` / `height` inside the matching class in `enemies.js`.
