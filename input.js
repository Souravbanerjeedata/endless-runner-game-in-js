export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.lastTapTime = 0;
    this.rollingHeld = false;
    this.activeTouchId = null;
    this.swipeThreshold = 40;
    this.doubleTapMs = 300;
    this.holdLeft = false;
    this.holdRight = false;

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Enter") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === "d") this.game.debug = !this.game.debug;
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Enter"
      ) {
        const i = this.keys.indexOf(e.key);
        if (i > -1) this.keys.splice(i, 1);
      }
    });

    const canvas = document.getElementById("canvas1");
    if (!canvas) return;

    canvas.addEventListener(
      "touchstart",
      (e) => {
        if (this.game.paused || this.game.gameOver) return;
        e.preventDefault();
        const t = e.changedTouches[0];
        this.activeTouchId = t.identifier;
        this.touchStartX = t.clientX;
        this.touchStartY = t.clientY;
        this.touchStartTime = Date.now();

        const now = Date.now();
        if (now - this.lastTapTime < this.doubleTapMs) {
          this.toggleRoll();
          this.lastTapTime = 0;
        } else {
          this.lastTapTime = now;
        }

        const mid = window.innerWidth * 0.5;
        if (t.clientX < mid) {
          this.holdLeft = true;
          this.addKey("ArrowLeft");
          this.removeKey("ArrowRight");
        } else {
          this.holdRight = true;
          this.addKey("ArrowRight");
          this.removeKey("ArrowLeft");
        }
      },
      { passive: false },
    );

    canvas.addEventListener(
      "touchmove",
      (e) => {
        if (this.game.paused || this.game.gameOver) return;
        e.preventDefault();
        let t = null;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.activeTouchId) {
            t = e.changedTouches[i];
            break;
          }
        }
        if (!t) t = e.changedTouches[0];
        const mid = window.innerWidth * 0.5;
        if (t.clientX < mid) {
          this.holdLeft = true;
          this.holdRight = false;
          this.addKey("ArrowLeft");
          this.removeKey("ArrowRight");
        } else {
          this.holdRight = true;
          this.holdLeft = false;
          this.addKey("ArrowRight");
          this.removeKey("ArrowLeft");
        }
      },
      { passive: false },
    );

    canvas.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        let t = null;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.activeTouchId) {
            t = e.changedTouches[i];
            break;
          }
        }
        if (!t) t = e.changedTouches[0];

        const dx = t.clientX - this.touchStartX;
        const dy = t.clientY - this.touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const dt = Date.now() - this.touchStartTime;

        if (absY > this.swipeThreshold && absY > absX && dt < 500) {
          if (dy < 0) {
            this.pulseKey("ArrowUp", 120);
          } else {
            this.pulseKey("ArrowDown", 120);
          }
        }

        this.holdLeft = false;
        this.holdRight = false;
        this.removeKey("ArrowLeft");
        this.removeKey("ArrowRight");
        this.activeTouchId = null;
      },
      { passive: false },
    );

    canvas.addEventListener(
      "touchcancel",
      () => {
        this.holdLeft = false;
        this.holdRight = false;
        this.removeKey("ArrowLeft");
        this.removeKey("ArrowRight");
        this.activeTouchId = null;
      },
      { passive: false },
    );
  }

  addKey(key) {
    if (this.keys.indexOf(key) === -1) this.keys.push(key);
  }

  removeKey(key) {
    const i = this.keys.indexOf(key);
    if (i > -1) this.keys.splice(i, 1);
  }

  pulseKey(key, ms) {
    this.addKey(key);
    setTimeout(() => this.removeKey(key), ms);
  }

  toggleRoll() {
    this.rollingHeld = !this.rollingHeld;
    if (this.rollingHeld) this.addKey("Enter");
    else this.removeKey("Enter");
  }
}
