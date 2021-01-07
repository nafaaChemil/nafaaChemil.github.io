const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let cardsDone = 0; // let us check when we finished the game (if (cardsDone ===  cards.length))

let startTime = new Date().getTime(); // time when the page loads (in ms) used for the timer function

function flipCard() {
  if (lockBoard) return; // empeche de cliquer a nouveau quand deux cartes sont deja retournees
  if (this === firstCard) return; // empeche de cliquer deux fois sur la meme carte

  let audio = this.getElementsByClassName("sound")[0];
  audio.duration = 1;
  audio.play(); // joue un song au moment de retourner la carte
  setTimeout(() => {
    audio.pause();
  }, 2000);

  this.classList.toggle("flip"); // retourne la carte

  if (!hasFlippedCard) {
    // si on n'a pas deja retourne une carte
    hasFlippedCard = true;
    firstCard = this;
    return;
  } // sinon si on a deja retourne une carte

  secondCard = this;
  checkForMatch(); //on va pouvoir comparer les deux cartes
}

function checkForMatch() {
  let isMatch = firstCard.dataset.instru === secondCard.dataset.instru;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  cardsDone += 2;
  score += 2;
  printScore();
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  score --;
  printScore();
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1500);
}
function printScore() {
  let elemScore = document.getElementById("score");
  elemScore.innerHTML = `Score : ${score}`;
}

function timer() {
  let timeSpent = Math.floor((new Date().getTime() - startTime) / 1000); // time spent since the page loaded (in seconds)
  let timerElem = document.getElementById("timer");
  timerElem.innerHTML = `Temps écoulé : ${timeSpent} secondes`;

  if (cardsDone === cards.length) {
    clearInterval(time); // if we found all cards, stop the timer
    document.getElementsByClassName('win')[0].style.display = 'block';
    timerElem.classList.add('bravo');
    timerElem.innerHTML = `
    Bravo tu as trouvé les instruments du ROCK
    en ${timeSpent} secondes !!! `;
    
  }
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 8);
    card.style.order = randomPos;
  });
})(); //  = appeler la fonction

let time = setInterval(timer, 1000);

cards.forEach((card) => card.addEventListener("click", flipCard));


function reset() {
  if (cardsDone === cards.length) {
    window.location.reload();
  }
  
}