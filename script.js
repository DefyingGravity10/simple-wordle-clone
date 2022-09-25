"use strict";
const url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
let numberOfGuesses = 0;
let wordToGuess = "";
function startingConfig() {
    const div = document.getElementById("start-div");
    if (div !== null) {
        const textBox = document.createElement("input");
        textBox.classList.add("text-input");
        const submitButton = document.createElement("button");
        submitButton.classList.add("submit-btn");
        submitButton.textContent = "Submit";
        div.replaceChildren(textBox, submitButton);
        submitButton.addEventListener("click", () => {
            if (textBox.value === "") {
                alert("You placed an invalid input, please try again.");
            }
            else {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onload = function () {
                    const arr = xhr.responseText.split('\n');
                    const randomNumber = Math.floor(Math.random() * arr.length);
                    wordToGuess = arr[randomNumber];
                    setMainScreen(wordToGuess);
                };
                xhr.send();
            }
        });
    }
}
function setMainScreen(wordToGuess) {
    const div = document.getElementById("start-div");
    if (div !== null) {
        //Create new screen
        const userGuess = document.createElement("input");
        userGuess.classList.add("user-guess");
        const letterDict = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
            "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
            "u", "v", "w", "x", "y", "z"];
        const letterContainer = document.createElement("div");
        letterContainer.classList.add("container");
        for (let i = 0; i < 26; i++) {
            const letter = document.createElement("span");
            letter.classList.add("letter");
            letter.textContent = letterDict[i];
            letterContainer.appendChild(letter);
        }
        div.replaceChildren(userGuess, letterContainer);
        //Obtain user guesses
        userGuess.addEventListener("keydown", verifyGuess);
    }
}
function verifyGuess(e) {
    const div = document.getElementById("start-div");
    const userGuess = document.getElementsByTagName("input").item(0);
    if (e.key === "Enter" && userGuess !== null && div !== null) {
        if (userGuess.value.length !== 5) {
            alert("The input box should have exactly 5 characters!");
        }
        else {
            const newGuess = document.createElement("p");
            newGuess.textContent = userGuess.value;
            div.appendChild(newGuess);
            numberOfGuesses += 1;
            if (userGuess.value.toLowerCase() === wordToGuess.toLowerCase()) {
                alert("You guessed the correct word!");
                userGuess.removeEventListener("keydown", verifyGuess);
            }
            else if (numberOfGuesses === 6) {
                setTimeout(() => {
                    alert(`Sorry, you lose. You already used up all 6 guesses.\nThe correct word is ${wordToGuess}!`);
                    userGuess.removeEventListener("keydown", verifyGuess);
                }, 400);
            }
            userGuess.value = "";
        }
    }
}
startingConfig();
