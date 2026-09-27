class Layer {
  constructor(game, width, height, speedModifier, image, mirrorTiles = false) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.mirrorTiles = mirrorTiles;
    this.x = 0;
    this.y = 0;
  }
  update() {
    const w = this.width * (this.game.height / this.height);
    const period = w * (this.mirrorTiles ? 2 : 1);
    this.x -= this.game.speed * this.speedModifier;
    if (this.x <= -period) this.x += period;
  }
  draw(context) {
    const h = this.game.height;
    const w = this.width * (h / this.height);
    if (!this.mirrorTiles) {
      context.drawImage(this.image, this.x, 0, w, h);
      context.drawImage(this.image, this.x + w, 0, w, h);
      return;
    }

    // A small overlap hides subpixel hairlines at fractional scroll positions.
    const overlap = 2;
    const firstTile = Math.floor(-this.x / w);
    for (let tile = firstTile; this.x + tile * w < this.game.width; tile++) {
      const x = this.x + tile * w;
      if (tile % 2 === 0) {
        context.drawImage(this.image, x, 0, w + overlap, h);
      } else {
        context.save();
        context.translate(x + w + overlap, 0);
        context.scale(-1, 1);
        context.drawImage(this.image, 0, 0, w + overlap, h);
        context.restore();
      }
    }
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
    this.cityLayers = this._makeParallax(
      ["layer1", "layer2", "layer3", "layer4", "layer5"],
      1667,
      500,
      [0.2, 0.4, 0.6, 0.8, 1],
    );
    this.forestLayers = this._makeParallax(
      [
        "forest-layer1",
        "forest-layer2",
        "forest-layer3",
        "forest-layer4",
        "forest-layer5",
      ],
      1667,
      500,
      [0.2, 0.4, 0.6, 0.8, 1],
    );
    const worldSpeeds = [0.12, 0.25, 0.45, 0.7, 1];
    this.hillsLayers = this._makeParallax(
      ["hills-layer1", "hills-layer2", "hills-layer3", "hills-layer4", "hills-layer5"],
      2400, 720, worldSpeeds,
    );
    this.mushroomLayers = this._makeParallax(
      ["mushroom-layer1", "mushroom-layer2", "mushroom-layer3", "mushroom-layer4", "mushroom-layer5"],
      2400, 720, worldSpeeds,
    );
    this.desertLayers = this._makeParallax(
      ["desert-layer1", "desert-layer2", "desert-layer3", "desert-layer4", "desert-layer5"],
      2400, 720, worldSpeeds,
    );
    this.backgroundLayers = this.cityLayers;
  }

  _makeParallax(ids, width, height, speeds) {
    return ids.map((id, i) => {
      const img = document.getElementById(id);
      const sp = speeds[i] != null ? speeds[i] : 1;
      return new Layer(this.game, width, height, sp, img, width === 2400);
    });
  }

  setLevel(level) {
    if (level === 1) this.backgroundLayers = this.cityLayers;
    else if (level === 2) this.backgroundLayers = this.forestLayers;
    else if (level === 3) this.backgroundLayers = this.hillsLayers;
    else if (level === 4) this.backgroundLayers = this.mushroomLayers;
    else if (level === 5) this.backgroundLayers = this.desertLayers;
    this.backgroundLayers.forEach((l) => {
      l.x = 0;
    });
  }

  update() {
    this.backgroundLayers.forEach((layer) => layer.update());
  }

  draw(context) {
    this.backgroundLayers.forEach((layer) => layer.draw(context));
  }
}
