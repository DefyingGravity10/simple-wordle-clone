"use strict";
let numberOfGuesses = 0;
let wordToGuess = "";
let currWord = [];
function startingConfig() {
    const url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
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
                alert("No URL specified, please try again.");
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
                const square = document.createElement("span");
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
        keyboardContainer.setAttribute("id", "keyboard-container");
        for (let i = 0; i < 3; i++) {
            const keyboardRow = document.createElement("div");
            if (i === 0) {
                createButton(keyboard1, keyboardRow);
            }
            if (i === 1) {
                createButton(keyboard2, keyboardRow);
            }
            if (i === 2) {
                createButton(keyboard3, keyboardRow);
            }
            keyboardRow.classList.add("keyboard-row");
            keyboardContainer.appendChild(keyboardRow);
        }
        div.replaceChildren(rowContainer, keyboardContainer);
        //Obtain user guesses
        window.addEventListener("keydown", registerKey);
        keyboardContainer.addEventListener("click", registerClick);
    }
}
function createButton(keyboardN, keyboardRow) {
    keyboardN.forEach((l) => {
        const letter = document.createElement("button");
        letter.textContent = l;
        letter.classList.add("key");
        letter.setAttribute("id", l);
        keyboardRow.appendChild(letter);
    });
}
function registerKey(e) {
    const letterArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z"];
    if (letterArr.includes(e.key.toLowerCase())) {
        addLettersToScreen(e.key.toLowerCase());
    }
    if (e.key === "Backspace") {
        deleteLetters();
    }
    if (e.key === "Enter") {
        verifyGuess();
    }
}
function registerClick(e) {
    const letterArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z"];
    if (e !== null) {
        const elem = e.target;
        const key = elem.getAttribute("id");
        if (key !== null) {
            if (letterArr.includes(key)) {
                addLettersToScreen(key);
            }
            if (key === "Backspace") {
                deleteLetters();
            }
            if (key === "Enter") {
                verifyGuess();
            }
        }
    }
}
function addLettersToScreen(key) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    if (rowContainer !== null && currWord.length < 5) {
        squares[currWord.length].textContent = key;
        currWord.push(key);
    }
}
function deleteLetters() {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    if (rowContainer !== null && currWord.length > 0) {
        squares[currWord.length - 1].textContent = "";
        currWord.pop();
    }
}
function verifyGuess() {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    if (rowContainer !== null) {
        if (currWord.length < 5) { //do nothing
        }
        else {
            if (currWord.join("").toLowerCase() === wordToGuess.toLowerCase()) {
                setTimeout(() => {
                    alert("Congratulations, you guessed the correct word!");
                    window.removeEventListener("keydown", registerKey);
                    const keyboardContainer = document.getElementById("keyboard-container");
                    if (keyboardContainer !== null) {
                        keyboardContainer.removeEventListener("click", registerClick);
                    }
                }, 500);
            }
            else if (numberOfGuesses === 5) {
                setTimeout(() => {
                    alert(`Game Over. You already used up all 6 guesses.\nThe correct word is ${wordToGuess}!`);
                    window.removeEventListener("keydown", registerKey);
                    const keyboardContainer = document.getElementById("keyboard-container");
                    if (keyboardContainer !== null) {
                        keyboardContainer.removeEventListener("click", registerClick);
                    }
                }, 500);
            }
            revealHints(currWord.join(""));
            numberOfGuesses += 1;
            currWord = [];
        }
    }
}
function revealHints(guess) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];
    const tally = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
        n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0 };
    Array.from(wordToGuess).forEach((letter) => {
        if (letter in tally) {
            tally[letter] += 1;
        }
    });
    for (let i = 0; i < 5; i++) {
        if (wordToGuess[i] == guess[i] && tally[guess[i]] > 0) {
            squares[i].classList.add("correct");
            tally[guess[i]] -= 1;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (wordToGuess.includes(`${guess[i]}`) && tally[guess[i]] > 0 && !squares[i].classList.contains("correct")) {
            squares[i].classList.add("misplaced");
            tally[guess[i]] -= 1;
        }
        else if (!squares[i].classList.contains("correct")) {
            squares[i].classList.add("incorrect");
        }
    }
}
startingConfig();
