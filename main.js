// Project 1 = The Game
// Due: Friday the 26th of August, 2022
// Source: https://gist.git.generalassemb.ly/kasun/6c594180b30ee78feb3ff42547f4afea

// Player data
// "Player one" has their turn on "even" numbers
// "Player two" has their turn on "odd" numbers

var turnCount = 0;
var gameCount = 0;
var secondsPerTurn = 10;

var isGameSquaresActive = true;
var hasGameFinished = false;

var player1Name = "Player 1";
var player1Symbol = "O";
var player1SymbolsPlacement = [];
var player1Score = 0;
var player1ScoreUI = document.querySelector("#ui-player-1-score");
var player1TurnIndicatorUI = document.querySelector("#ui-player-1-turn-indicator");

var player2Name = "Player 2";
var player2Symbol = "X";
var player2SymbolsPlacement = [];
var player2Score = 0;
var player2ScoreUI = document.querySelector("#ui-player-2-score");
var player2TurnIndicatorUI = document.querySelector("#ui-player-2-turn-indicator");

var playerWonLastGame = [];

// Makes the squares "clickable"
// Unsure if should be using buttons or divs, going to go with divs for now
var clickableArea = document.querySelector(".core-game");
var squares = document.querySelectorAll(".square");
var uiRoundCountTracker = document.querySelector("#ui-round-count-tracker");
var uiTurnTracker = document.querySelector("#ui-turn-tracker");
var uiGameAnnouncement = document.querySelector("#ui-game-announcement");

var maxTurns = squares.length - 1;




// the main "update cycle" of the website
clickableArea.addEventListener("click", function(event) {
    if (turnCount > maxTurns || checkIfSymbolIsPlaced(event.target) ||
    hasGameFinished === true || isGameSquaresActive === false) {
        // Will not allow anyone to place down any more symbols once all boxes are filled
        // Also will not allow players to place down symbols if there is already one within the box
        // If the game is not active, no buttons can be clicked
        return;
    }
    
    // calculates which player's term is it based on the odd or evens
    if (turnCount % 2 === 0 || turnCount === 0) {
        console.log("player 1 placed");
        placeDownSymbol(event.target, player1Symbol, true); // Player 1's turn

        // check the win state on move 4
        if (turnCount > 3) {
            checkWinState(true);
        }

        if (hasGameFinished === false) {
            player1TurnIndicatorUI.textContent = "";
            player2TurnIndicatorUI.textContent = "current turn";
        }
    } else if (turnCount % 2 === 1) {
        console.log("player 2 placed");
        placeDownSymbol(event.target, player2Symbol, false); // Player 2's turn

        // check the win state on move 4
        if (turnCount > 3) {
            checkWinState(false);
        }

        if (hasGameFinished === false) {
            player1TurnIndicatorUI.textContent = "current turn";
            player2TurnIndicatorUI.textContent = "";
        }
    }

    // alerts the player that the game has finished as all turns has been used up
    if (turnCount >= maxTurns || hasGameFinished === true) {

        console.log("The game is finished");

        // game count increments
        gameCount++;

        // no one won the last game, so it was a draw!
        if (hasGameFinished !== true) {
            hasGameFinished = true;
            isGameSquaresActive = false;

            playerWonLastGame.push("");

            // Rules for me are, if it is a draw. Both players get the points
            if (turnCount >= maxTurns) {
                uiGameAnnouncement.textContent = "All turns are used up, the result is a DRAW";

                player1Score++;
                player1ScoreUI.textContent = player1Score;
                player2Score++;
                player2ScoreUI.textContent = player2Score;
            }
        } else {
            // temporary debug "announcement" when game is "finished"
            uiGameAnnouncement.textContent = playerWonLastGame[playerWonLastGame.length - 1] + " won the game in " + (turnCount + 1) + " moves, game is now finished.";
        }

        // now that everything above is complete, able to continue
        if (continueButton.disabled === true) {
            continueButton.disabled = false;
        }
    } else {
        // Increment the turn number and update the UI as the game is progressing
        turnCount++;
    }

    // Enable Restart button when turn 1 has finished playing
    if (turnCount > 0 && restartButton.disabled === true) {
        restartButton.disabled = false;
    }

    // Once the turn count has been updated, update it in the browser
    uiTurnTracker.textContent = (turnCount + 1);
})

// function that places down the symbol by the player
function placeDownSymbol(domLocation, symbolToPlace, isPlayer1) {
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
    if (isPlayer1) {
        player1SymbolsPlacement.push(clickedIndexLocation);
        player1SymbolsPlacement.sort();
        //console.log(`Player 1 symbol placement: ${player1SymbolsPlacement}`);
    } else {
        player2SymbolsPlacement.push(clickedIndexLocation);
        player2SymbolsPlacement.sort();
        //console.log(`Player 2 symbol placement: ${player2SymbolsPlacement}`);
    }
}

// grab location of if there is a symbol placed already
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
var win1Condition = [0, 3, 6]
var win2Condition = [1, 4, 7]
var win3Condition = [2, 5, 8]
var win4Condition = [0, 1, 2]
var win5Condition = [3, 4, 5]
var win6Condition = [6, 7, 8]
var win7Condition = [0, 4, 8]
var win8Condition = [2, 4, 6]
var allWinConditions = [win1Condition, win2Condition, win3Condition, win4Condition, win5Condition, win6Condition, win7Condition, win8Condition];

// Is there a way to simplfy the checks using numerical methods?
// No
// Start the test with if statement to see if it works first, one "win statement at a time". Horizontal, then vertical, and then diagonal
// Then also give the switch statements a try! See if it is simpler or cleaner AND more readble to look at

function checkWinState(isPlayer1) {
    var winConditionMatch = [];
    var winConditionAmount = 0;
    var symbolsPlacementCheck = isPlayer1 ? player1SymbolsPlacement : player2SymbolsPlacement;
    var playerNameToDisplay = isPlayer1 ? "Player 1" : "Player 2";

    for (var i = 0; i < allWinConditions.length; i++) {
        winConditionAmount = 0;
        for (var j = 0; j < allWinConditions[i].length; j++) {
            if (symbolsPlacementCheck.indexOf(allWinConditions[i][j]) !== -1) {
                //console.log(`Win ${i + 1} with box ${allWinConditions[i][j]}`);
                winConditionAmount++;
            }

            if (winConditionAmount === 3) {
                //console.log(allWinConditions[i]);
                winConditionMatch = allWinConditions[i];
                hasGameFinished = true;
            }
        }
    }

    //console.log(`Win Conditions set: ${winConditionMatch}`);
    //console.log(winConditionMatch);

    switch (winConditionMatch) {
        case win1Condition:
            console.log(`${playerNameToDisplay} won via Win 1`);
            break;
        case win2Condition:
            console.log(`${playerNameToDisplay} won via Win 2`);
            break;
        case win3Condition:
            console.log(`${playerNameToDisplay} won via Win 3`);
            break;
        case win4Condition:
            console.log(`${playerNameToDisplay} won via Win 4`);
            break;
        case win5Condition:
            console.log(`${playerNameToDisplay} won via Win 5`);
            break;
        case win6Condition:
            console.log(`${playerNameToDisplay} won via Win 6`);
            break;
        case win7Condition:
            console.log(`${playerNameToDisplay} won via Win 7`);
            break;
        case win8Condition:
            console.log(`${playerNameToDisplay} won via Win 8`);
            break;
        default:
            // this means that no one won yet
            break;
    }

    //console.log(winConditionMatch !== []);
    // console.log(winConditionMatch);

    // this will run if a win condition was matched
    if (hasGameFinished === true) {
        //console.log(`It should not be null: ${winConditionMatch}`);

        if (isPlayer1) {
            player1Score++;
            player1ScoreUI.textContent = player1Score;
            playerWonLastGame.push(player1Name);
        } else {
            player2Score++;
            player2ScoreUI.textContent = player2Score;
            playerWonLastGame.push(player2Name);
        }
    }
}



// Restart button

var restartButton = document.querySelector("#ui-game-restart-button");
var continueButton = document.querySelector("#ui-game-continue-button");

// restart the current game
restartButton.addEventListener("click", function (event) {
    // restart button can only be pressed after the first turn
    if (turnCount === 0 && gameCount === 0) {
        return;
    }

    // Make sure the button is not clickable first
    isGameSquaresActive = false;

    // Reset game variables
    turnCount = 0;
    gameCount = 0;
    player1Score = 0;
    player1SymbolsPlacement = [];
    player2Score = 0;
    player2SymbolsPlacement = [];
    playerWonLastGame = [];

    // Reset the squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].querySelector("p").textContent = "";
    }

    // Reset the UI
    player1TurnIndicatorUI.textContent = "current turn";
    player1ScoreUI.textContent = player1Score;
    player2TurnIndicatorUI.textContent = "";
    player2ScoreUI.textContent = player2Score;
    uiRoundCountTracker.textContent = (gameCount + 1);
    uiTurnTracker.textContent = (turnCount + 1);
    uiGameAnnouncement.textContent = "";

    // Now that the process is completed, can resume the game
    isGameSquaresActive = true;
    continueButton.disabled = true;
    restartButton.disabled = true;
})

// continue the match
continueButton.addEventListener("click", function (event) {
    // only can continue if the match is finished
    if (hasGameFinished === false) {
        return;
    }

    // Make sure the button is not clickable first
    isGameSquaresActive = false;

    // Restart game variables
    turnCount = 0;
    player1SymbolsPlacement = [];
    player2SymbolsPlacement = [];

    // Reset the squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].querySelector("p").textContent = "";
    }

    // Reset the UI
    player1TurnIndicatorUI.textContent = "current turn";
    player2TurnIndicatorUI.textContent = "";
    uiRoundCountTracker.textContent = (gameCount + 1);
    uiTurnTracker.textContent = (turnCount + 1);
    uiGameAnnouncement.textContent = "";

    // Now that the process is completed, can resume the game
    isGameSquaresActive = true;
    hasGameFinished = false;
    continueButton.disabled = true;
    restartButton.disabled = (gameCount > 0) ? false : true;
})




// UI/UX navigation

// UI level state
// 00 - Game
// 10 - Menu (default "User settings")
// 11 - Menu ("Game settings")
// 12 - Menu ("Import/Export")
// allows up to 19 encoded for game menus
// 20 - About? (future)

var uiState = 00;

// checks which menu is open and sets the uiState
// 00 - #game-board
// 10 - #game-settings
// very simple check for which menu is being worked on atm
var sections = document.querySelectorAll("section");

var uiMenuGameButton = document.querySelector("#nav-btn-game");
var uiMenuSettingsButton = document.querySelector("#nav-btn-settings");

// Settings menu
var uiMenuSettingsUser = document.querySelector("#settings-user");
var uiMenuSettingsGame = document.querySelector("#settings-game");
var uiMenuSettingsImportExport = document.querySelector("#settings-import-export");

var uiMenuSettingsSections = [
    uiMenuSettingsUser,
    uiMenuSettingsGame,
    uiMenuSettingsImportExport
];


updateUIState();


// Opens Game
uiMenuGameButton.addEventListener("click", function (event) {
    if (uiState === 0) {
        // already in game, no need to "go to game"
        //console.log("Game menu button press being ignored");
        return;
    }
    // console.log("Game menu button pressed");

    sections[0].hidden = sections[1].hidden;
    sections[1].hidden = !sections[0].hidden;

    updateUIState();
})

// Opens Settings
uiMenuSettingsButton.addEventListener("click", function (event) {
    if ((uiState - 10) >= 0 && (uiState - 10) < 10) {
        // already in settings, no need to "go to settings"
        //console.log("Settings menu button press being ignored");
        return;
    }
    //console.log("Settings menu button pressed");

    // Make sure the user settings are opened
    uiMenuSettingsSections[0].hidden = false;
    uiMenuSettingsSections[1].hidden = true;
    uiMenuSettingsSections[2].hidden = true;

    sections[0].hidden = sections[1].hidden;
    sections[1].hidden = !sections[0].hidden;

    updateUIState();
})

function updateUIState() {
    uiState = (sections[0].hidden === true) ? 10 : 00;

    if (uiState >= 10) {
        // set this to 9, so if it is 9 afterwards. It means during development, ALL sections were disabled.
        // to prevent an empty screen from showing up, make sure at least the uiState of 10 is achieved.
        uiState = uiState - 1;
        for (var i = 0; i < uiMenuSettingsSections.length; i++) {
            if (uiMenuSettingsSections[i].hidden === false) {
                uiState = uiState + i;
            }
        }

        if (uiState === 9) {
            uiMenuSettingsSections[0].hidden = false;
            uiMenuSettingsSections[1].hidden = true;
            uiMenuSettingsSections[2].hidden = true;

            uiState = 10;
        }
    }
}

// uiState = 10
var uiMenuSettingsUserButton = document.querySelectorAll(".settings-menu-sidebar>ul>li")[0];
// uiState = 11
var uiMenuSettingsGameButton = document.querySelectorAll(".settings-menu-sidebar>ul>li")[1];
// uiState = 12
var uiMenuSettingsImportExportButton = document.querySelectorAll(".settings-menu-sidebar>ul>li")[2];

uiMenuSettingsUserButton.addEventListener("click", function (event) {
    if (uiState === 10) {
        return;
    }

    uiMenuSettingsSections[0].hidden = false;
    uiMenuSettingsSections[1].hidden = true;
    uiMenuSettingsSections[2].hidden = true;

    uiState = 10;
})

uiMenuSettingsGameButton.addEventListener("click", function (event) {
    if (uiState === 11) {
        return;
    }

    uiMenuSettingsSections[0].hidden = true;
    uiMenuSettingsSections[1].hidden = false;
    uiMenuSettingsSections[2].hidden = true;

    uiState = 11;
})

uiMenuSettingsImportExportButton.addEventListener("click", function (event) {
    if (uiState === 12) {
        return;
    }

    uiMenuSettingsSections[0].hidden = true;
    uiMenuSettingsSections[1].hidden = true;
    uiMenuSettingsSections[2].hidden = false;

    uiState = 12;
})