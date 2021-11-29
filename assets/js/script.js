const grid = document.querySelector('.grid');
const difficultyText = document.getElementById('difficulty-text');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const startButton = document.getElementById('start');
const showScore = document.getElementById('score-area');
const scoreDisplay = document.getElementById('score');
const gameOver = document.getElementById('gameover');
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
const width = 10;
let appleIndex = 0;
let score = 0;
let intervalTime = 1000;
let speed = 0.9;
let timerId = 0;

easyButton.addEventListener('click', easyDifficulty); 
mediumButton.addEventListener('click', mediumDifficulty); 
hardButton.addEventListener('click', hardDifficulty); 

//applies to all three difficulties 
function hideDifficultyShowStart() {
  //Hide the difficulty buttons
  easyButton.classList.add('hidden');
  mediumButton.classList.add('hidden');
  hardButton.classList.add('hidden');
  difficultyText.classList.add('hidden');
  //Show Start button
  startButton.classList.remove('hidden');
  showScore.classList.remove('hidden');
  
};

function easyDifficulty() {
  //Change variables to easy setting

  hideDifficultyShowStart();
};

function mediumDifficulty() {
  //Change variables to medium setting

  hideDifficultyShowStart();
};

function hardDifficulty() {
  //Change variables to hard setting

  hideDifficultyShowStart();
};

startButton.addEventListener('click', startGame);

function createGrid() {
  //create 100 of these elements with a for loop
  for (let i=0; i < width*width; i++) {
    //create element
    const square = document.createElement('div');
    //add styling to the element
    square.classList.add('square');
    if((i>=0 && i<=9) ||(i>=20 && i<=29) || (i>=40 && i<=49) || (i>=60 && i<=69) || (i>=80 && i<=89)) {
      redAndWhite();
    } else {
      whiteAndRed();
    }
   
    //put the element into our grid
    grid.appendChild(square);
    
    //push it into a new squares array    
    squares.push(square);

    //set up checkerboard functions to be called when creating the divs
    function redAndWhite(){
      if( i % 2 == 0 ) {
        square.classList.add('red');
      } else {
        square.classList.add('white');
      }
    };
  
    function whiteAndRed(){
      if( i % 2 == 0 ) {
        square.classList.add('white');
      } else {
        square.classList.add('red');
      }
    };
  }
};
createGrid();


//Colors the background of the current snake by adding the snake class to the matching index in the squares array
currentSnake.forEach(index => squares[index].classList.add('snake'));

function startGame() {
  //reset variables if using button as a "restart"
  //remove the snake
  currentSnake.forEach(index => squares[index].classList.remove('snake'));
  //remove the apple
  squares[appleIndex].classList.remove('apple');

  clearInterval(timerId);
  currentSnake = [2,1,0];
  score = 0;
  //re add new score to browser
  scoreDisplay.textContent = score;

  direction = 1;
  intervalTime = 1000;
  generateApples();
  //readd the class of snake to our new currentSnake
  currentSnake.forEach(index => squares[index].classList.add('snake'));

  //Starts Game
  timerId = setInterval(move, intervalTime);
} 

function move() {
  //stop game if snake hits a wall or itself 
  if (
    (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
    (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake') //if snake runs into itself
  ) {
    gameOver.classList.remove('hidden');
    return clearInterval(timerId);
  }

  
  //remove last element from our currentSnake array
  const tail = currentSnake.pop();
  //remove styling from last element
  squares[tail].classList.remove('snake');
  //add sqaure in direction we are heading
  currentSnake.unshift(currentSnake[0] + direction);
  //add styling so we can see snake
  //...but first check if snake has hit any food
  if (squares[currentSnake[0]].classList.contains('apple')) {
    //remove the class of apple
    squares[currentSnake[0]].classList.remove('apple');
    //grow our snake by adding class of snake to it
    squares[tail].classList.add('snake');
    //grow our snake array (otherwise tail gets left behind)
    currentSnake.push(tail);
    //generate a new apple
    generateApples();
    //add one to the score
    score++;
    //display our score
    scoreDisplay.textContent = score;
    //speed up our snake
    clearInterval(timerId);
    intervalTime = intervalTime * speed;
    timerId = setInterval(move, intervalTime);
  }

  squares[currentSnake[0]].classList.add('snake');

}


function generateApples() {
  //generate a random number while the number contains the snake...
  do {
    appleIndex = Math.floor(Math.random() * squares.length);
  } while (squares[appleIndex].classList.contains('snake'))
  //...then add the apple to the game when it is in a good spot
  squares[appleIndex].classList.add('apple');
}


// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow 

//If user presses one of the direction keys, move the snake in that direction
function control(e) {
  if (e.keyCode === 39) {
      direction = 1;
  } else if (e.keyCode === 38) {
      direction = -width;
  } else if (e.keyCode === 37) {
      direction = -1;
  } else if (e.keyCode === 40) {
      direction = +width;
  }
}
document.addEventListener('keyup', control);

//Launch Game with sound or without

//Play the game

//Save HighScores