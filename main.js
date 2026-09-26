import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import {
  ClimbingEnemy,
  FlyingEnemy,
  GroundEnemy,
  DiggerEnemy,
  GroundZombieEnemy,
  ZombieEnemy,
  WormEnemy,
  HandEnemy,
  Ghost4Enemy,
  Ghost3Enemy,
  Ghost2Enemy,
  Bat3Enemy,
  RavenEnemy,
  SpiderEnemy,
  SpinnerEnemy,
} from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const startModal = document.getElementById("startModal");
  const btnStart = document.getElementById("btnStart");
  const rotateOverlay = document.getElementById("rotateOverlay");
  const endModal = document.getElementById("endModal");
  const endTitle = document.getElementById("endTitle");
  const endMessage = document.getElementById("endMessage");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnQuitEnd = document.getElementById("btnQuitEnd");
  const levelModal = document.getElementById("levelModal");
  const btnContinue = document.getElementById("btnContinue");
  const btnQuit = document.getElementById("btnQuit");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  function isMobileDevice() {
    return (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0
    );
  }

  function isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  function updateOrientation() {
    if (!rotateOverlay) return;
    if (isPortrait()) {
      rotateOverlay.classList.add("show");
      if (game) game.orientationPaused = true;
    } else {
      rotateOverlay.classList.remove("show");
      if (game) game.orientationPaused = false;
    }
  }

  function resizeCanvas() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    canvas.width = viewportWidth;
    canvas.height = viewportHeight;

    if (game) {
      // Mobile uses a logical game coordinate system and a render scale so
      // every existing sprite/UI element keeps its proportions on different
      // screen sizes. Physics and collision code remain unchanged.
      if (isMobileDevice() && viewportWidth > viewportHeight) {
        game.renderScale = Math.min(1.5, Math.max(0.65, viewportWidth / 1280));
        game.width = viewportWidth / game.renderScale;
        game.height = viewportHeight / game.renderScale;
      } else {
        game.renderScale = 1;
        game.width = viewportWidth;
        game.height = viewportHeight;
      }

      if (game.level === 1) {
        game.groundMargin = Math.floor(game.height * 0.16);
      } else {
        game.groundMargin = Math.floor(game.height * 0.08);
      }

      if (game.background) {
        game.background.height = game.height;
        [...game.background.cityLayers, ...game.background.forestLayers].forEach(
          (layer) => (layer.height = game.height),
        );
      }

      if (game.player) {
        const maxY = game.height - game.player.height - game.groundMargin;
        if (game.player.y > maxY) game.player.y = maxY;
      }
    }

    updateOrientation();
    updateFullscreenButton();
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = Math.floor(height * 0.16);
      this.speed = 0;
      this.maxSpeed = 4;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxparticles = 50;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 90000;
      this.gameOver = false;
      this.lives = 5;

      this.level = 1;
      this.level1Target = 40;
      this.level2Target = 100;
      this.paused = true;
      this.waitingForLevelChoice = false;
      this.orientationPaused = false;
      this.renderScale = 1;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      if (this.paused || this.gameOver || this.orientationPaused) return;

      this.time += deltaTime;

      if (
        this.level === 1 &&
        this.score >= this.level1Target &&
        !this.waitingForLevelChoice
      ) {
        this.paused = true;
        this.waitingForLevelChoice = true;
        this.speed = 0;
        levelModal.classList.add("show");
        return;
      }

      if (this.level === 2 && this.score >= this.level2Target) {
        this.paused = true;
        this.speed = 0;
        this.gameOver = true;
        this.won = true;
        showEndModal(true);
        return;
      }

      if (this.lives <= 0) {
        this.paused = true;
        this.speed = 0;
        this.gameOver = true;
        this.won = false;
        showEndModal(false);
        return;
      }

      if (this.time > this.maxTime) {
        this.paused = true;
        this.speed = 0;
        this.gameOver = true;
        this.won = false;
        showEndModal(false);
        return;
      }

      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => enemy.update(deltaTime));
      this.particles.forEach((particle) => particle.update());
      this.collisions.forEach((c) => c.update(deltaTime));
      this.floatingMessages.forEach((m) => m.update());

      if (this.particles.length > this.maxparticles) {
        this.particles.length = this.maxparticles;
      }

      this.enemies = this.enemies.filter((e) => !e.markedForDeletion);
      this.particles = this.particles.filter((p) => !p.markedForDeletion);
      this.collisions = this.collisions.filter((c) => !c.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter(
        (m) => !m.markedForDeletion,
      );
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((e) => e.draw(context));
      this.particles.forEach((p) => p.draw(context));
      this.collisions.forEach((c) => c.draw(context));
      this.floatingMessages.forEach((m) => m.draw(context));
      this.UI.draw(context);
    }

    startLevel2() {
      this.level = 2;
      this.background.setLevel(2);
      this.groundMargin = Math.floor(this.height * 0.08);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.score = 0;
      this.time = 0;
      this.enemyInterval = 1100;
      this.paused = false;
      this.waitingForLevelChoice = false;
      this.player.x = 50;
      this.player.y = this.height - this.player.height - this.groundMargin;
      this.player.vy = 0;
      this.player.setState(1, 1);
      levelModal.classList.remove("show");
    }

    addEnemy() {
      if (this.speed <= 0) return;

      if (this.level === 1) {
        if (Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
        else this.enemies.push(new ClimbingEnemy(this));
        this.enemies.push(new FlyingEnemy(this));
      } else {
        const groundTypes = [
          DiggerEnemy,
          GroundZombieEnemy,
          ZombieEnemy,
          WormEnemy,
          HandEnemy,
        ];
        const flyingTypes = [
          Ghost4Enemy,
          Ghost3Enemy,
          Ghost2Enemy,
          Bat3Enemy,
          RavenEnemy,
          SpiderEnemy,
          SpinnerEnemy,
        ];

        const r = Math.random();
        if (r < 0.18) {
          const n = 2 + Math.floor(Math.random() * 5);
          for (let i = 0; i < n; i++) this.enemies.push(new ZombieEnemy(this));
        } else if (r < 0.32) {
          const n = 2 + Math.floor(Math.random() * 5);
          for (let i = 0; i < n; i++) this.enemies.push(new SpinnerEnemy(this));
        } else if (r < 0.55) {
          const GroundClass =
            groundTypes[Math.floor(Math.random() * groundTypes.length)];
          this.enemies.push(new GroundClass(this));
        } else {
          const FlyingClass =
            flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
          this.enemies.push(new FlyingClass(this));
        }
        if (Math.random() < 0.45) {
          const FlyingClass =
            flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
          this.enemies.push(new FlyingClass(this));
        }
      }
    }
  }

  let game = null;

  function isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement,
    );
  }

  function updateFullscreenButton() {
    if (!fullscreenBtn) return;
    const mobile = isMobileDevice();
    fullscreenBtn.hidden = !mobile;
    fullscreenBtn.setAttribute(
      "aria-label",
      isFullscreen() ? "Exit fullscreen" : "Enter fullscreen",
    );
    fullscreenBtn.title = isFullscreen() ? "Exit fullscreen" : "Fullscreen";
    fullscreenBtn.innerHTML = isFullscreen()
      ? '<span aria-hidden="true">⛶</span>'
      : '<span aria-hidden="true">⛶</span>';
    fullscreenBtn.classList.toggle("is-fullscreen", isFullscreen());
  }

  async function toggleFullscreen() {
    try {
      if (isFullscreen()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        return;
      }

      const root = document.documentElement;
      if (root.requestFullscreen) {
        await root.requestFullscreen({ navigationUI: "hide" });
      } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
      } else {
        // iOS Safari does not expose generic element fullscreen. The game
        // remains usable there through the browser/PWA display mode.
        updateFullscreenButton();
        return;
      }

      if (screen.orientation?.lock) {
        try {
          await screen.orientation.lock("landscape");
        } catch (_) {
          // Orientation locking is optional and browser-dependent.
        }
      }
    } catch (error) {
      console.warn("Fullscreen request was blocked by the browser:", error);
    } finally {
      updateFullscreenButton();
      setTimeout(resizeCanvas, 100);
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  document.addEventListener("fullscreenchange", () => {
    updateFullscreenButton();
    resizeCanvas();
  });
  document.addEventListener("webkitfullscreenchange", () => {
    updateFullscreenButton();
    resizeCanvas();
  });

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 150);
  });

  game = new Game(canvas.width, canvas.height);
  resizeCanvas();
  game.orientationPaused = isPortrait();
  updateOrientation();
  let lastTime = 0;

  function startGame() {
    if (!startModal.classList.contains("show")) return;
    startModal.classList.remove("show");
    game.paused = false;
    game.time = 0;
    game.player.setState(1, 1);
  }

  if (btnStart) {
    btnStart.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      startGame();
    });
  }

  
  let endModalShown = false;

  function quitGame() {
    levelModal.classList.remove("show");
    if (endModal) endModal.classList.remove("show");
    if (startModal) startModal.classList.remove("show");
    game.gameOver = true;
    game.paused = true;
    game.speed = 0;
    try {
      window.close();
    } catch (e) {}
    // Fallback if browser blocks window.close()
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a12;color:#eee;font-family:Creepster,cursive;flex-direction:column;gap:12px;text-align:center;padding:20px">' +
      "<h1 style=\"color:#e94560;font-size:2.5rem\">Thanks for playing!</h1>" +
      "<p>You can close this tab now.</p>" +
      "</div>";
  }

  function showEndModal(won) {
    if (!endModal) return;
    if (won) {
      endTitle.textContent = "Victory!";
      endMessage.textContent = "You cleared the forest! Great run.";
    } else {
      endTitle.textContent = "Game Over";
      endMessage.textContent = "Better luck next time!";
    }
    endModal.classList.add("show");
  }

  function playAgain() {
    endModalShown = false;
    endModal.classList.remove("show");
    levelModal.classList.remove("show");
    game.level = 1;
    game.background.setLevel(1);
    game.groundMargin = Math.floor(game.height * 0.16);
    game.enemies = [];
    game.particles = [];
    game.collisions = [];
    game.floatingMessages = [];
    game.score = 0;
    game.time = 0;
    game.lives = 5;
    game.enemyInterval = 1000;
    game.gameOver = false;
    game.paused = false;
    game.won = false;
    game.waitingForLevelChoice = false;
    game.speed = 0;
    game.player.x = 0;
    game.player.y = game.height - game.player.height - game.groundMargin;
    game.player.vy = 0;
    game.player.setState(1, 1);
    lastTime = performance.now();
    requestAnimationFrame(animate);
  }


  bindTap(btnContinue, () => game.startLevel2());

  function bindTap(el, fn) {
    if (!el) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    });
  }

  bindTap(btnQuit, quitGame);
  bindTap(btnQuitEnd, quitGame);
  bindTap(btnPlayAgain, playAgain);

    function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);

    ctx.save();
    if (game.renderScale !== 1) {
      ctx.scale(game.renderScale, game.renderScale);
    }
    game.draw(ctx);
    ctx.restore();
    if (game.gameOver && !endModalShown && game.level === 2) {
      endModalShown = true;
      showEndModal(!!game.won);
    } else if (game.gameOver && !endModalShown && game.lives <= 0) {
      endModalShown = true;
      showEndModal(false);
    }
    requestAnimationFrame(animate);
  }
  animate(0);
});
