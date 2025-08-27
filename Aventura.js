const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jogador
let player = { x: 50, y: 300, w: 48, h: 48, dy: 0, grounded: false };
let gravity = 0.8;
let keys = {};
let score = 0;

const groundHeight = 60;

// Moedas
let coins = [];
function spawnCoin() {
  const x = Math.random() * (canvas.width - 20) + 10;
  coins.push({ x: x, y: 300, r: 10 });
}
setInterval(spawnCoin, 2000);

// Controles
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function update() {
  // Movimento horizontal
  if (keys["ArrowRight"]) player.x += 5;
  if (keys["ArrowLeft"]) player.x -= 5;

  // Pulo
  if (keys["Space"] && player.grounded) {
    player.dy = -12;
    player.grounded = false;
  }

  // Gravidade
  player.y += player.dy;
  if (!player.grounded) player.dy += gravity;

  // Colisão com chão
  if (player.y + player.h >= canvas.height - groundHeight) {
    player.y = canvas.height - groundHeight - player.h;
    player.dy = 0;
    player.grounded = true;
  }

  // Coleta moedas
  coins = coins.filter(coin => {
    const distX = player.x + player.w/2 - coin.x;
    const distY = player.y + player.h/2 - coin.y;
    const distance = Math.sqrt(distX*distX + distY*distY);
    if (distance < 25) {
      score++;
      return false;
    }
    return true;
  });
}

function draw() {
  // Fundo
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sol
  ctx.beginPath();
  ctx.arc(700, 80, 40, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();

  // Chão
  ctx.fillStyle = "green";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  // Jogador (retângulo)
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Moedas
  ctx.fillStyle = "gold";
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pontuação
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
