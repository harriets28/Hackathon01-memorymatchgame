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
    novice: {
        cardCount: 4, // 2 pairs
        assets: [
            {
                key: "novice_1",
                src: "assets/images/game0-vegetable/broccoli.png",
                alt: "Broccoli",
            },
            {
                key: "novice_2",
                src: "assets/images/game0-vegetable/carrot.png",
                alt: "Carrot",
            },
        ],
    },

    easy: {
        cardCount: 8, // 4 pairs
        assets: [
            {
                key: "fruit_banana",
                src: "assets/images/game1-fruit/banana.png",
                alt: "Banana",
            },
            {
                key: "fruit_kiwi",
                src: "assets/images/game1-fruit/kiwi.png",
                alt: "Kiwi",
            },
            {
                key: "fruit_orange",
                src: "assets/images/game1-fruit/orange.png",
                alt: "Orange",
            },
            {
                key: "fruit_strawberry",
                src: "assets/images/game1-fruit/strawberry.png",
                alt: "Strawberry",
            },
        ],
    },

    medium: {
        cardCount: 12, // 6 pairs
        assets: [
            {
                key: "person_1",
                src: "assets/images/game2-people/person1.png",
                alt: "Person 1",
            },
            {
                key: "person_2",
                src: "assets/images/game2-people/person2.png",
                alt: "Person 2",
            },
            {
                key: "person_3",
                src: "assets/images/game2-people/person3.png",
                alt: "Person 3",
            },
            {
                key: "person_4",
                src: "assets/images/game2-people/person4.png",
                alt: "Person 4",
            },
            {
                key: "person_5",
                src: "assets/images/game2-people/person5.png",
                alt: "Person 5",
            },
            {
                key: "person_6",
                src: "assets/images/game2-people/person6.png",
                alt: "Person 6",
            },
        ],
    },

    hard: {
        cardCount: 16, // 8 pairs
        assets: [
            {
                key: "cat_1",
                src: "assets/images/game3-catsdogs/cat1.png",
                alt: "Cat 1",
            },
            {
                key: "cat_2",
                src: "assets/images/game3-catsdogs/cat2.png",
                alt: "Cat 2",
            },
            {
                key: "cat_3",
                src: "assets/images/game3-catsdogs/cat3.png",
                alt: "Cat 3",
            },
            {
                key: "cat_4",
                src: "assets/images/game3-catsdogs/cat4.png",
                alt: "Cat 4",
            },
            {
                key: "dog_1",
                src: "assets/images/game3-catsdogs/dog1.png",
                alt: "Dog 1",
            },
            {
                key: "dog_2",
                src: "assets/images/game3-catsdogs/dog2.png",
                alt: "Dog 2",
            },
            {
                key: "dog_3",
                src: "assets/images/game3-catsdogs/dog3.png",
                alt: "Dog 3",
            },
            {
                key: "dog_4",
                src: "assets/images/game3-catsdogs/dog4.png",
                alt: "Dog 4",
            },
        ],
    },

    impossible: {
        cardCount: 20, // 10 pairs
        assets: [
            {
                key: "impossible_1",
                src: "assets/images/game4-flower/daffodil.png",
                alt: "Daffodil",
            },
            {
                key: "impossible_2",
                src: "assets/images/game4-flower/dahlia.png",
                alt: "Dahlia",
            },
            {
                key: "impossible_3",
                src: "assets/images/game4-flower/daisy.png",
                alt: "Daisy",
            },
            {
                key: "impossible_4",
                src: "assets/images/game4-flower/gardenia.png",
                alt: "Gardenia",
            },
            {
                key: "impossible_5",
                src: "assets/images/game4-flower/lilyofthevalley.png",
                alt: "Lily of the Valley",
            },
            {
                key: "impossible_6",
                src: "assets/images/game4-flower/pansy.png",
                alt: "Pansy",
            },
            {
                key: "impossible_7",
                src: "assets/images/game4-flower/poppy.png",
                alt: "Poppy",
            },
            {
                key: "impossible_8",
                src: "assets/images/game4-flower/rose.png",
                alt: "Rose",
            },
            {
                key: "impossible_9",
                src: "assets/images/game4-flower/sunflower.png",
                alt: "Sunflower",
            },
            {
                key: "impossible_10",
                src: "assets/images/game4-flower/tulip.png",
                alt: "Tulip",
            },
        ],
    },
};

/* Back-of-card image shown before flip (placeholder image). */
var BACK_IMAGE_SRC = "assets/favicons/freepikmini64.png";

/* Map difficulty -> which static board section to show */
var BOARD_BY_DIFFICULTY = {
    novice: "game-area-0",
    easy: "game-area-1",
    medium: "game-area-2",
    hard: "game-area-3",
    impossible: "game-area-4",
};

/**/
var FLIP_ANIM_MS = 400;

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

/* Shuffle array in place using Fisher–Yates (uniform random shuffle). */

function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(
            Math.random() * (i + 1),
        ); /* pick random index from 0..i */
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr; /* returns the same array reference, now shuffled */
}

/*setTextById(id, value)
Find element by ID and set its visible text content.
Safe no-op if the element is not found (prevents runtime errors when element is missing).*/
function setTextById(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
}
// updateStats()
// Update on-screen match/move/time stats.
// - Writes `matches` to #matchesValue
// - Writes formatted time (MM:SS) to #timeValue  <-- recommended improvement
// - Writes `moves` to #movesValue
function updateStats() {
    setTextById("matchesValue", String(matches));
    setTextById("timeValue", String(seconds));
    setTextById("movesValue", String(moves));
}

/*Timer control. counts how long the player takes to finish the game, Timer will start on the first card click 
(so there's no idle time being counted before the player is ready to start) */
function startTimer() {
    timerRunning = true;

    timerInterval = setInterval(function () {
        seconds++;
        updateStats();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/* Board switching (static HTML)
-Hides all boards with Bootstrap `d-none`, then shows the board that matches
-the selected difficulty (easy/medium/hard). Also provides a helper to get
-all `.card` elements inside the active board. */
function hideAllBoards() {
    var b0 = document.getElementById("game-area-0");
    var b1 = document.getElementById("game-area-1");
    var b2 = document.getElementById("game-area-2");
    var b3 = document.getElementById("game-area-3");
    var b4 = document.getElementById("game-area-4");

    if (b0) b0.classList.add("d-none");
    if (b1) b1.classList.add("d-none");
    if (b2) b2.classList.add("d-none");
    if (b3) b3.classList.add("d-none");
    if (b4) b4.classList.add("d-none");
}

function showBoardForDifficulty(diff) {
    hideAllBoards();
    var boardId = BOARD_BY_DIFFICULTY[diff] || "game-area-1";
    var board = document.getElementById(boardId);
    if (board) board.classList.remove("d-none");
    return board;
}

function getCardsInBoard(boardEl) {
    if (!boardEl) return [];
    return Array.prototype.slice.call(boardEl.querySelectorAll(".card"));
}

/* Card flip helpers (IMG-based)
Our CSS applies flip/match styles on the <img>, not the .card div.
These helpers swap the image between BACK_IMAGE_SRC and the dealt front image,
and toggle `.flipping` / `.front` classes to trigger the CSS animation. */
function getImg(cardEl) {
    return cardEl ? cardEl.querySelector("img") : null;
}

function setCardBack(cardEl) {
    var img = getImg(cardEl);
    if (!img) return;

    img.src = BACK_IMAGE_SRC;
    img.classList.remove("front");
    img.classList.remove("flipping");
}

function setCardFront(cardEl) {
    var img = getImg(cardEl);
    if (!img) return;

    img.src = cardEl.dataset.image;
    img.alt = cardEl.dataset.alt || img.alt;
    img.classList.add("front");
}

function flipToFront(cardEl) {
    var img = getImg(cardEl);
    if (!img) return;

    img.classList.add("flipping");
    setTimeout(function () {
        setCardFront(cardEl);
    }, 60);
    setTimeout(function () {
        img.classList.remove("flipping");
    }, FLIP_ANIM_MS);
}

function flipToBack(cardEl) {
    var img = getImg(cardEl);
    if (!img) return;

    img.classList.add("flipping");
    setTimeout(function () {
        setCardBack(cardEl);
    }, 60);
    setTimeout(function () {
        img.classList.remove("flipping");
    }, FLIP_ANIM_MS);
}

/* This function pics the correct difficulty , chooses the required number of images as well as duplicating them. It also shuffles the final deck
and then returns them*/
function buildDeckForDifficulty(diff) {
    var cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.easy;

    totalPairs = cfg.cardCount / 2;

    var pool = cfg.assets.slice();
    shuffleInPlace(pool);

    var chosen = pool.slice(0, totalPairs);

    var deck = [];
    for (var i = 0; i < chosen.length; i++) {
        deck.push(chosen[i]);
        deck.push(chosen[i]);
    }

    shuffleInPlace(deck);
    return deck;
}

/*Deal deck into the static HTML cards
Saves each card’s identity in dataset (key/src/alt),
then resets the <img> to the BACK image and clears old state
(.front/.matched/.flipping) ready for a new round. */

function assignDeckToStaticCards(deck, cards) {
    var count = Math.min(deck.length, cards.length);

    for (var i = 0; i < count; i++) {
        var asset = deck[i];
        var cardEl = cards[i];
        var img = getImg(cardEl);

        cardEl.dataset.key = asset.key;
        cardEl.dataset.image = asset.src;
        cardEl.dataset.alt = asset.alt;

        cardEl.classList.remove("flipped");

        if (img) {
            img.classList.remove("matched");
            img.classList.remove("front");
            img.classList.remove("flipping");
            img.alt = asset.alt;
            img.src = BACK_IMAGE_SRC;
        }
    }
}

/*startGame()
-Resets the round and sets up the chosen difficulty:
-reads selected radio (easy/medium/hard)
-shows the correct static board
-builds + shuffles the deck, then deals it into the existing card slots
-resets state (moves/matches/selected cards) and restarts timer/stats */
function startGame() {
    var diff = getSelectedDifficulty();

    var board = showBoardForDifficulty(diff);
    var cards = getCardsInBoard(board);

    var cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.easy;
    if (cards.length !== cfg.cardCount) {
        console.warn(
            "Card count mismatch for " +
                diff +
                ": HTML has " +
                cards.length +
                " cards but config expects " +
                cfg.cardCount +
                ".",
        );
    }

    var deck = buildDeckForDifficulty(diff);
    assignDeckToStaticCards(deck, cards);

    // Initial reveal: show all card fronts for 3 seconds, then flip back and allow play.
    // Block user clicks while we reveal the board so they can't start early.
    canFlip = false;
    if (cards && cards.length > 0) {
        for (var i = 0; i < cards.length; i++) {
            flipToFront(cards[i]);
        }
        setTimeout(function () {
            for (var j = 0; j < cards.length; j++) {
                flipToBack(cards[j]);
            }
            canFlip = true;
        }, 3000);
    } else {
        canFlip = true;
    }

    firstCard = null;
    secondCard = null;

    matches = 0;
    moves = 0;

    seconds = 0;
    timerRunning = false;

    stopTimer();
    updateStats();
}

/*Card click handler:
Blocks clicks while checking a pair or on already revealed/matched cards
Starts the timer on the first flip only
Flips the card (shows front image)
Stores first + second selection, increments moves, then calls checkMatch() */

function handleCardClick(cardEl) {
    if (!canFlip) return;

    var img = getImg(cardEl);
    if (!img) return;

    /* Block clicking already revealed or matched cards */
    if (img.classList.contains("front")) return;
    if (img.classList.contains("matched")) return;

    /* Start timer on the very first flip of the round */
    if (!timerRunning) startTimer();

    /* Flip card to show the front image */
    cardEl.classList.add("flipped");
    flipToFront(cardEl);

    /* If this is the first card of the pair, store it and wait */
    if (firstCard === null) {
        firstCard = cardEl;
        return;
    }

    /* Otherwise this is the second card of the pair */
    secondCard = cardEl;
    canFlip = false;

    moves++;
    updateStats();
    checkMatch();
}
/* STEP 14: Match checking
Compares the 2 selected cards (dataset.key).
If match: mark img as .matched, increment matches, check win.
If not: flip both cards back after a short delay.
Always resets selection + unlocks clicking for the next turn. */
function checkMatch() {
    /* Compare identity (key is safest; src also works). */
    var isMatch = firstCard.dataset.key === secondCard.dataset.key;

    if (isMatch) {
        setTimeout(function () {
            var img1 = getImg(firstCard);
            var img2 = getImg(secondCard);

            /* Mark the IMG as matched so your CSS pink border/glow applies */
            if (img1) img1.classList.add("matched");
            if (img2) img2.classList.add("matched");

            matches++;
            updateStats();
            resetCards();

            /* Win condition */
            if (matches === totalPairs) {
                endGame();
            }
        }, 250);
    } else {
        setTimeout(function () {
            /* Flip both back to the placeholder image */
            flipToBack(firstCard);
            flipToBack(secondCard);

            resetCards();
        }, 700);
    }
}

function resetCards() {
    firstCard = null;
    secondCard = null;
    canFlip = true;
}

/* End game + modal
Stops the timer, writes final stats into the Bootstrap modal spans
(#matchesValue, #timeValue, #movesValue), then shows #staticBackdrop. */

function endGame() {
    stopTimer();

    /* Write final stats into the modal spans (your HTML uses these IDs) */
    var matchesEl = document.getElementById("matchesValue");
    var timeEl = document.getElementById("timeValue");
    var movesEl = document.getElementById("movesValue");

    if (matchesEl) matchesEl.textContent = String(matches);
    if (timeEl) timeEl.textContent = String(seconds);
    if (movesEl) movesEl.textContent = String(moves);

    /* Show Bootstrap modal */
    var modalEl = document.getElementById("staticBackdrop");
    if (modalEl && window.bootstrap) {
        var modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
            backdrop: "static",
        });
        modal.show();
    }
}

function newGame() {
    /* Hide the modal if it is open */
    var modalEl = document.getElementById("staticBackdrop");
    if (modalEl && window.bootstrap) {
        var modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
            backdrop: "static",
        });
        modal.hide();
    }

    startGame();
}

document.addEventListener("DOMContentLoaded", function () {
    /* Restart button: starts a fresh round on the currently selected difficulty */
    var restartBtn = document.getElementById("restart");
    if (restartBtn) {
        restartBtn.addEventListener("click", startGame);
    }

    /* Difficulty radios: changing difficulty re-deals and shows the correct board */
    var radios = document.querySelectorAll('input[name="difficulty"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", startGame);
    }

    /* Modal "Play again" button: hide modal (if open) + start a new round */
    var playAgainBtn = document.querySelector(".play-again");
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", newGame);
    }

    /* Attach click listeners to ALL static cards across all boards */
    var allCards = document.querySelectorAll(
        "#game-area-0 .card, #game-area-1 .card, #game-area-2 .card, #game-area-3 .card, #game-area-4 .card",
    );

    for (var c = 0; c < allCards.length; c++) {
        (function (cardEl) {
            cardEl.addEventListener("click", function () {
                handleCardClick(cardEl);
            });
        })(allCards[c]);
    }

    /* Start first round immediately (easy is checked by default in your HTML) */
    startGame();
});
