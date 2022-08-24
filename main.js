// Project 1 = The Game
// Due: Friday the 26th of August, 2022
// Source: https://gist.git.generalassemb.ly/kasun/6c594180b30ee78feb3ff42547f4afea

// Player data
// "Player one" has their turn on "even" numbers
// "Player two" has their turn on "odd" numbers

var turnNumber = 0;
var player1Symbol = "O";
var player1SymbolsPlacement = [];
var player2Symbol = "X";
var player2SymbolsPlacement = [];


// Makes the squares "clickable"
// Unsure if should be using buttons or divs, going to go with divs for now
var clickableArea = document.querySelector(".core-game");
var squares = document.querySelectorAll(".square");

clickableArea.addEventListener("click", function(event) {
    if (turnNumber > 8 || checkIfSymbolIsPlaced(event.target)) {
        // Will not allow anyone to place down any more symbols once all boxes are filled
        // Also will not allow players to place down symbols if there is already one within the box
        return;
    }

    // calculates which player's term is it based on the odd or evens
    if (turnNumber % 2 === 0 || turnNumber === 0) {
        placeDownSymbol(event.target, player1Symbol); // Player 1's turn
    } else if (turnNumber % 2 === 1) {
        placeDownSymbol(event.target, player2Symbol); // Player 2's turn
    }

    // Player has finished their move, time to increment the turn number
    turnNumber++;

    // check the win state after every symbol placement
    checkWinState();

    // alerts the player that the game has finished as all turns has been used up
    if (turnNumber > 8) {
        console.log("The game is finished");
        // temporary debug "announcement" when game is "finished"
        document.querySelector("#game-announcement").textContent = "All turns are used up, the game is finished";
    }
})

// function that places down the symbol by the player
function placeDownSymbol(domLocation, symbolToPlace) {
    // Starts off with -1 so it's invalid unless chosen
    var clickedIndexLocation = -1;

    if (domLocation.tagName === "DIV" && domLocation.className === "square") {
        domLocation.querySelector("p").textContent = symbolToPlace;
    } else if (domLocation.tagName === "P") {
        domLocation.textContent = symbolToPlace;
    } else {
        return;
    }

    // loops through the existing squares to find what is the index number of the square that was chosen
    for (var i = 0; i < squares.length; i++) {
        if (squares[i] === domLocation) {
            clickedIndexLocation = i;
        } else if (squares[i] === domLocation.parentSrc) {
            clickedIndexLocation = i;
        }
    }

    // pushes the appropriate box index to the appropriate player once the index has been found
    var isPlayer1 = (symbolToPlace === player1Symbol);
    if (isPlayer1) {
        player1SymbolsPlacement.push(clickedIndexLocation);
        console.log(`Player 1 symbol placement: ${player1SymbolsPlacement}`);
    } else {
        player2SymbolsPlacement.push(clickedIndexLocation);
        console.log(`Player 2 symbol placement: ${player2SymbolsPlacement}`);
    }
}

function checkIfSymbolIsPlaced(domLocation) {
    if (domLocation.tagName === "DIV" && domLocation.className === "square") {
        return domLocation.querySelector("p").textContent !== "";
    } else if (domLocation.tagName === "P") {
        return domLocation.textContent !== "";
    }

    // always default to false, you never KNOW!!!
    return false;
}

// Check win state
// There are a total of... 8 win states within Tic Tac Toe
// It would be a simple-ish check for if players have placed down enough of symbols to win

// Layout of each square and their respective indexes within the above array "squares"
// [0] [3] [6] 
// [1] [4] [7]
// [2] [5] [8]

// Win 1 - 0, 3, 6
// Win 2 - 1, 4, 7
// Win 3 - 2, 5, 8
// Win 4 - 0, 1, 2
// Win 5 - 3, 4, 5
// Win 6 - 6, 7, 8
// Win 7 - 0, 4, 8
// Win 8 - 2, 4, 6

// Is there a way to simplfy the checks using numerical methods?
// No
// Start the test with if statement to see if it works first, one "win statement at a time". Horizontal, then vertical, and then diagonal
// Then also give the switch statements a try! See if it is simpler or cleaner AND more readble to look at

function checkWinState(){
    var allSelections = {player1SymbolsPlacement, player2SymbolsPlacement};

    if (isBoxTicked(player1SymbolsPlacement, 0) && 
    isBoxTicked(player1SymbolsPlacement, 3) && 
    isBoxTicked(player1SymbolsPlacement, 6)) {
        console.log("player 1 won via Win 1");
    } else if (isBoxTicked(player1SymbolsPlacement, 1) && 
    isBoxTicked(player1SymbolsPlacement, 4) && 
    isBoxTicked(player1SymbolsPlacement, 7)) {
        console.log("player 1 won via Win 2");
    }
}

function isBoxTicked(boxes, index) {
    return boxes.indexOf(index) !== -1;
}