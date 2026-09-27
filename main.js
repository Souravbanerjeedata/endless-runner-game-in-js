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
  WaveEnemy,
  BatFrankEnemy,
  HoverEnemy,
  SpinnerFrankEnemy,
  GhostFrankEnemy,
  WormFrankEnemy,
  SpiderFrankEnemy,
  RavenFrankEnemy,
  RunnerEnemy,
} from "./enemies.js";
import { UI } from "./UI.js";

const ALL_ENEMY_TYPES = [
  ClimbingEnemy, FlyingEnemy, GroundEnemy, DiggerEnemy, GroundZombieEnemy,
  ZombieEnemy, WormEnemy, HandEnemy, Ghost4Enemy, Ghost3Enemy, Ghost2Enemy,
  Bat3Enemy, RavenEnemy, SpiderEnemy, SpinnerEnemy, WaveEnemy, BatFrankEnemy,
  HoverEnemy, SpinnerFrankEnemy, GhostFrankEnemy, WormFrankEnemy,
  SpiderFrankEnemy, RavenFrankEnemy, RunnerEnemy,
];
const AIRBORNE_ENEMY_TYPES = new Set([
  ClimbingEnemy, FlyingEnemy, Ghost4Enemy, Ghost3Enemy, Ghost2Enemy,
  Bat3Enemy, RavenEnemy, SpiderEnemy, SpinnerEnemy, WaveEnemy, BatFrankEnemy,
  HoverEnemy, SpinnerFrankEnemy, GhostFrankEnemy, SpiderFrankEnemy, RavenFrankEnemy,
]);
const FLYING_PATTERNS = ["float", "figure-eight", "swoop", "flutter", "drift"];
const SPINNER_ENEMY_TYPES = new Set([SpinnerEnemy, SpinnerFrankEnemy]);
const RAVEN_ENEMY_TYPES = new Set([RavenEnemy, RavenFrankEnemy]);
const NATIVE_MOVEMENT_ENEMY_TYPES = new Set([
  ClimbingEnemy, SpiderEnemy, SpiderFrankEnemy,
]);
const SPINNER_PATTERNS = ["float", "figure-eight", "orbit", "spiral", "swoop"];

function isMobileDevice() {
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isIPad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return mobileUserAgent.test(navigator.userAgent) ||
    navigator.userAgentData?.mobile === true ||
    isIPad;
}

function initializeGame() {
  if (isMobileDevice()) {
    document.body.classList.add("mobile-blocked");
    return;
  }

  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const startModal = document.getElementById("startModal");
  const destLanding = document.getElementById("destLanding");
  const btnStart = document.getElementById("btnStart");
  const btnPause = document.getElementById("btnPause");
  let game = null;

  const DESTINATIONS = {
    city: {
      name: "City",
      levelId: 1,
      groundMargin: 0.16,
      baseInterval: 1200,
    },
    forest: {
      name: "Forest",
      levelId: 2,
      groundMargin: 0.08,
      baseInterval: 1200,
    },
    hills: {
      name: "Hills",
      levelId: 3,
      groundMargin: 0.06,
      baseInterval: 1100,
    },
    mushroom: {
      name: "Mushroom Valley",
      levelId: 4,
      groundMargin: 0.06,
      baseInterval: 1100,
    },
    desert: {
      name: "Desert Run",
      levelId: 5,
      groundMargin: 0.06,
      baseInterval: 1000,
    },
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (game) {
      game.width = canvas.width;
      game.height = canvas.height;
    }
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

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
      this.enemyInterval = 1200;
      this.baseEnemyInterval = 1200;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = Infinity;
      this.gameOver = false;
      this.victory = false;
      this.terminalTimer = 0;
      this.onGameComplete = null;
      this.lives = 5;
      this.level = 1;
      this.destination = "city";
      this.destinationName = "";
      this.paused = true;
      this.started = false;
      this.waitingForLevelChoice = false;
      this.maxEnemiesOnScreen = 20;
      this.maxGroupSize = 13;
      this.enemyBag = [];
      this.enemyBagTier = -1;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      if (this.gameOver) {
        this.terminalTimer -= deltaTime;
        if (this.terminalTimer <= 0 && this.onGameComplete) this.onGameComplete();
        return;
      }
      if (this.paused || !this.started) return;

      this.time += deltaTime;

      // Difficulty ramps with time: shorter spawn interval (floor 450ms)
      const ramp = Math.min(1, this.time / 180000);
      this.enemyInterval = Math.max(
        450,
        this.baseEnemyInterval - ramp * (this.baseEnemyInterval - 450),
      );
      if (this.time > 60000) this.maxSpeed = 5;
      if (this.time > 120000) this.maxSpeed = 6;

      if (this.score < 0) {
        this.finish(false);
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

      this.enemies.forEach((enemy) => {
        enemy.preparePatternUpdate();
        enemy.update(deltaTime);
        enemy.applyPattern(deltaTime);
      });
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
      if (this.score >= 150) {
        this.score = 150;
        this.finish(true);
      } else if (this.lives <= 0) {
        this.finish(false);
      }
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

    setDestination(key) {
      const cfg = DESTINATIONS[key];
      if (!cfg) return;
      this.destination = key;
      this.destinationName = cfg.name;
      this.level = cfg.levelId;
      this.background.setLevel(cfg.levelId);
      this.groundMargin = Math.floor(this.height * cfg.groundMargin);
      this.baseEnemyInterval = cfg.baseInterval;
      this.enemyInterval = cfg.baseInterval;
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.score = 0;
      this.time = 0;
      this.lives = 5;
      this.gameOver = false;
      this.maxSpeed = 4;
      this.enemyTimer = 0;
      this.enemyBag = [];
      this.enemyBagTier = -1;
      this.victory = false;
      this.started = false;
      this.paused = true;
      this.time = 0;
      if (this.player && typeof this.player.useWhiteDog === "function") {
        this.player.useWhiteDog(Math.random() < 0.5);
      }
      this.player.x = 50;
      this.player.y = this.height - this.player.height - this.groundMargin;
      this.player.vy = 0;
      this.player.setState(1, 1);
    }

    beginPlay() {
      this.time = 0;
      this.score = 0;
      this.enemyTimer = 0;
      this.paused = false;
      this.started = true;
      this.player.setState(1, 1);
    }

    finish(victory) {
      if (this.gameOver) return;
      this.gameOver = true;
      this.victory = victory;
      this.paused = true;
      this.terminalTimer = 3000;
      this.input.keys.length = 0;
      if (btnPause) btnPause.classList.remove("show");
      if (canvas) canvas.classList.remove("interactive");
    }

    addEnemy() {
      if (this.speed <= 0) return;
      if (this.enemies.length >= this.maxEnemiesOnScreen) return;
      const pools = {
        1: [GroundEnemy, ClimbingEnemy, FlyingEnemy, Bat3Enemy, SpinnerEnemy],
        2: [DiggerEnemy, GroundZombieEnemy, ZombieEnemy, WormEnemy, HandEnemy, Ghost4Enemy, Ghost3Enemy, Ghost2Enemy, Bat3Enemy, RavenEnemy, SpiderEnemy, SpinnerEnemy],
        3: [GroundEnemy, GroundZombieEnemy, DiggerEnemy, WormFrankEnemy, RunnerEnemy, WaveEnemy, BatFrankEnemy, HoverEnemy, SpinnerFrankEnemy],
        4: [WormFrankEnemy, RunnerEnemy, GroundZombieEnemy, DiggerEnemy, HandEnemy, GhostFrankEnemy, SpiderFrankEnemy, BatFrankEnemy, Ghost2Enemy, Ghost3Enemy, SpinnerFrankEnemy],
        5: [WormFrankEnemy, RunnerEnemy, GroundZombieEnemy, DiggerEnemy, RavenFrankEnemy, SpinnerFrankEnemy, HoverEnemy, WaveEnemy, BatFrankEnemy],
      };
      const localTypes = pools[this.level] || pools[1];
      // Bring in the full cast gradually, then cycle every available sprite
      // before repeating one so all enemies appear during a longer run.
      const tier = this.time < 20000 ? 0 : this.time < 50000 ? 1 : 2;
      let types = localTypes;
      if (tier === 1) {
        types = [...new Set([...localTypes, ...ALL_ENEMY_TYPES.slice(0, 15)])];
      } else if (tier === 2) {
        types = ALL_ENEMY_TYPES;
      }
      if (this.enemyBagTier !== tier || this.enemyBag.length === 0) {
        this.enemyBag = [...types];
        for (let i = this.enemyBag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.enemyBag[i], this.enemyBag[j]] = [this.enemyBag[j], this.enemyBag[i]];
        }
        this.enemyBagTier = tier;
      }
      const room = this.maxEnemiesOnScreen - this.enemies.length;
      const ramp = Math.min(1, this.time / 90000);
      const Type = this.enemyBag.pop();
      const isAirborne = AIRBORNE_ENEMY_TYPES.has(Type);
      const isSpinner = SPINNER_ENEMY_TYPES.has(Type);
      const usesDirectorPattern = isAirborne &&
        !RAVEN_ENEMY_TYPES.has(Type) &&
        !NATIVE_MOVEMENT_ENEMY_TYPES.has(Type);
      const regularGroupSize = Math.min(
        6,
        1 + Math.floor(this.time / 15000),
        1 + Math.floor(ramp * 5),
      );
      const spinnerGroupSize = Math.min(
        13,
        6 + Math.floor(Math.max(0, this.time - 30000) / 12000),
      );
      const batchSize = Math.min(room, isSpinner ? spinnerGroupSize : regularGroupSize);
      const spinnerPatternTier = Math.min(
        SPINNER_PATTERNS.length,
        1 + Math.floor(this.time / 30000),
      );
      const groupPattern = isSpinner
        ? SPINNER_PATTERNS[Math.floor(Math.random() * spinnerPatternTier)]
        : usesDirectorPattern && this.time >= 12000
          ? FLYING_PATTERNS[Math.floor(Math.random() * FLYING_PATTERNS.length)]
          : null;
      const groupPhase = Math.random() * Math.PI * 2;
      const groupY = this.height * (0.22 + Math.random() * 0.2);
      for (let i = 0; i < batchSize; i++) {
        const enemy = new Type(this);
        // Families fly in a compact, readable formation instead of a long queue.
        enemy.x = this.width + i * (isAirborne ? 78 : 105) + Math.random() * 24;
        if (isAirborne) {
          const formationOffset = (i - (batchSize - 1) / 2) * (14 + ramp * 12);
          enemy.y = Math.min(
            this.height - enemy.height - this.groundMargin - 20,
            Math.max(24, groupY + formationOffset),
          );
          if (RAVEN_ENEMY_TYPES.has(Type)) enemy.homeY = enemy.y;
          if (usesDirectorPattern) enemy.motionPattern = groupPattern || "float";
          enemy.patternAge = 0;
          enemy.patternPhase = groupPhase + i * 0.32;
          enemy.patternAmplitude = 12 + ramp * 28;
          enemy.patternLateral = groupPattern === "figure-eight" || groupPattern === "swoop"
            ? 10 + ramp * 20
            : 4 + ramp * 10;
          enemy.patternFrequency = 1.2 + ramp * 1.3;
          enemy.patternOffsetX = 0;
          enemy.patternOffsetY = 0;
        }
        this.enemies.push(enemy);
      }
    }
  }

  let lastTime = 0;
  let selectedDestination = null;

  try {
    game = new Game(canvas.width, canvas.height);
    game.onGameComplete = () => {
      selectedDestination = null;
      game.started = false;
      game.paused = true;
      game.gameOver = false;
      game.victory = false;
      game.enemies = [];
      if (startModal) startModal.classList.remove("show");
      if (destLanding) destLanding.classList.remove("hidden");
      if (destLanding) destLanding.scrollTop = 0;
      if (btnPause) btnPause.classList.remove("show");
      if (canvas) canvas.classList.remove("interactive");
      window.scrollTo(0, 0);
    };
  } catch (err) {
    console.error("Game init error:", err);
    alert("Game failed to load: " + err.message);
  }

  function onDestinationPick(key) {
    if (!key) return;
    selectedDestination = key;
    if (game) {
      try {
        game.setDestination(key);
      } catch (err) {
        console.error("setDestination error:", err);
        alert("Could not load destination: " + err.message);
        return;
      }
    }
    if (destLanding) destLanding.classList.add("hidden");
    if (startModal) startModal.classList.add("show");
  }

  function onOkay() {
    if (!selectedDestination) {
      if (startModal) startModal.classList.remove("show");
      if (destLanding) destLanding.classList.remove("hidden");
      return;
    }
    if (startModal) startModal.classList.remove("show");
    if (game) {
      game.beginPlay();
      if (canvas) canvas.classList.add("interactive");
    }
    if (btnPause) {
      btnPause.classList.add("show");
      updatePauseButton();
    }
  }

  function updatePauseButton() {
    if (!btnPause) return;
    const isPaused = game && game.paused;
    btnPause.textContent = isPaused ? "▶" : "⏸";
    btnPause.setAttribute("aria-label", isPaused ? "Resume" : "Pause");
    btnPause.title = isPaused ? "Resume" : "Pause";
  }

  window.__pickDest = onDestinationPick;
  window.__onOkay = onOkay;

  // Event delegation — works even if buttons are re-rendered
  document.addEventListener("click", (e) => {
    const destBtn = e.target.closest("[data-destination]");
    if (destBtn) {
      e.preventDefault();
      onDestinationPick(destBtn.getAttribute("data-destination"));
      return;
    }
    if (e.target.closest("#btnStart")) {
      e.preventDefault();
      onOkay();
      return;
    }
    if (e.target.closest("#btnPause")) {
      e.preventDefault();
      if (!game || game.gameOver || !game.started) return;
      game.paused = !game.paused;
      updatePauseButton();
    }
  });

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (game) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update(deltaTime);
      game.draw(ctx);
    }
    requestAnimationFrame(animate);
  }
  animate(0);
}

initializeGame();
