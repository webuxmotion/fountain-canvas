// WebGL setup
const canvas = document.getElementById("app");
const gl = canvas.getContext("webgl");

// Shader sources
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute vec3 a_color;
  varying vec3 v_color;

  void main() {
    gl_Position = vec4((a_position / vec2(${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})) * 2.0 - 1.0, 0, 1);
    gl_PointSize = a_size;
    v_color = a_color;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec3 v_color;

  void main() {
    // make circular points with smooth edges
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    gl_FragColor = vec4(v_color, alpha);
  }
`;

// Compile shaders
function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Look up attributes
const positionLoc = gl.getAttribLocation(program, "a_position");
const sizeLoc = gl.getAttribLocation(program, "a_size");
const colorLoc = gl.getAttribLocation(program, "a_color");

// Buffers
const totalBalls = 10000;
const positions = new Float32Array(totalBalls * 2);
const sizes = new Float32Array(totalBalls);
const colors = new Float32Array(totalBalls * 3);
const velocities = new Float32Array(totalBalls * 2);

for (let i = 0; i < totalBalls; i++) {
  positions[i * 2] = canvas.width / 2;
  positions[i * 2 + 1] = canvas.height;
  velocities[i * 2] = Math.random() * 6 - 3;
  velocities[i * 2 + 1] = Math.random() * -10 - 10;
  sizes[i] = 20 + Math.random() * 20;

  // fire color palette
  const palette = [
    [1.0, 0.96, 0.8],
    [1.0, 0.85, 0.4],
    [1.0, 0.55, 0.26],
    [0.91, 0.2, 0.12],
    [0.48, 0.04, 0.01],
  ];
  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3] = c[0];
  colors[i * 3 + 1] = c[1];
  colors[i * 3 + 2] = c[2];
}

// Upload buffers
function makeBuffer(data, loc, size) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  return buffer;
}

const posBuffer = makeBuffer(positions, positionLoc, 2);
const sizeBuffer = makeBuffer(sizes, sizeLoc, 1);
const colorBuffer = makeBuffer(colors, colorLoc, 3);

// Animation loop
function animate() {
  // update particle physics on CPU
  for (let i = 0; i < totalBalls; i++) {
    positions[i * 2] += velocities[i * 2];
    positions[i * 2 + 1] += velocities[i * 2 + 1];
    velocities[i * 2 + 1] += 0.2; // gravity

    if (positions[i * 2 + 1] > canvas.height) {
      positions[i * 2] = canvas.width / 2;
      positions[i * 2 + 1] = canvas.height;
      velocities[i * 2] = Math.random() * 6 - 3;
      velocities[i * 2 + 1] = Math.random() * -10 - 10;
    }
  }

  // update buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

  // clear + draw
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, totalBalls);

  requestAnimationFrame(animate);
}

gl.clearColor(0, 0, 0, 1);
animate();