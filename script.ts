const url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";

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
                    console.log(arr[randomNumber]);
                };
                xhr.send();
            }
        });
    } 
}

startingConfig();
