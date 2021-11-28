const grid = document.querySelector('.grid');
const startButton = document.getElementById('start');
const score = document.getElementById('score');
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
const width = 10;
let appleIndex = 0;

function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div');
    //add styling to the element
    square.classList.add('square');
    //put the element into our grid
    grid.appendChild(square);
    //push it into a new squares array    
    squares.push(square);
    }
    
};
createGrid();

//Colors the background of the current snake by adding the snake class to the matching index in the squares array
currentSnake.forEach(index => squares[index].classList.add('snake'));

function move() {

  if (
    (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
    (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake') //if snake runs into itself
  ) {
    return clearInterval(timerId);
  }

  

  //remove last element from our currentSnake array
  const tail = currentSnake.pop();
  //remove styling from last element
  squares[tail].classList.remove('snake');
  //add sqaure in direction we are heading
  currentSnake.unshift(currentSnake[0] + direction);
  //add styling so we can see it





  
  squares[currentSnake[0]].classList.add('snake');

}
move();

let timerId = setInterval(move, 1000);

function generateApples() {
  //generate a random number while the number contains the snake...
  do {
    appleIndex = Math.floor(Math.random() * squares.length);
  } while (squares[appleIndex].classList.contains('snake'))
  //...then add the apple to the game when it is in a good spot
  squares[appleIndex].classList.add('apple');
}
generateApples();

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