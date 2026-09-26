class Layer {
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height,
    );
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 1667;
    this.height = game.height;

    this.cityLayers = [
      new Layer(game, this.width, this.height, 0.2, document.getElementById("layer1")),
      new Layer(game, this.width, this.height, 0.4, document.getElementById("layer2")),
      new Layer(game, this.width, this.height, 0.6, document.getElementById("layer3")),
      new Layer(game, this.width, this.height, 0.8, document.getElementById("layer4")),
      new Layer(game, this.width, this.height, 1.0, document.getElementById("layer5")),
    ];

    this.forestLayers = [
      new Layer(game, this.width, this.height, 0.2, document.getElementById("forest-layer1")),
      new Layer(game, this.width, this.height, 0.4, document.getElementById("forest-layer2")),
      new Layer(game, this.width, this.height, 0.6, document.getElementById("forest-layer3")),
      new Layer(game, this.width, this.height, 0.8, document.getElementById("forest-layer4")),
      new Layer(game, this.width, this.height, 1.0, document.getElementById("forest-layer5")),
    ];

    this.backgroundLayers = this.cityLayers;
  }

  setLevel(level) {
    if (level === 1) {
      this.backgroundLayers = this.cityLayers;
    } else if (level === 2) {
      this.backgroundLayers = this.forestLayers;
    }
    this.backgroundLayers.forEach((layer) => (layer.x = 0));
  }

  update() {
    this.backgroundLayers.forEach((layer) => layer.update());
  }

  draw(context) {
    this.backgroundLayers.forEach((layer) => layer.draw(context));
  }
}
