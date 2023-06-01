// Pong Game Variables
let canvas, ctx;
let ballX, ballY, ballSpeedX, ballSpeedY;
let wall1X, wall1Y, wall2X, wall2Y, wall3X, wall3Y;
let wallNumber;
let paddle1Y, paddle2Y, paddleSpeed;
let paddleHeight, paddleWidth;
let score1, score2;
let isGameStarted;

// Keyboard Input Variables
let upArrowPressed, downArrowPressed, wKeyPressed, sKeyPressed, spaceBarPressed;

// Initialize the game
function init() {
    canvas = document.getElementById("pongCanvas");
    ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth-1.2;
    canvas.height = window.innerHeight-1.2;
  

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  //ballSpeedX = 8;
  //ballSpeedY = 8;

  paddleHeight = 200;
  paddleWidth = 10;
  paddleSpeed = 8;
  paddle1Y = canvas.height / 2 - paddleHeight / 2;
  paddle2Y = canvas.height / 2 - paddleHeight / 2;

  score1 = 0;
  score2 = 0;
  isGameStarted = false;

  // Keyboard event listeners
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  // Update game frames
  setInterval(update, 1000 / 60);

  makeWalls();
}

// Update game state
function update() {
  movePaddles();
  moveBall();
  draw();
}

// Move paddles
function movePaddles() {
  if (upArrowPressed && paddle2Y > 0) {
    paddle2Y -= paddleSpeed;
  } else if (downArrowPressed && paddle2Y + paddleHeight < canvas.height) {
    paddle2Y += paddleSpeed;
  }

  if (wKeyPressed && paddle1Y > 0) {
    paddle1Y -= paddleSpeed;
  } else if (sKeyPressed && paddle1Y + paddleHeight < canvas.height) {
    paddle1Y += paddleSpeed;
  }

}

// Move ball
function moveBall() {
  if (!isGameStarted) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (
        ballX <= paddleWidth && // Ball hits the left paddle
        ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight
      ) {
        // Reverse ball's horizontal direction and give it a random vertical direction
        ballSpeedX = -ballSpeedX;
        ballSpeedY = Math.random() < 0.5 ? -ballSpeedY : ballSpeedY;
      } else {
      // Player 2 scores
      score2++;
      resetBall();
    }
  }

  if (ballX > canvas.width) {
    if (
        ballX >= canvas.width - paddleWidth && // Ball hits the right paddle
        ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight
      ) {
        // Reverse ball's horizontal direction and give it a random vertical direction
        ballSpeedX = -ballSpeedX;
        ballSpeedY = Math.random() < 0.5 ? -ballSpeedY : ballSpeedY;
      } else {
      // Player 1 scores
      score1++;
      resetBall();
    }
  }

  if (ballY < 0 || ballY > canvas.height) {
    // Ball hits the top or bottom wall
    ballSpeedY = -ballSpeedY;
    ballSpeedX = Math.random() < 0.5 ? -ballSpeedX : ballSpeedX;
  }

  if (isTouchingBrown(ballX, ballY)) {
    // Ball hits the color brown
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
  }
}

// Check if the ball touches the color brown
function isTouchingBrown(x, y) {
  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const red = pixelData[0];
  const green = pixelData[1];
  const blue = pixelData[2];
  return red === 165 && green === 42 && blue === 42;
}

// Reset ball position
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = Math.random() < 0.5 ? -9 : 9;
  ballSpeedY = Math.random() < 0.5 ? -9 : 9;
  makeWalls();
}

// Make walls
function makeWalls() {
  wallNumber = Math.floor(Math.random() * 4);
  if (wallNumber == 0) {
    wall1X = canvas.width + 250;
    wall1Y = canvas.height + 250;
    wall2X = canvas.width + 250;
    wall2Y = canvas.height + 250;
    wall3X = canvas.width + 250;
    wall3Y = canvas.height + 250;
  } else if (wallNumber == 1) {
    wall1X = Math.random() * canvas.width;
    wall1Y = Math.random() * canvas.height;
  } else if (wallNumber == 2) {
    wall1X = Math.random() * canvas.width;
    wall1Y = Math.random() * canvas.height;
    wall2X = Math.random() * canvas.width;
    wall2Y = Math.random() * canvas.height;
  } else if (wallNumber == 3) {
    wall1X = Math.random() * canvas.width;
    wall1Y = Math.random() * canvas.height;
    wall2X = Math.random() * canvas.width;
    wall2Y = Math.random() * canvas.height;
    wall3X = Math.random() * canvas.width;
    wall3Y = Math.random() * canvas.height;
  }
}

// Draw game objects on the canvas
function draw() {
  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF";
  ctx.fill();

  // Draw walls
  ctx.fillStyle = "brown";
  ctx.fillRect(wall1X, wall1Y, canvas.width / 20, canvas.height / 10);
  ctx.fillStyle = "#brown";
  ctx.fillRect(wall2X, wall2Y, canvas.width / 20, canvas.height / 10);
  ctx.fillStyle = "#brown";
  ctx.fillRect(wall3X, wall3Y, canvas.width / 20, canvas.height / 10);

  // Draw scores
  ctx.fillStyle = "#FFF";
  ctx.fillText("Player 1: " + score1, 100, 50);
  ctx.fillText("Player 2: " + score2, canvas.width - 250, 50);

  // Draw start text
  if (!isGameStarted) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Press Space to Start", canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Handle keydown event
function handleKeyDown(event) {
  if (event.key === "ArrowUp") {
    upArrowPressed = true;
  } else if (event.key === "ArrowDown") {
    downArrowPressed = true;
  } else if (event.key === "w") {
    wKeyPressed = true;
  } else if (event.key === "s") {
    sKeyPressed = true;
  } else if (event.code === "Space") {
    spaceBarPressed = true;
    if (!isGameStarted) {
      isGameStarted = true;
      resetBall();
    }
  }
}

// Handle keyup event
function handleKeyUp(event) {
  if (event.key === "ArrowUp") {
    upArrowPressed = false;
  } else if (event.key === "ArrowDown") {
    downArrowPressed = false;
  } else if (event.key === "w") {
    wKeyPressed = false;
  } else if (event.key === "s") {
    sKeyPressed = false;
  } else if (event.code === "Space") {
    spaceBarPressed = false;
  }
}

// Start the game
window.onload = init;
