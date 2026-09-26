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

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
  });

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
      this.winningScore = 40; // score needed to unlock Level 2 (Forest)
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 60000; // 60 seconds
      this.gameOver = false;
      this.lives = 5;

      // LEVEL SYSTEM
      this.level = 1; // 1 = City, 2 = Forest
      this.levelTransitioned = false;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;

      // Switch to Level 2 (Forest) when score reaches winningScore
      if (this.score >= this.winningScore && !this.levelTransitioned) {
        this.level = 2;
        this.background.setLevel(2);
        this.levelTransitioned = true;
        this.enemies = []; // clear remaining city enemies
      }

      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => enemy.update(deltaTime));
      this.particles.forEach((particle) => particle.update());
      this.collisions.forEach((collision) => collision.update(deltaTime));
      this.floatingMessages.forEach((message) => message.update());

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
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.particles.forEach((particle) => particle.draw(context));
      this.collisions.forEach((collision) => collision.draw(context));
      this.floatingMessages.forEach((message) => message.draw(context));
      this.UI.draw(context);
    }

    addEnemy() {
      if (this.speed <= 0) return;

      if (this.level === 1) {
        // ===== CITY =====
        if (Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
        else this.enemies.push(new ClimbingEnemy(this));
        this.enemies.push(new FlyingEnemy(this));
      } else {
        // ===== FOREST =====
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

        if (Math.random() < 0.45) {
          const GroundClass =
            groundTypes[Math.floor(Math.random() * groundTypes.length)];
          this.enemies.push(new GroundClass(this));
        }
        const FlyingClass =
          flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
        this.enemies.push(new FlyingClass(this));
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
