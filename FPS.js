class FPS {
  constructor() {
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 0;
  }

  update() {
    const now = performance.now();
    this.frameCount++;

    // recalculate FPS every second
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  draw(ctx, x = 10, y = 20) {
    ctx.fillStyle = "black";
    ctx.font = "16px monospace";
    ctx.fillText(`FPS: ${this.fps}`, x, y);
  }
}