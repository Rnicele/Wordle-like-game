const words = [
  "apples",
  "banana",
  "orange",
  "grapes",
  "fabric",
  "hobbies",
  "labels",
  "nachos",
  "fishing",
  "vacuum",
];
let targetWord = words[Math.floor(Math.random() * words.length)]; // The target word (can be randomized)
let maxGuesses = 6; // Maximum number of guesses
let currentGuess = 0;

function initGame() {
  targetWord = words[Math.floor(Math.random() * words.length)];
  maxGuesses = 6;
  currentGuess = 0;
  document.getElementById("message").textContent = "";
  document.getElementById("attempts").textContent = maxGuesses - currentGuess;
  document.getElementById("reset-btn").style.display = "none";
  document.getElementById("guess-btn").style.display = "inline-block";
  document.getElementById("guess-input").value = "";
  document.getElementById("guess-input").focus();
  for (var i = 0; i < 6; i++) {
    let parentWord = document.querySelector("#word" + i);
    parentWord.classList.remove("guess");
    for (var j = 0; j < 6; j++) {
      const letterDiv = parentWord.querySelector("#letter" + j);
      document.getElementById("guess-btn").disabled = false;
      letterDiv.classList.remove("correct");
      letterDiv.classList.remove("absent");
      letterDiv.classList.remove("present");
      letterDiv.textContent = "";
    }
  }
}

document.getElementById("guess-btn").addEventListener("click", function () {
  const guessInput = document.getElementById("guess-input").value.toLowerCase();
  const message = document.getElementById("message");

  // Check if the input is valid (5-letter word)
  if (guessInput.length !== 6) {
    message.textContent = "Please enter a 6-letter word.";
    return;
  }

  // If too many guesses, end the game
  if (currentGuess >= maxGuesses) {
    message.textContent = `Game over! The word was "${targetWord}".`;
    document.getElementById("reset-btn").style.display = "inline-block";
    document.getElementById("reset-btn").addEventListener("click", initGame);
    return;
  }

  checkGuess(guessInput);
  currentGuess++;
  document.getElementById("attempts").textContent = maxGuesses - currentGuess;

  // Check if the player guessed the word correctly
  if (guessInput === targetWord) {
    message.textContent = "Congratulations! You've guessed the word!";
    document.getElementById("guess-btn").disabled = true;
    document.getElementById("reset-btn").style.display = "inline-block";
    document.getElementById("reset-btn").addEventListener("click", initGame);
  } else if (currentGuess >= maxGuesses) {
    message.textContent = `Game over! The word was "${targetWord}".`;
    document.getElementById("reset-btn").style.display = "inline-block";
    document.getElementById("reset-btn").addEventListener("click", initGame);
  }

  // Clear the input for the next guess
  document.getElementById("guess-input").value = "";
  document.getElementById("guess-input").focus();
});

function checkGuess(guess) {
  const guessesContainer = document.getElementById("guesses-container");

  const parentWord = document.querySelector("#word" + currentGuess);
  parentWord.classList.add("guess");

  const targetWordArray = targetWord.split("");
  const guessWordArray = guess.split("");

  // To track which letters in the target word are marked
  let targetMarked = Array(targetWord.length).fill(false);
  let guessMarked = Array(guess.length).fill(false);

  // First pass: Mark correct letters (green)
  for (let i = 0; i < guess.length; i++) {
    const letterDiv = parentWord.querySelector("#letter" + i);
    letterDiv.classList.add("letter");
    letterDiv.textContent = guess[i];

    if (guess[i] === targetWord[i]) {
      letterDiv.classList.add("correct"); // Correct letter and position
      targetMarked[i] = true; // Mark the letter as used in the target word
      guessMarked[i] = true; // Mark the letter as used in the guess word
    }
  }

  // Second pass: Mark present letters (yellow) and absent letters (gray)
  for (let i = 0; i < guess.length; i++) {
    if (guessMarked[i]) continue; // Skip already marked (green) letters

    // const letterDiv = guessDiv.children[i];
    const letterDiv = parentWord.querySelector("#letter" + i);

    if (targetWordArray.includes(guess[i])) {
      // Find how many times this letter appears in the target word
      const occurrencesInTarget = targetWordArray.filter(
        (letter, idx) => letter === guess[i] && !targetMarked[idx]
      ).length;

      // Find how many times we already used this letter in the guess word
      const occurrencesInGuess = guessWordArray
        .slice(0, i)
        .filter(
          (letter, idx) => letter === guess[i] && guessMarked[idx]
        ).length;

      if (occurrencesInGuess < occurrencesInTarget) {
        letterDiv.classList.add("present"); // Correct letter, wrong position
        const idx = targetWordArray.findIndex(
          (letter, idx) => letter === guess[i] && !targetMarked[idx]
        );
        targetMarked[idx] = true; // Mark this letter as used in the target word
      } else {
        letterDiv.classList.add("absent"); // No more occurrences in the target word
      }
    } else {
      letterDiv.classList.add("absent"); // Incorrect letter
    }
  }

  //   guessesContainer.appendChild(guessDiv);
}
