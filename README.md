# Endless Runner - City & Forest Levels

## How to use this package

1. **Copy your `assets` folder** into this project directory (the same folder that contains `index.html`).
   - You already have all the required images (city layers, forest layers, all enemies, player, fire, boom, heart).

2. Open the project with a local server (recommended):

   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node
   npx serve .
   ```

3. Open `http://localhost:8000` in your browser.

## Features included

- Full-screen canvas that adapts to the user's screen ratio
- **Level 1 – City** (original layers + plant / fly / climbing spider)
- **Level 2 – Forest** (new forest layers + digger, zombies, worm, hand, ghosts, bat, raven, spider, spinner)
- Automatic level switch when score reaches 40
- Parallax scrolling with different speeds for each layer
- Different movement patterns for forest enemies (sine wave, vertical web, etc.)
- Player states (Sitting, Running, Jumping, Falling, Rolling, Diving, Hit)
- Particle effects (Dust, Fire, Splash)
- Lives, timer, score and level indicator

## Controls

| Key          | Action              |
|--------------|---------------------|
| ← →          | Move left / right   |
| ↑            | Jump                |
| ↓            | Sit / Dive          |
| Enter        | Roll (power)        |
| d            | Toggle debug boxes  |

## Notes

- Some enemy `spriteWidth` / `spriteHeight` values are approximate.  
  If an enemy looks stretched, open the browser console and run:

  ```js
  console.log(document.getElementById("enemy_digger").naturalWidth, document.getElementById("enemy_digger").naturalHeight);
  ```

  Then adjust the values inside the corresponding class in `enemies.js`.

Enjoy the game!
