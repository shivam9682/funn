const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const levelElement = document.querySelector(".high-score");

const controls = document.querySelectorAll(".controls i");

// Game variables 
let score = 0;
let level = 1;
let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalValid;
let isBigFoodActive = false;
let foodEatenCount = 0; // To count how many foods the snake has eaten
let currentLevelSpeed = 300; // Speed starts slow for Level 1

// Sound effects
const backgroundSound = new Audio('../backgound-snake.mp3');
const normalFoodSound = new Audio('../eatsound.mp3');
const bigFoodSound = new Audio('../bigfood-chin.mp3');
const gameOverSound = new Audio('../gameover-tata.mp3');

// Play background sound
backgroundSound.loop = true;
backgroundSound.play();

// Mute states for sounds
let isBackgroundMusicMuted = true;
let isGameSoundMuted = false;

// Button Elements for toggling sounds
const backgroundMusicButton = document.getElementById('background-music-button');
const gameSoundButton = document.getElementById('game-sound-button');

// Toggle background music
const toggleBackgroundMusic = () => {
  if (isBackgroundMusicMuted) {
    backgroundSound.play();
    document.getElementById('background-music-icon').innerText = "🔊";
  } else {
    backgroundSound.pause();
    document.getElementById('background-music-icon').textContent = "volume_off";
  }
  isBackgroundMusicMuted = !isBackgroundMusicMuted;
};

// Toggle game sounds
const toggleGameSounds = () => {
  if (isGameSoundMuted) {
    document.getElementById('game-sound-icon').textContent = "🔊";
  } else {
    normalFoodSound.pause();
    bigFoodSound.pause();
    gameOverSound.pause();
    document.getElementById('game-sound-icon').textContent = "volume_off";
  }
  isGameSoundMuted = !isGameSoundMuted;
};

backgroundMusicButton.addEventListener("click", toggleBackgroundMusic);
gameSoundButton.addEventListener("click", toggleGameSounds);

// Pause all sounds initially
backgroundSound.pause();
normalFoodSound.pause();
bigFoodSound.pause();
gameOverSound.pause();

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const restartGame = () => {
  // Reset the game variables
  gameOver = false;
  foodEatenCount = 0;
  snakeX = 5;
  snakeY = 10;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  isBigFoodActive = false;
  score = 0;

  // Update the score and level
  scoreElement.innerText = `Score : ${score}`;
  levelElement.innerText = `Level : ${level}`;

  // Clear the game board and restart the game loop
  playBoard.innerHTML = '';
  currentLevelSpeed = 300 - (level - 1) * 50; // Adjust speed based on level
  setIntervalValid = setInterval(initGame, currentLevelSpeed);
};

const handleGameOver = () => {
  clearInterval(setIntervalValid); // Stop the game loop
 
  backgroundSound.pause();

  const restart = confirm(
    `Game Over! You reached Level ${level}.\n\nDo you want to restart from the same level?`
  );
  if (restart) {
    restartGame(); // Restart the game from the current level
  } else {
    level = 1; // Reset to Level 1 if user doesn't want to continue
    restartGame();
  }
};

const levelUp = () => {
  if (score >= level * 13) {
    level++;
    score = 0; // Reset score for the new level
    currentLevelSpeed = 300 - (level - 1) * 50; // Adjust speed for the new level

    // Update UI elements
    scoreElement.innerText = `Score : ${score}`;
    levelElement.innerText = `Level : ${level}`;

    // Display congratulation message
    const continueGame = confirm(
      `Congratulations! You completed Level ${level - 1}.\n\nDo you want to continue to Level ${level}?`
    );
    if (continueGame) {
      restartGame(); // Continue to the next level
    } else {
      level = 1; // Reset to Level 1 if user doesn't want to continue
      restartGame();
    }
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();

  // Render food
  let htmlMarkup = isBigFoodActive
    ? `<div class="big-food" style="grid-area: ${foodY} / ${foodX}"></div>`
    : `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Check if the snake eats food
  if (snakeX === foodX && snakeY === foodY) {
    foodEatenCount++;

    if (isBigFoodActive) {
      if (!isGameSoundMuted) bigFoodSound.play();
      for (let i = 0; i < 3; i++) {
        snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
      }
      isBigFoodActive = false;
    } else {
      if (!isGameSoundMuted) normalFoodSound.play();
      snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
    }

    if (foodEatenCount % 4 === 0) {
      isBigFoodActive = true;
    }

    changeFoodPosition();
    score++;
    levelUp();
    scoreElement.innerText = `Score : ${score}`;
    levelElement.innerText = `Level : ${level}`;
  }

  // Move the snake's body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }
  snakeBody[0] = [snakeX, snakeY];

  // Update snake's head position
  snakeX += velocityX;
  snakeY += velocityY;

  // Check for collisions
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    if (!isGameSoundMuted) {
      gameOverSound.play();
    }
  }

  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
      gameOver = true;
      if (!isGameSoundMuted) {
        gameOverSound.play();
      }
    }
  }

  // Render the snake
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += i === 0
      ? `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}">
           <div class="mouth"></div>
         </div>`
      : `<div class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
  }
  playBoard.innerHTML = htmlMarkup;
};


const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  initGame();
};

controls.forEach(key => {
  key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

changeFoodPosition();
setIntervalValid = setInterval(initGame, currentLevelSpeed);
document.addEventListener("keydown", changeDirection);