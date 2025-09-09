class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.color = "rgba(213, 126, 68, 0.1)";
    this.radius = 20;
    this.vx = 0;
    this.vy = 0;
  }

  draw(ctx) {
    // extract rgba components
    const match = this.color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)?\)/
    );
    let r = 255,
      g = 255,
      b = 255;
    if (match) {
      r = match[1];
      g = match[2];
      b = match[3];
    }

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );

    gradient.addColorStop(0, this.color); // center color
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`); // transparent edge

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
