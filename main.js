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
  const levelModal = document.getElementById("levelModal");
  const btnContinue = document.getElementById("btnContinue");
  const btnQuit = document.getElementById("btnQuit");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      // Level 1 (City) – original feel (~16% of height, was perfect before)
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
      this.paused = false;
      this.waitingForLevelChoice = false;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      if (this.paused || this.gameOver) return;

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
        this.gameOver = true;
        return;
      }

      if (this.time > this.maxTime) {
        this.gameOver = true;
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

      // Forest road is near the bottom of the art.
      // Smaller groundMargin = lower on screen = feet on the path (not floating).
      this.groundMargin = Math.floor(this.height * 0.08);

      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.score = 0;
      this.time = 0;
      // Fewer enemies than before
      this.enemyInterval = 1100;
      this.paused = false;
      this.waitingForLevelChoice = false;

      this.player.x = 50;
      this.player.y =
        this.height - this.player.height - this.groundMargin;
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
        if (r < 0.15) {
          // small group of zombies
          this.enemies.push(new ZombieEnemy(this));
          this.enemies.push(new ZombieEnemy(this));
        } else if (r < 0.28) {
          // small group of spinners
          this.enemies.push(new SpinnerEnemy(this));
          this.enemies.push(new SpinnerEnemy(this));
        } else if (r < 0.55) {
          const GroundClass =
            groundTypes[Math.floor(Math.random() * groundTypes.length)];
          this.enemies.push(new GroundClass(this));
        } else {
          const FlyingClass =
            flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
          this.enemies.push(new FlyingClass(this));
        }
        // often also one extra flying enemy
        if (Math.random() < 0.45) {
          const FlyingClass =
            flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
          this.enemies.push(new FlyingClass(this));
        }
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  btnContinue.addEventListener("click", () => {
    game.startLevel2();
  });

  btnQuit.addEventListener("click", () => {
    levelModal.classList.remove("show");
    game.gameOver = true;
    game.paused = false;
  });

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
    else game.draw(ctx);
  }
  animate(0);
});
