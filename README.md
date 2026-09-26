# City & Forest Runner

A 2D side-scrolling endless runner built with pure HTML5 Canvas and vanilla JavaScript.

**Live Demo:** [Play here](https://souravbanerjeedata.github.io/endless-runner-game-in-js/)

---

## Features

- Two levels: **City** and **Forest** with parallax backgrounds
- Player states: sit, run, jump, fall, roll, dive, hit
- Score by rolling or diving into enemies
- Lives system with hit penalty
- Floating score messages and boom collision effects
- Particle effects (dust, fire, splash)
- Full-screen responsive canvas
- Start modal with rules and controls
- Level transition modal after City victory

---

## How to Play

| Control | Action |
| --- | --- |
| ← → | Move left / right |
| ↑ | Jump |
| ↓ | Sit (on ground) / Dive (in air) |
| Enter | Roll — destroy enemies for +1 score |
| D | Toggle debug hitboxes |

**Rules**

- Roll or dive into enemies to score **+1**
- Touching an enemy without rolling or diving costs **−5 score** and **1 life**
- You start with **5 lives**
- **Level 1 (City):** reach **40** points
- **Level 2 (Forest):** reach **100** points

---

## Run Locally

```bash
git clone https://github.com/Souravbanerjeedata/endless-runner-game-in-js.git
cd endless-runner-game-in-js

# Any static server works (ES modules need a server)
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:3000` (or `8080`) in your browser.

---

## Project Structure

```
endless-runner-game-in-js/
├── index.html
├── style.css
├── main.js              # Game loop, levels, enemy spawn
├── player.js            # Player class & collision
├── playerStates.js      # State machine (sit, run, jump, roll, …)
├── enemies.js           # City & Forest enemies
├── background.js        # Parallax layers
├── particles.js         # Dust, fire, splash
├── collisionAnimation.js
├── floatingMessages.js
├── input.js
├── UI.js
└── assets/              # Sprites & backgrounds
```

---

## Tech Stack

- HTML5 Canvas
- Vanilla JavaScript (ES modules)
- No frameworks or build tools

---

## License

MIT
