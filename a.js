const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const levelElement = document.querySelector(".high-score");

const controls = document.querySelectorAll(".controls i");

// games variable 
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

// Sound effects
const backgroundSound = new Audio('../backgound-snake.mp3'); // Add path to background sound
const normalFoodSound = new Audio('../eatsound.mp3'); // Add path to normal food sound
const bigFoodSound = new Audio('../bigfood-chin.mp3'); // Add path to big food sound
const gameOverSound = new Audio('../gameover-tata.mp3'); // Add path to game over sound

// To play background sound
backgroundSound.loop = true;
backgroundSound.play();

// Mute states for sounds
let isBackgroundMusicMuted = true;
let isGameSoundMuted = false;

// Button Elements for toggling sounds
const backgroundMusicButton = document.getElementById('background-music-button');
const gameSoundButton = document.getElementById('game-sound-button');

// To play or pause the background music
const toggleBackgroundMusic = () => {
   if (isBackgroundMusicMuted) {
     backgroundSound.play();
     document.getElementById('background-music-icon').innerText = "🔊";  // Show volume_up icon
   } else {
     backgroundSound.pause();
     document.getElementById('background-music-icon').textContent = "volume_off";  // Show volume_off icon
   }
   isBackgroundMusicMuted = !isBackgroundMusicMuted;
};

// To mute/unmute game sounds
const toggleGameSounds = () => {
   if (isGameSoundMuted) {
   //   normalFoodSound.play();
   //   bigFoodSound.play();
   //   gameOverSound.play();
     document.getElementById('game-sound-icon').textContent = "🔊";  // Show volume_up icon
   } else {
     normalFoodSound.pause();
     bigFoodSound.pause();
     gameOverSound.pause();
     document.getElementById('game-sound-icon').textContent = "volume_off";  // Show volume_off icon
   }
   isGameSoundMuted = !isGameSoundMuted;
};

backgroundMusicButton.addEventListener("click", toggleBackgroundMusic);
gameSoundButton.addEventListener("click", toggleGameSounds);

// Mute the sounds initially when the game starts
backgroundSound.pause(); // Pause background music initially
normalFoodSound.pause(); // Pause normal food sound initially
bigFoodSound.pause(); // Pause big food sound initially
gameOverSound.pause(); // Pause game over sound initially

let foodEatenCount = 0; // To count how many foods the snake has eaten

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalValid); // Stop the game loop
  if (!isGameSoundMuted) {
    gameOverSound.play(); // Play game over sound if not muted
  }
  backgroundSound.pause(); // Pause background music on game over

  // Show alert with a message
  alert("Game Over! Press OK to restart the game.");

  // Reset game variables after the alert is closed
  score = 0;
  level = 1;
  gameOver = false;
  foodEatenCount = 0;
  snakeX = 5;
  snakeY = 10;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  isBigFoodActive = false;

  // Reset UI elements
  scoreElement.innerText = `Score : ${score}`;
  levelElement.innerText = `Level : ${level}`;
  
  // Clear the game board
  playBoard.innerHTML = ''; // Clear any existing snake or food

  // Restart the game loop
  setIntervalValid = setInterval(initGame, 125); // Restart the game with initial settings
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

const levelUp = () => {
  if (score >= level * 13) {
    level++;
    alert(`Hurray! You completed Level ${level - 1}. Continue to Level ${level}?`);
    // Increase speed after level up
    clearInterval(setIntervalValid);
    setIntervalValid = setInterval(initGame, 125 - level * 10);  // Snake moves faster with each level
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();

  // Render food or big food
  let htmlMarkup = "";
  if (isBigFoodActive) {
    htmlMarkup += `<div class="big-food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  } else {
    htmlMarkup += `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  }

  // Check if the snake eats food
  if (snakeX === foodX && snakeY === foodY) {
    foodEatenCount++; // Increment food eaten count

    if (isBigFoodActive) {
      if (!isGameSoundMuted) bigFoodSound.play(); // Play big food sound if not muted
      snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
      snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
      snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
      isBigFoodActive = false; // Reset big food status
    } else {
      if (!isGameSoundMuted) normalFoodSound.play(); // Play normal food sound if not muted
      snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
    }

    // Check if the next food should be big food
    if (foodEatenCount % 4 === 0) {
      isBigFoodActive = true; // Set big food status
    }

    changeFoodPosition(); // Generate new food position
    score++;
    levelUp(); // Check for level up
    scoreElement.innerText = `Score : ${score}`;
    levelElement.innerText = `Level : ${level}`;
  }

  // Move the snake's body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]]; // Copy the previous segment position
  }
  snakeBody[0] = [snakeX, snakeY]; // Update the head position

  // Update snake's head position
  snakeX += velocityX;
  snakeY += velocityY;

  // Check for collisions with the wall or itself
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
    if (i === 0) {
      // Snake head
      htmlMarkup += `
        <div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}">
          <div class="mouth"></div>
        </div>`;
    } else {
      // Snake body
      htmlMarkup += `
        <div class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalValid = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
