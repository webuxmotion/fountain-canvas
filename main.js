const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const fpsMeter = new FPS();

const gravity = 0.2;
const fireColors = [
  "rgba(255, 245, 204, 0.5)", // pale white-yellow
  "rgba(255, 217, 102, 0.5)", // bright yellow
  "rgba(255, 140, 66, 0.5)", // orange
  "rgba(233, 79, 30, 0.5)", // red-orange
  "rgba(124, 10, 2, 0.5)", // dark ember red
];
const waterColors = [
  "rgba(204, 245, 255, 0.5)", // very pale cyan
  "rgba(102, 217, 255, 0.5)", // light blue
  "rgba(66, 140, 255, 0.5)", // medium blue
  "rgba(30, 79, 233, 0.5)", // deep blue
  "rgba(2, 10, 124, 0.5)", // dark navy
];
let palette = fireColors;
const totalBalls = 1000;
const balls = generateBalls();

document.querySelectorAll(".js-pick-mode").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (e.target.dataset.mode == "fire") {
      palette = fireColors;
    } else {
      palette = waterColors;
    }
  });
});

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(draw);

  fpsMeter.update();
  fpsMeter.draw(ctx);

  requestAnimationFrame(animate);
})();

function generateBalls() {
  const balls = [];

  for (let i = 0; i < totalBalls; i++) {
    const ball = new Ball();

    setBallParams(ball);

    balls.push(ball);
  }

  return balls;
}

function setBallParams(ball) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height;
  ball.vx = Math.random() * 6 - 3;
  ball.vy = Math.random() * -10 - 10;
  ball.radius = 50;

  const colorIndex = Math.floor(Math.random() * palette.length);
  ball.color = palette[colorIndex];
}

function draw(ball) {
  if (
    ball.x - ball.radius > canvas.width ||
    ball.x + ball.radius < 0 ||
    ball.y - ball.radius * 10 > canvas.height ||
    ball.y + ball.radius < 0
  ) {
    setBallParams(ball);
  }

  ball.vy += gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.draw(ctx);
}
