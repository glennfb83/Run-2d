const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const scoreElement = document.getElementById('score');

// Player properties
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: 'red',
    dy: 0,
    gravity: 0.6,
    jumpStrength: 12,
    onGround: true
};

// Obstacle properties
const obstacles = [];
const obstacleSpeed = 4;
const obstacleWidth = 20;
const obstacleHeight = 40;
let lastObstacleTime = 0;
const obstacleInterval = 1500; // milliseconds

// Game state
let score = 0;
let gameOver = false;
let gameRunning = true;

// Input handling
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && player.onGround && !gameOver) {
        player.dy = -player.jumpStrength;
        player.onGround = false;
    }
    if (e.code === 'Enter' && gameOver) {
        resetGame();
    }
});

// Main game loop
function gameLoop(currentTime) {
    if (!gameRunning) return;

    if (!gameOver) {
        update(currentTime);
        draw();
    } else {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Update game state
function update(currentTime) {
    // Update player position
    player.dy += player.gravity;
    player.y += player.dy;

    // Boundary check for the player
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // Generate new obstacles
    if (currentTime - lastObstacleTime > obstacleInterval) {
        spawnObstacle();
        lastObstacleTime = currentTime;
    }

    // Move and filter obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });

    // Check for collisions
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
            gameRunning = false;
        }
    });

    // Increase score and remove off-screen obstacles
    obstacles.forEach(obstacle => {
        if (obstacle.x + obstacle.width < 0) {
            score++;
            scoreElement.textContent = score;
        }
    });
    
    // Filter out obstacles that have moved off-screen
    obstacles.forEach((obstacle, index) => {
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(index, 1);
      }
    });
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    ctx.fillStyle = '#654321'; // Brown
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Spawn a new obstacle
function spawnObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - obstacleHeight - 10,
        width: obstacleWidth,
        height: obstacleHeight,
        color: 'green'
    };
    obstacles.push(obstacle);
}

// Display game over screen
function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

// Reset the game
function resetGame() {
    player.x = 50;
    player.y = 300;
    player.dy = 0;
    player.onGround = true;
    obstacles.length = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gameRunning = true;
    lastObstacleTime = 0; // Reset timer for obstacles
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
