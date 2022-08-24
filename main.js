// Project 1 = The Game
// Due: Friday the 26th of August, 2022
// Source: https://gist.git.generalassemb.ly/kasun/6c594180b30ee78feb3ff42547f4afea

// Makes the squares "clickable"
// Unsure if should be using buttons or divs, going to go with divs for now
var playableSquares = document.querySelectorAll(".square");

for (var i = 0; i < playableSquares.length; i++) {
    playableSquares[i].addEventListener("click", function(event) {
        event.target.querySelector("p").textContent = "X";
    })
}