import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessages } from "./floatingMessages.js";

const WHITE_DOG_ANIMATIONS = {
  // The white sheet uses a different row for each state than player.png.
  SITTING: { row: 8, maxFrame: 4 },
  RUNNING: { row: 6, maxFrame: 8 },
  JUMPING: { row: 2, maxFrame: 6 },
  FALLING: { row: 4, maxFrame: 6 },
  ROLLING: { row: 10, maxFrame: 6 },
  DIVING: { row: 10, maxFrame: 6 },
  HIT: { row: 0, maxFrame: 6 }, // standing row is the white sheet's hit fallback
};
const PLAYER_ANIMATIONS = {
  SITTING: { row: 5, maxFrame: 4 },
  RUNNING: { row: 3, maxFrame: 8 },
  JUMPING: { row: 1, maxFrame: 6 },
  FALLING: { row: 2, maxFrame: 6 },
  ROLLING: { row: 6, maxFrame: 6 },
  DIVING: { row: 6, maxFrame: 6 },
  HIT: { row: 4, maxFrame: 10 },
};

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.spriteWidth = 100;
    this.spriteHeight = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.usesWhiteDog = false;
    this.maxFrame = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 10;
    this.weight = 1;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }

  update(input, deltaTime) {
    this.checkCollison();
    this.currentState.handleInput(input);

    this.x += this.speed;
    if (input.includes("ArrowRight") && this.currentState !== this.states[6])
      this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft") && this.currentState !== this.states[6])
      this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    if (this.y < 0) {
      this.y = 0;
      if (this.vy < 0) this.vy = 0;
    }
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin;
    }

    this.frameTimer += deltaTime;
    while (this.frameTimer >= this.frameInterval) {
      this.frameTimer -= this.frameInterval;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    const sw = this.spriteWidth || this.width;
    const sh = this.spriteHeight || this.height;
    // The white sheet's rolling art has transparent padding below the ball,
    // unlike its running art. Shift only its rendered pose so it rests on the
    // same ground line; keep physics and collision bounds unchanged.
    const whiteRollGroundOffset =
      this.usesWhiteDog && this.currentState?.state === "ROLLING" ? 16 : 0;
    context.drawImage(
      this.image,
      this.frameX * sw,
      this.frameY * sh,
      sw,
      sh,
      this.x,
      this.y + whiteRollGroundOffset,
      this.width,
      this.height,
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.game.speed = this.game.maxSpeed * speed;
    const nextState = this.states[state];
    if (this.currentState === nextState) return;
    this.currentState = nextState;
    this.frameTimer = 0;
    this.currentState.enter();
    this.syncSpriteAnimation();
  }


  useWhiteDog(on) {
    this.usesWhiteDog = on;
    this.frameX = 0;
    this.frameTimer = 0;
    if (on) {
      this.image = document.getElementById("player_white");
      this.spriteWidth = 200;
      // The 2182px sheet is a 12-row grid, so each row is slightly under
      // 182px. Use the exact row stride to prevent cumulative vertical drift.
      this.spriteHeight = 2182 / 12;
      this.width = 100;
      this.height = 91;
    } else {
      this.image = document.getElementById("player");
      this.spriteWidth = 100;
      this.spriteHeight = 91.3;
      this.width = 100;
      this.height = 91.3;
    }
    this.syncSpriteAnimation();
  }

  syncSpriteAnimation() {
    if (!this.currentState) return;
    const animations = this.usesWhiteDog ? WHITE_DOG_ANIMATIONS : PLAYER_ANIMATIONS;
    const animation = animations[this.currentState.state];
    if (!animation) return;
    this.frameY = animation.row;
    this.maxFrame = animation.maxFrame;
    this.frameX = Math.min(this.frameX, this.maxFrame);
  }

  checkCollison() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5,
          ),
        );
        if (
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          this.game.score++;
          this.game.floatingMessages.push(
            new FloatingMessages("+1", enemy.x, enemy.y, 150, 50),
          );
        } else {
          this.setState(6, 0);
          this.game.score -= 1;
          this.game.lives--;
          if (this.game.score < 0 || this.game.lives <= 0) this.game.finish(false);
        }
      }
    });
  }
}
