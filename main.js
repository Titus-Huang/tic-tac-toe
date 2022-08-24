// Project 1 = The Game
// Due: Friday the 26th of August, 2022
// Source: https://gist.git.generalassemb.ly/kasun/6c594180b30ee78feb3ff42547f4afea

// Player data
// "Player one" has their turn on "even" numbers
// "Player two" has their turn on "odd" numbers

var turnNumber = 0;


// Makes the squares "clickable"
// Unsure if should be using buttons or divs, going to go with divs for now
var playableSquares = document.querySelectorAll(".square");

function placeDownSymbol(domLocation, symbolToPlace) {
    if (domLocation.tagName === "DIV") {
        domLocation.querySelector("p").textContent = symbolToPlace;
    } else if (domLocation.tagName === "P") {
        domLocation.textContent = symbolToPlace;
    }
}

function checkIfSymbolIsPlaced(domLocation) {
    if (domLocation.tagName === "DIV") {
        return domLocation.querySelector("p").textContent !== "";
    } else if (domLocation.tagName === "P") {
        return domLocation.textContent !== "";
    }

    // always default to false, you never KNOW!!!
    return false;
}

for (var i = 0; i < playableSquares.length; i++) {
    playableSquares[i].addEventListener("click", function(event) {
        if (turnNumber > 8 || checkIfSymbolIsPlaced(event.target)) {
            // Will not allow anyone to place down any more symbols
            // Also will not allow players to place down symbols if there is already one in the box
            return;
        }

        if (turnNumber % 2 === 0 || turnNumber === 0) {
            placeDownSymbol(event.target, "O");
        } else if (turnNumber % 2 === 1) {
            placeDownSymbol(event.target, "X");
        }

        // Player has finished their move, time to increment the turn number
        turnNumber++;

        // alerts the player that the game is finished
        if (turnNumber > 8) {
            console.log("The game is finished");
            // temporary debug "announcement" when game is "finished"
            document.querySelector("#game-announcement").textContent = "game is finished";
        }
    })
}