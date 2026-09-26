export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    // Score
    context.fillText("Score: " + this.game.score, 20, 50);

    // Timer
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 80);

    // Level indicator
    context.fillText(
      "Level: " + (this.game.level === 1 ? "City" : "Forest"),
      20,
      110,
    );

    // Lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 125, 25, 25);
    }

    // Game over message
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = this.fontSize * 2 + "px " + this.fontFamily;
      if (this.game.score > this.game.winningScore) {
        context.fillText(
          "Victory!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20,
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "They did not know who they were dealing with!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20,
        );
      } else {
        context.fillText(
          "You Failed.",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20,
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "Better luck next time!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20,
        );
      }
    }
    context.restore();
  }
}
