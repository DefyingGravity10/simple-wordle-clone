"use strict";
const url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
let numberOfGuesses = 0;
let wordToGuess = "";
let guess = "";
let currWord = [];
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
    //Create new screen
    if (div !== null) {
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row-container");
        for (let i = 0; i < 6; i++) {
            const row = document.createElement("div");
            for (let j = 0; j < 5; j++) {
                const square = document.createElement("div");
                square.classList.add("squares");
                row.appendChild(square);
            }
            row.classList.add("rows");
            rowContainer.appendChild(row);
        }
        const keyboard1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
        const keyboard2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
        const keyboard3 = ["Backspace", "z", "x", "c", "v", "b", "n", "m", "Enter"];
        const keyboardContainer = document.createElement("div");
        for (let i = 0; i < 3; i++) {
            const keyboardRow = document.createElement("div");
            if (i === 0) {
                keyboard1.forEach((l) => {
                    const letter = document.createElement("div");
                    letter.textContent = l;
                    letter.classList.add("key");
                    letter.setAttribute("id", l);
                    keyboardRow.appendChild(letter);
                });
            }
            if (i === 1) {
                keyboard2.forEach((l) => {
                    const letter = document.createElement("div");
                    letter.textContent = l;
                    letter.classList.add("key");
                    letter.setAttribute("id", l);
                    keyboardRow.appendChild(letter);
                });
            }
            if (i === 2) {
                keyboard3.forEach((l) => {
                    const letter = document.createElement("div");
                    letter.textContent = l;
                    letter.classList.add("key");
                    letter.setAttribute("id", l);
                    keyboardRow.appendChild(letter);
                });
            }
            keyboardRow.classList.add("keyboard-row");
            keyboardContainer.appendChild(keyboardRow);
        }
        div.replaceChildren(rowContainer, keyboardContainer);
        //Obtain user guesses
        window.addEventListener("keydown", registerKey);
        console.log(wordToGuess);
        //Try to ensure that e can be a click event :>
    }
}
function registerKey(e) {
    if (e.key.match(/[a-z]/i) && e.key !== "Enter" && e.key !== "Backspace") {
        addLettersToScreen(e);
    }
    if (e.key === "Enter") {
        verifyGuess(e);
    }
    if (e.key === "Backspace") {
        deleteLetters(e);
    }
}
function addLettersToScreen(e) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    if (rowContainer !== null) {
        if (currWord.length < 5) {
            squares[currWord.length].textContent = e.key;
            currWord.push(e.key);
        }
    }
}
function deleteLetters(e) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    if (rowContainer !== null) {
        if (currWord.length > 0) {
            squares[currWord.length - 1].textContent = "";
            currWord.pop();
        }
    }
}
function verifyGuess(e) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    if (rowContainer !== null) {
        if (currWord.length < 5) {
            alert("The input box should have exactly 5 characters!");
        }
        else {
            if (currWord.join("").toLowerCase() === wordToGuess.toLowerCase()) {
                setTimeout(() => {
                    alert("You guessed the correct word!");
                    window.removeEventListener("keydown", verifyGuess);
                }, 500);
            }
            else if (numberOfGuesses === 6) {
                setTimeout(() => {
                    alert(`Sorry, you lose. You already used up all 6 guesses.\nThe correct word is ${wordToGuess}!`);
                    window.removeEventListener("keydown", verifyGuess);
                }, 500);
            }
            guess = currWord.join("");
            revealHints();
            numberOfGuesses += 1;
            currWord = [];
        }
    }
}
function revealHints() {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    for (let i = 0; i < 5; i++) {
        if (wordToGuess[i] == guess[i]) {
            squares[i].classList.add("correct");
        }
        else if (wordToGuess.includes(`${guess[i]}`)) {
            squares[i].classList.add("misplaced");
        }
    }
}
startingConfig();
