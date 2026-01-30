/* using strict mode so bugs show up earlier rather than doing weird stuff silently*/
"use strict";


/*
 Difficulty + Image Configuration (READ THIS FIRST)
What this does:
Defines THREE separate image pools: one for Easy, Medium, and Hard.
Each pool has its own card count and its own set of images.
When the player selects a difficulty in the UI, the JavaScript will ONLY use
the images from that difficulty’s folder to build the matching deck.
 
How the game uses this config:
- cardCount = total cards shown on the board (must be even).
- pairsNeeded = cardCount / 2  (because each image must appear twice).
- The game duplicates each asset to create pairs, then shuffles the full deck.
- Matching is done using the 'key' (two cards match when their keys match).

IMPORTANT FOR TEAM (DO NOT BREAK THESE):
1) Folder structure (must stay exactly like this):
assets/images/game1-fruit/  -> Easy images (4 unique images = 4 pairs)
assets/images/game2-people/ -> Medium images (6 unique images = 6 pairs)
assets/images/game3-catsdogs/ -> Hard images (8 unique images = 8 pairs)
 
2) If you rename or move any image files, you MUST update the 'src' paths here,
otherwise images will not load (broken cards).
 
3) HTML difficulty selector must use these exact values:
<option value="easy">, <option value="medium">, <option value="hard">
Because the JS uses those strings to look up DIFFICULTY_CONFIG[diffKey].
 
4) Minimum images required per difficulty:
- Easy: 8 cards = 4 pairs -> needs at least 4 unique assets
- Medium: 12 cards = 6 pairs -> needs at least 6 unique assets
- Hard: 16 cards = 8 pairs -> needs at least 8 unique assets
5) 'alt' text is used for accessibility (screen readers) when a card is flipped.
*/

const DIFFICULTY_CONFIG = {
  easy: {
    cardCount: 8, // 4 pairs
    assets: [
      { key: "fruit_banana",     src: "assets/images/game1-fruit/banana.png",     alt: "Banana" },
      { key: "fruit_kiwi",       src: "assets/images/game1-fruit/kiwi.png",       alt: "Kiwi" },
      { key: "fruit_orange",     src: "assets/images/game1-fruit/orange.png",     alt: "Orange" },
      { key: "fruit_strawberry", src: "assets/images/game1-fruit/strawberry.png", alt: "Strawberry" },
    ],
  },

  medium: {
    cardCount: 12, // 6 pairs
    assets: [
      { key: "person_1", src: "assets/images/game2-people/person1.png", alt: "Person 1" },
      { key: "person_2", src: "assets/images/game2-people/person2.png", alt: "Person 2" },
      { key: "person_3", src: "assets/images/game2-people/person3.png", alt: "Person 3" },
      { key: "person_4", src: "assets/images/game2-people/person4.png", alt: "Person 4" },
      { key: "person_5", src: "assets/images/game2-people/person5.png", alt: "Person 5" },
      { key: "person_6", src: "assets/images/game2-people/person6.png", alt: "Person 6" },
    ],
  },

  hard: {
    cardCount: 16, // 8 pairs
    assets: [
      { key: "cat_1", src: "assets/images/game3-catsdogs/cat1.png", alt: "Cat 1" },
      { key: "cat_2", src: "assets/images/game3-catsdogs/cat2.png", alt: "Cat 2" },
      { key: "cat_3", src: "assets/images/game3-catsdogs/cat3.png", alt: "Cat 3" },
      { key: "cat_4", src: "assets/images/game3-catsdogs/cat4.png", alt: "Cat 4" },
      { key: "dog_1", src: "assets/images/game3-catsdogs/dog1.png", alt: "Dog 1" },
      { key: "dog_2", src: "assets/images/game3-catsdogs/dog2.png", alt: "Dog 2" },
      { key: "dog_3", src: "assets/images/game3-catsdogs/dog3.png", alt: "Dog 3" },
      { key: "dog_4", src: "assets/images/game3-catsdogs/dog4.png", alt: "Dog 4" },
    ],
  },
};

/* Back-of-card image shown before flip (placeholder image). */
var BACK_IMAGE_SRC = "assets/favicons/freepikmini64.png";

/* Map difficulty -> which static board section to show */
var BOARD_BY_DIFFICULTY = {
  easy: "game-area-1",
  medium: "game-area-2",
  hard: "game-area-3"
};
/*Game State Variables (Global)
Why these exist:
- The game needs to remember what’s happening between clicks.
- These variables track the current round: which cards are selected, whether clicking is allowed,
how many moves/matches the player has, and how long the timer has been running.
Key idea:
- startGame() resets these values at the beginning of every new round.
- flipCard(), checkMatch(), and the timer functions update them during gameplay.
*/

/* First clicked card DOM element (stored for matching). */
var firstCard = null;

/* Second clicked card DOM element (stored for matching). */
var secondCard = null;

/* Click-lock: false prevents extra clicks while checking a pair. */
var canFlip = true;

/* Number of matched pairs found so far. */
var matches = 0;

/* Number of pair-attempts made (increments on 2nd card flip). */
var moves = 0;

/* Elapsed time in seconds since first card click. */
var seconds = 0;

/* True once timer has started (prevents multiple intervals). */
var timerRunning = false;

/* setInterval ID so we can stop timer with clearInterval(). */
var timerInterval = null;

/* Total pairs required to win for current difficulty (4/6/8). */
var totalPairs = 0;
/* Returns the currently selected difficulty level ("easy", "medium", or "hard"). in case of an error it automatically defaults to "easy" */
function getSelectedDifficulty() {
  var checked = document.querySelector('input[name="difficulty"]:checked');
  return checked ? checked.id : "easy";
}

/*
Match That Card! — Main Game Logic (script.js)
What this file does:
- Reads selected difficulty (easy/medium/hard) from radio buttons.
- Builds a deck from the correct image folder (pairs + shuffle).
- Renders cards dynamically into #gameBoard.
- Handles mouse-click flips, match checking, move count, and timer.
- Shows the Bootstrap win modal when all pairs are matched.
*/

function shuffleInPlace(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // 0..i
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
