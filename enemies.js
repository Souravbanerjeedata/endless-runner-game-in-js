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
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

// ==================== CITY ENEMIES ====================
export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 60;
    this.spriteHeight = 44;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
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
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
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
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
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

// ==================== FOREST GROUND ENEMIES ====================
export class DiggerEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 180;
    this.spriteHeight = 140;
    this.width = this.spriteWidth * 0.55;
    this.height = this.spriteHeight * 0.55;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.5 + 0.4;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_digger");
  }
}

export class GroundZombieEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 160;
    this.spriteHeight = 140;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.4 + 0.3;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemy_ground_zombie");
  }
}

export class ZombieEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 120;
    this.spriteHeight = 140;
    this.width = this.spriteWidth * 0.55;
    this.height = this.spriteHeight * 0.55;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.6 + 0.4;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemy_zombie");
  }
}

export class WormEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 229;
    this.spriteHeight = 171;
    this.width = this.spriteWidth * 0.45;
    this.height = this.spriteHeight * 0.45;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = Math.random() * 0.3 + 0.2;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_worm");
  }
}

export class HandEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.width = this.spriteWidth * 0.65;
    this.height = this.spriteHeight * 0.65;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin + 8;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_hand");
  }
}

// ==================== FOREST FLYING / SPECIAL ENEMIES ====================
export class Ghost4Enemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 80;
    this.spriteHeight = 90;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() * 1.5 + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_ghost_4");
    this.angle = 0;
    this.curve = Math.random() * 3 + 2;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.y += Math.sin(this.angle) * this.curve;
    this.angle += 0.05;
  }
  draw(context) {
    context.save();
    context.globalAlpha = 0.75;
    super.draw(context);
    context.restore();
  }
}

export class Ghost3Enemy extends Ghost4Enemy {
  constructor(game) {
    super(game);
    this.spriteWidth = 70;
    this.spriteHeight = 80;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.image = document.getElementById("enemy_ghost_3");
  }
}

export class Ghost2Enemy extends Ghost4Enemy {
  constructor(game) {
    super(game);
    this.spriteWidth = 60;
    this.spriteHeight = 70;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.image = document.getElementById("enemy_ghost_2");
  }
}

export class Bat3Enemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 80;
    this.spriteHeight = 60;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = this.game.width + Math.random() * this.game.width * 0.3;
    this.y = Math.random() * this.game.height * 0.4;
    this.speedX = Math.random() * 2 + 1.5;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_bat_3");
    this.angle = 0;
    this.va = Math.random() * 0.15 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
  }
}

export class RavenEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 100;
    this.spriteHeight = 70;
    this.width = this.spriteWidth * 0.8;
    this.height = this.spriteHeight * 0.8;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.4;
    this.speedX = Math.random() * 2 + 2;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_raven");
    this.angle = 0;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += 0.08;
    this.y += Math.sin(this.angle) * 1.5;
  }
}

export class SpiderEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 310;
    this.spriteHeight = 175;
    this.width = this.spriteWidth * 0.35;
    this.height = this.spriteHeight * 0.35;
    this.x = Math.random() * this.game.width * 0.7 + this.game.width * 0.2;
    this.y = 0 - this.height;
    this.speedX = 0;
    this.speedY = Math.random() * 0.5 + 0.3;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_spider");
    this.maxLength = Math.random() * this.game.height * 0.55 + 80;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.maxLength) this.speedY *= -1;
    if (this.y < -this.height * 2) this.markedForDeletion = true;
  }
  draw(context) {
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 10);
    context.stroke();
    super.draw(context);
  }
}

export class SpinnerEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.spriteWidth = 80;
    this.spriteHeight = 80;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() * 1.5 + 1;
    this.speedY = 0;
    this.maxFrame = 8;
    this.image = document.getElementById("enemy_spinner");
    this.angle = 0;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += 0.1;
    this.y += Math.sin(this.angle) * 3;
  }
}
