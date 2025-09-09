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
        // const gradient = ctx.createRadialGradient(
        //     this.x, this.y, 0,                // inner circle (center)
        //     this.x, this.y, this.radius       // outer circle (edge)
        // );

        // gradient.addColorStop(0, this.color);                       // full color at center
        // gradient.addColorStop(1, "rgba(213, 126, 68, 0)");          // transparent at edge

        // ctx.fillStyle = gradient;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}