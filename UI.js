export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
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
    context.fillText("Score: " + this.game.score, 20, 50);

    context.font = "20px " + this.fontFamily;
    const dest = this.game.destinationName || "";
    if (dest) context.fillText(dest, 20, 80);

    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(
        document.getElementById("lives"),
        25 * i + 20,
        95,
        25,
        25,
      );
    }

    if (this.game.paused && !this.game.gameOver) {
      context.textAlign = "center";
      context.font = "60px " + this.fontFamily;
      context.fillText(
        "Paused",
        this.game.width * 0.5,
        this.game.height * 0.5,
      );
    }

    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = "60px " + this.fontFamily;
      if (this.game.victory) {
        context.fillText(
          "Victory!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20,
        );
        context.font = "25px " + this.fontFamily;
        context.fillText(
          "150 points reached",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20,
        );
      } else if (this.game.score < 0) {
        context.fillText(
          "Game Over",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20,
        );
        context.font = "25px " + this.fontFamily;
        context.fillText(
          "Score went negative!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20,
        );
      } else if (this.game.lives <= 0) {
        context.fillText(
          "Game Over",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20,
        );
        context.font = "25px " + this.fontFamily;
        context.fillText(
          "No lives left",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20,
        );
      } else {
        context.fillText(
          "Game Over",
          this.game.width * 0.5,
          this.game.height * 0.5,
        );
      }
    }
    context.restore();
  }
}
