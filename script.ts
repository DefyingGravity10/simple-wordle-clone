const url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
let numberOfGuesses = 0;
let wordToGuess = "";
let guess = "";
let currWord:string[] = [];
const letterArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", 
                    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
                    "u", "v", "w", "x", "y", "z"];

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
                xhr.onload = function() {
                    const arr = xhr.responseText.split('\n');
                    const randomNumber: number = Math.floor(Math.random() * arr.length); 
                    wordToGuess = arr[randomNumber];
                    setMainScreen(wordToGuess);
                };
                xhr.send();
            }
        });
    } 
}

function setMainScreen(wordToGuess: string) {
    const div = document.getElementById("start-div");

    //Create new screen
    if (div !== null) {
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row-container")
        for (let i=0; i<6; i++) {
            const row = document.createElement("div");
            for (let j=0; j<5; j++) {
                const square = document.createElement("span");
                square.classList.add("squares");
                row.appendChild(square);
            }
            row.classList.add("rows");
            rowContainer.appendChild(row);
        }
        const keyboard1 = ["q", "w", "e", "r", "t", "y", "u", "i","o", "p"];
        const keyboard2 = ["a", "s", "d", "f", "g", "h","j", "k", "l"];
        const keyboard3 = ["Backspace", "z", "x", "c", "v", "b", "n", "m", "Enter"];

        const keyboardContainer = document.createElement("div");
        keyboardContainer.setAttribute("id","keyboard-container");
        for (let i=0; i<3; i++) {
            const keyboardRow = document.createElement("div");
            if (i===0) {
                keyboard1.forEach((l) => {
                    const letter = document.createElement("button");
                    letter.textContent = l;
                    letter.classList.add("key");
                    letter.setAttribute("id", l);
                    keyboardRow.appendChild(letter);
                });
            }
            if (i===1) {
                keyboard2.forEach((l) => {
                    const letter = document.createElement("button");
                    letter.textContent = l;
                    letter.classList.add("key");
                    letter.setAttribute("id", l);
                    keyboardRow.appendChild(letter);
                });
            }
            if (i===2) {
                keyboard3.forEach((l) => {
                    const letter = document.createElement("button");
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
        keyboardContainer.addEventListener("click", registerClick);
    }    
}

function registerKey(e: KeyboardEvent) {
    if (letterArr.includes(e.key.toLowerCase())) {
        addLettersToScreen(e.key.toLowerCase());
    }
    if (e.key === "Backspace") {
        deleteLetters();
    }
    if (e.key === "Enter") {
        verifyGuess()
    }
}

function registerClick(e: MouseEvent) {
    if (e !== null) {
        const elem = e.target as Element;
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

function addLettersToScreen(key:string) {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];

    if (rowContainer !== null) {
        if (currWord.length < 5) {
            squares[currWord.length].textContent = key;
            currWord.push(key);
        }   
    }
}

function deleteLetters() {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;
    const currRow = rowContainer[numberOfGuesses];
    const squares = [...currRow.children];

    if (rowContainer !== null) {
        if (currWord.length > 0) {
            squares[currWord.length-1].textContent = "";
            currWord.pop();
        }
    }
}

function verifyGuess() {
    const rowContainer = document.getElementsByClassName("row-container")[0].children;

    if (rowContainer !== null) {
        if (currWord.length < 5) {
            
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
            else if (numberOfGuesses === 5){
                setTimeout(() => {
                    alert(`Game Over. You already used up all 6 guesses.\nThe correct word is ${wordToGuess}!`);
                    window.removeEventListener("keydown", registerKey);
                    const keyboardContainer = document.getElementById("keyboard-container");
                    if (keyboardContainer !== null) {
                        keyboardContainer.removeEventListener("click", registerClick);
                    } 
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

    for (let i=0; i<5; i++) {
        if (wordToGuess[i] == guess[i]) {
            squares[i].classList.add("correct");
        }
        else if (wordToGuess.includes(`${guess[i]}`)) {
            squares[i].classList.add("misplaced");
        }
        else {
            squares[i].classList.add("incorrect");
        }
    }
}

startingConfig();