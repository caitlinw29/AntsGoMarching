const grid = document.querySelector('.grid');
const difficultyText = document.getElementById('difficulty-text');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const startButton = document.getElementById('start');
const playAgainButton = document.getElementById('play-again');
const showScore = document.getElementById('score-area');
const scoreDisplay = document.getElementById('score');
const gameOver = document.getElementById('gameover');
const overlay = document.getElementById("overlay");
const overlayButton = document.getElementById("overlay-button");
const width = 10;
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let foodIndex = 0;
let owlIndex = 0;
let score = 0;
let scoreAdjustment = 0;
let intervalTime = 1000;
let speed = 0.9;
let timerId = 0;
let owlTimer = 0;
let owlIntervalTime = 10000;

easyButton.addEventListener('click', easyDifficulty); 
mediumButton.addEventListener('click', mediumDifficulty); 
hardButton.addEventListener('click', hardDifficulty); 

//applies to all three difficulties 
function hideDifficultyShowStart() {
  //Hide the difficulty buttons, how to play button, and choose your difficulty text
  easyButton.classList.add('hidden');
  mediumButton.classList.add('hidden');
  hardButton.classList.add('hidden');
  overlayButton.classList.add('hidden');
  difficultyText.classList.add('hidden');
  //Show Start button
  startButton.classList.remove('hidden');
}

function easyDifficulty() {
  scoreAdjustment = 10;
  hideDifficultyShowStart();
}

function mediumDifficulty() {
  //Change variables to medium setting
  owlIntervalTime = 5000;
  intervalTime = 750;
  scoreAdjustment = 50;
  hideDifficultyShowStart();
}

function hardDifficulty() {
  //Change variables to hard setting
  owlIntervalTime = 2500;
  intervalTime = 500;
  scoreAdjustment = 100;
  hideDifficultyShowStart();
}

startButton.addEventListener('click', startGame);

//create the grid (picnic blanket)
function createGrid() {
  //create 100 of these elements with a for loop
  for (let i=0; i < width*width; i++) {
    //create element
    const square = document.createElement('div');
    //add styling to the element
    square.classList.add('square');
    //checkerboard pattern
    if((i>=0 && i<=9) ||(i>=20 && i<=29) || (i>=40 && i<=49) || (i>=60 && i<=69) || (i>=80 && i<=89)) {
      blueAndWhite();
    } else {
      whiteAndBlue();
    }
    //put the element into our grid
    grid.appendChild(square);
    //push it into a new squares array    
    squares.push(square);

    //set up checkerboard functions to be called when creating the divs
    function blueAndWhite(){
      if( i % 2 == 0 ) {
        square.classList.add('blue');
      } else {
        square.classList.add('white');
      }
    };
    function whiteAndBlue(){
      if( i % 2 == 0 ) {
        square.classList.add('white');
      } else {
        square.classList.add('blue');
      }
    };
  }
}
createGrid();
//Colors the background of the current snake by adding the snake class to the matching index in the squares array
currentSnake.forEach(index => squares[index].classList.add('snake'));

function startGame() {
  //hide start button and show score
  startButton.classList.add('hidden');
  showScore.classList.remove('hidden');
  //create food and owl on map to start
  generateFood();
  generateOwl();
  //Starts Game Movement
  timerId = setInterval(move, intervalTime);
  //Starts Owl Timer
  owlTimer = setInterval(generateOwl, owlIntervalTime);
} 

//called in function move(), restarts the game if play again is clicked
function startOver() {
  location.assign("index.html");
}

function move() {
  //stop game if snake hits a wall OR itself OR an owl
  if (
    (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
    (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake') || //if snake runs into itself
    squares[currentSnake[0] + direction].classList.contains('owl') //if snake runs into owl
  ) {
    //have the ant turn around to show it ran into another ant before ending game
    if (direction === -width){
      squares[currentSnake[0]].style.transform = 'rotate(270deg)';
    } else if (direction === -1) {
      squares[currentSnake[0]].style.transform = 'rotate(180deg)';
    } else if (direction === +width) {
      squares[currentSnake[0]].style.transform = 'rotate(90deg)';
    } else {
      squares[currentSnake[0]].style.transform = 'rotate(0deg)';
    }
    //show game over text and play again button
    gameOver.classList.remove('hidden');
    playAgainButton.classList.remove('hidden');
    //stop movement of snake and owl timer
    clearInterval(timerId); 
    clearInterval(owlTimer);
    return;
  }
  playAgainButton.addEventListener('click', startOver);

  //remove last element from our currentSnake array
  const tail = currentSnake.pop();
  //remove styling from last element
  squares[tail].classList.remove('snake');
  //add sqaure in direction we are heading
  currentSnake.unshift(currentSnake[0] + direction);
  //first check if snake has hit any food
  if (squares[currentSnake[0]].classList.contains('food')) {
    //remove the class of food
    squares[currentSnake[0]].classList.remove('food');
    //turn the square in the current direction so ant is facing the right way
    if (direction === -width){
        squares[currentSnake[0]].style.transform = 'rotate(270deg)';
      } else if (direction === -1) {
        squares[currentSnake[0]].style.transform = 'rotate(180deg)';
      } else if (direction === +width) {
        squares[currentSnake[0]].style.transform = 'rotate(90deg)';
      } 
    //grow our snake by adding class of snake to it
    squares[tail].classList.add('snake');
    //grow our snake array (otherwise tail gets left behind)
    currentSnake.push(tail);
    //generate a new food
    generateFood();
    //add points to the score based on difficulty
    score += scoreAdjustment;
    //display our score
    scoreDisplay.textContent = score;
    //speed up our snake
    clearInterval(timerId);
    intervalTime = intervalTime * speed;
    timerId = setInterval(move, intervalTime);
  }
  //add styling so we can see snake
  squares[currentSnake[0]].classList.add('snake');
}

//create food in a random space where the snake is not present
function generateFood() {
  //pick a random square
  foodIndex = Math.floor(Math.random() * squares.length);
  //cycle through all squares
  for (let i=0; i < width*width; i++) {
    //if the food is about to show up where there is a snake or owl, remove the food class and redo the function
    if (currentSnake[i] === foodIndex || owlIndex === foodIndex) {
      squares[foodIndex].classList.remove('food');
      generateFood();
    } else {
      //transform to keep the strawberry upright
      squares[foodIndex].style.transform = 'rotate(0deg)';
      //...then add the food to the game when it is in a good spot
      squares[foodIndex].classList.add('food');
    }
  } 
}

//create an owl
function generateOwl() {
  //pick a random square
  owlIndex = Math.floor(Math.random() * squares.length);
  //cycle through all 100 squares
  for (let i=0; i < width*width; i++) {
    //remove old owl, and turn the square in the correct direction 
    //square won't fix itself otherwise until a key is pressed
    if (squares[i].classList.contains('owl')) {
      squares[i].classList.remove('owl');
      if (direction === -width){
        squares[i].style.transform = 'rotate(270deg)';
      } else if (direction === -1) {
        squares[i].style.transform = 'rotate(180deg)';
      } else if (direction === +width) {
        squares[i].style.transform = 'rotate(90deg)';
      } 
    }
    //if the owl is about to show up where there is a snake or food, remove the owl class and redo the function
    if (currentSnake[i] === owlIndex || foodIndex === owlIndex) {
      squares[owlIndex].classList.remove('owl');
      generateOwl();
    } else {
      //transform to keep the owl upright
      squares[owlIndex].style.transform = 'rotate(0deg)';
      //...then add the owl to the game when it is in a good spot
      squares[owlIndex].classList.add('owl');
    }
  } 
} 

//If user presses one of the direction keys, move the snake in that direction
function control(e) {
  if (e.keyCode === 39) {
    //right arrow
    //for all squares...
    for (let i=0; i<squares.length; i++){
      //if the current square contains snake class, continue
      if (squares[i].classList.contains('snake')){
        continue;
      } else {
        //else transform the rest of the squares to have the ants face right 
        squares[i].style.transform = 'rotate(0deg)';
      }
    }
    //change the snake's direction to be facing right
    direction = 1;
  } else if (e.keyCode === 38) {
      //up arrow
      //for all squares...
      for (let i=0; i<squares.length; i++){
        //if the current square contains snake, food, or owl class, continue
        if (squares[i].classList.contains('snake') || squares[i].classList.contains('food') || squares[i].classList.contains('owl')){
          continue;
        } else {
          //else transform the rest of the squares to have the ants face up
          squares[i].style.transform = 'rotate(270deg)';
        }
      }
      //change the snake's direction to be facing up
      direction = -width;
  } else if (e.keyCode === 37) {
      //left arrow
      //for all squares...
      for (let i=0; i<squares.length; i++){ 
        //if the current square contains snake, food, or owl class, continue
        if (squares[i].classList.contains('snake') || squares[i].classList.contains('food') || squares[i].classList.contains('owl')){
          continue;
        } else {
          //else transform the rest of the squares to have the ants face left
          squares[i].style.transform = 'rotate(180deg)';
        }
      }
      //change the snake's direction to be facing left
      direction = -1;
  } else if (e.keyCode === 40) {
      //down arrow
      //for all squares...
      for (let i=0; i<squares.length; i++){
        //if the current square contains snake, food, or owl class, continue
        if (squares[i].classList.contains('snake') || squares[i].classList.contains('food') || squares[i].classList.contains('owl')){
          continue;
        } else {
          //else transform the rest of the squares to have the ants face down
          squares[i].style.transform = 'rotate(90deg)';
        }
      }
      //change the snake's direction to be facing down
      direction = +width;
  }
}
//listen for key-up to respond to arrow keys being pressed
document.addEventListener('keyup', control);

//if browser is below 700px, load a different screen
function computerGameOnly(x) {
  if (x.matches) { // If media query matches
    location.assign("resize.html");
  } else {
    return;
  }
}
var x = window.matchMedia("(max-width: 700px)")
computerGameOnly(x) // Call listener function at run time to check size of screen

//functions to show how-to-play overlay on click of button
function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

overlay.addEventListener('click', overlayOff);
overlayButton.addEventListener('click', overlayOn);