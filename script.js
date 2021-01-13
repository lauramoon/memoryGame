const gameContainer = document.getElementById("game");
const subheading = document.getElementsByTagName('h2')[0];
const scoreLine = document.getElementById('score');
const bestScoreLine = document.getElementById('best-score');
let numPairs = document.querySelector('#pair-select').value;

const colors = [
  '#88CCEE',
  '#AA4499',
  '#CC6677',
  '#117733',
  '#5F4690',
  '#DDCC77',
  '#44AA99',
  '#999933',
  '#E17C05',
  '#661100',
  '#6699CC',
  '#E58606',
  '#5D69B1',
  '#99C945',
  '#DAA51B',
  '#2F8AC4',
  '#332288',
  '#ED645A',
  '#CC3A8E',
  '#A5AA99',
  '#52BCA3',
  '#CC61B0',
  '#24796C',
  '#764E9F',
  '#1D6996',
  '#882255',
  '#6F4070',
  '#CC503E',
  '#F6CF71',
  '#D3B484',
  '#FE88B1',
  '#B497E7',
  '#87C55F',
  '#F89C74',
  '#E73F74',
  '#D3B484',
  '#882255',
  '#FE88B1',
  '#6F4070',
  '#1D6996',
  '#B497E7',
];


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorsArray) {
  for (let colorArray of colorsArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    for (color of colorArray) {
      newDiv.classList.add(color);
    }
    // newDiv.classList.add(colorArray[0]);
    // newDiv.classList.add(colorArray[1]);

    newDiv.style.backgroundImage = 'radial-gradient(lightgrey, grey)';

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function newGame(num) {
  let shuffledColors = shuffle(colors);
  let gameColors = shuffledColors.slice(0, num+2);
  let colorArrays = [];
  for (let i = 0; i < num; i++) {
    let colors = [];
    for (let j=0; j<3; j++){
      colors.push(gameColors[i+j]);
    }
    colorArrays.push(colors);
  }
  let gameDeck = shuffle(colorArrays.concat(colorArrays));
  createDivsForColors(gameDeck);
  findBestScore();
}

let cardsFlipped = 0;
let cardsPaired = 0;
let divList = [];
let score = 0;

function handleCardClick(event) {
  const card = event.target;
  const cardColor1 = card.classList[0];
  const cardColor2 = card.classList[1];
  const cardColor3 = card.classList[2];
  const eligible = !card.classList.contains('flipped') && !card.classList.contains('paired');
  // first check if already flipped
  if (eligible && cardsFlipped < 2) {
    card.style.backgroundImage = `radial-gradient(${cardColor1}, ${cardColor2}, ${cardColor3})`;
    card.classList.add('flipped');
    divList.push(card);
    cardsFlipped++;
    if (cardsFlipped === 2) {
      judgePair();
      score++;
      scoreLine.textContent = "Total Guesses: " + score;
    }
  }
}

function judgePair() {
  if (divList[0].classList[0] === divList[1].classList[0]){
    subheading.textContent = "Pair found!"
    setTimeout(function(){
      for (card of divList) {
        card.classList.remove('flipped');
        card.classList.add('paired');
      }
      divList = [];
      cardsFlipped = 0;
      cardsPaired += 2;
      if (cardsPaired === numPairs*2) {
        subheading.textContent = "Game over!";
        updateBestScore();
      } else {
        subheading.textContent = 'Click a pair of cards';
      }
    }, 1000);

  } else {
    subheading.textContent = "Not a pair";
    setTimeout(function(){
      for (card of divList) {
        card.classList.remove('flipped');
        card.style.backgroundImage = 'radial-gradient(lightgrey, grey)';
      }
      divList = [];
      cardsFlipped = 0;
      subheading.textContent = 'Click a pair of cards';
    }, 1500);
  }
}

function updateBestScore() {
  if (localStorage.getItem('bestScores')) {
    const bestScores = JSON.parse(localStorage.getItem('bestScores'));
    if (bestScores[numPairs]) {
      if (score < bestScores[numPairs]) {
        bestScoreLine.textContent = `Best Score (${numPairs} pairs): ${score}`;
        bestScores[numPairs] = score;
        localStorage.setItem('bestScores', JSON.stringify(bestScores));
        subheading.textContent = 'New Best Score!';
      }
    } else {
      bestScores[numPairs] = score;
      localStorage.setItem('bestScores', JSON.stringify(bestScores));
      bestScoreLine.textContent = `Best Score (${numPairs} pairs): ${score}`;
    }
  } else {
    bestScoreLine.textContent = `Best Score (${numPairs} pairs): ${score}`;
    const bestScores = {};
    bestScores[numPairs] = score;
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
  }
}

function findBestScore() {
  if (localStorage.getItem('bestScores')) {
    const bestScores = JSON.parse(localStorage.getItem('bestScores'));
    if (bestScores[numPairs]) {
      bestScoreLine.textContent = `Best Score (${numPairs} pairs): ${bestScores[numPairs]}`
    } else {
      bestScoreLine.textContent = `Best Score (${numPairs} pairs):` 
    }
  }
}

document.querySelector('#new-game').addEventListener('submit', function(e) {
  e.preventDefault();
  gameContainer.innerHTML = '';
  numPairs = document.querySelector('#pair-select').value;
  newGame(numPairs);
  scoreLine.textContent = "Total Guesses: ";
  subheading.textContent = 'Click a pair of cards';
  cardsFlipped = 0;
  cardsPaired = 0;
  score = 0;
})

// when the DOM loads
newGame(numPairs);

