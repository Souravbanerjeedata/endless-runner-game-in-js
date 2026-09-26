class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
  draw(context) {
    if (this.game.debug) {
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

// ==================== CITY ====================
export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 60;
    this.spriteHeight = 44;
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.45;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_fly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 60;
    this.spriteHeight = 87;
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
    this.image = document.getElementById("enemy_plant");
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 120;
    this.spriteHeight = 144;
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_spider_big");
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}

// ==================== FOREST GROUND ====================
// digger sheet 2080x178 → 8 frames × 260
export class DiggerEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 260;
    this.spriteHeight = 178;
    this.width = 95;
    this.height = 65;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.5 + 0.4;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemy_digger");
  }
}

// ground_zombie 961x90 → ~8 frames × 120
export class GroundZombieEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 120;
    this.spriteHeight = 90;
    this.width = 85;
    this.height = 64;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.4 + 0.3;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemy_ground_zombie");
  }
}

// zombie 2336x410 → 8 frames × 292
export class ZombieEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 292;
    this.spriteHeight = 410;
    this.width = 70;
    this.height = 98;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.6 + 0.4;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemy_zombie");
  }
}

// worm 482x60 → 6 frames × 80
export class WormEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 80;
    this.spriteHeight = 60;
    this.width = 80;
    this.height = 60;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.3 + 0.2;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_worm");
  }
}

// hand 446x80 → 5 frames × 89
export class HandEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("enemy_hand");
    // sheet 446x80 → 8 frames × 55
    this.maxFrame = 7;
    this.spriteWidth = 55;
    this.spriteHeight = 80;
    this.width = 55;
    this.height = 80;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 0;
    this.speedY = 0;
  }
}

// ==================== FOREST FLYING ====================
// ghost_4 sheet 361x70 → 6 frames × 60
export class Ghost4Enemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("enemy_ghost_4");
    this.maxFrame = 5;
    this.spriteWidth = 60;
    this.spriteHeight = 70;
    this.width = 60;
    this.height = 70;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.35 + this.game.height * 0.15;
    this.speedX = Math.random() * 1.2 + 0.8;
    this.speedY = 0;
    this.angle = 0;
    this.curve = Math.random() * 2 + 1.5;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.y += Math.sin(this.angle) * this.curve;
    this.angle += 0.05;
  }
  draw(context) {
    context.save();
    context.globalAlpha = 0.85;
    super.draw(context);
    context.restore();
  }
}

// ghost_3 sheet 524x70 → 6 frames × 87
export class Ghost3Enemy extends Ghost4Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("enemy_ghost_3");
    this.maxFrame = 5;
    this.spriteWidth = 87;
    this.spriteHeight = 70;
    this.width = 87;
    this.height = 70;
  }
}

// ghost_2 160x89 → 2 frames × 80
export class Ghost2Enemy extends Ghost4Enemy {
  constructor(game) {
    super(game);
    this.spriteWidth = 80;
    this.spriteHeight = 89;
    this.width = 80;
    this.height = 89;
    this.maxFrame = 1;
    this.image = document.getElementById("enemy_ghost_2");
  }
}

// bat_3 1596x188 → 6 frames × 266
export class Bat3Enemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    this.width = 90;
    this.height = 64;
    this.x = this.game.width + Math.random() * this.game.width * 0.3;
    this.y = Math.random() * this.game.height * 0.3 + this.game.height * 0.18;
    this.speedX = Math.random() * 1.8 + 1.2;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_bat_3");
    this.angle = 0;
    this.va = Math.random() * 0.12 + 0.08;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2.2;
  }
}

// raven 1626x194 → 6 frames × 271
export class RavenEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.width = 95;
    this.height = 68;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.3 + this.game.height * 0.18;
    this.speedX = Math.random() * 1.8 + 1.5;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_raven");
    this.angle = 0;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += 0.07;
    this.y += Math.sin(this.angle) * 1.6;
  }
}

// spider 1860x175 → 6 frames × 310
export class SpiderEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    // sheet 1860x175 → 6 frames × 310 (same as classic spider)
    this.spriteWidth = 310;
    this.spriteHeight = 175;
    this.width = 100;
    this.height = 56;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_spider");
  }
  update(deltaTime) {
    super.update(deltaTime);
    // Same behaviour as Level 1 ClimbingEnemy (spider_big):
    // bounce at ground, delete if goes above screen
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }
  draw(context) {
    super.draw(context);
    // web line from top of screen (same as L1)
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 10);
    context.stroke();
  }
}


export class SpinnerEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 213;
    this.spriteHeight = 212;
    this.width = 80;
    this.height = 80;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.3 + this.game.height * 0.2;
    this.speedX = Math.random() * 1.2 + 0.8;
    this.speedY = 0;
    this.maxFrame = 8;
    this.image = document.getElementById("enemy_spinner");
    this.angle = 0;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += 0.1;
    this.y += Math.sin(this.angle) * 2.5;
  }
}
