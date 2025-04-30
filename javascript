document.addEventListener("DOMContentLoaded", function () {
  const words = ["apple", "banana", "cherry", "orange", "grape", "peach"];
  let currentWordIndex = 0;
  let typed = "";
  let correctCount = 0;
  let incorrectCount = 0;
  let totalTyped = 0;
  let selectedWords = [];
  let startTime = 0;

  const wordBox = document.getElementById("word-box");

  // Create underline element
  const underline = document.createElement("div");
  underline.id = "underline";
  wordBox.appendChild(underline);

  function updateStats() {
    const totalTypedChars = correctCount + incorrectCount;
    const accuracy =
      totalTypedChars === 0
        ? 100
        : Math.round((correctCount / totalTypedChars) * 100);
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wpm = timeElapsed === 0 ? 0 : Math.round(totalTyped / 5 / timeElapsed);
    document.getElementById("stats").textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
  }

  function shuffleWords() {
    selectedWords = [];
    let wordsCopy = [...words];
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * wordsCopy.length);
      selectedWords.push(wordsCopy[randomIndex]);
      wordsCopy.splice(randomIndex, 1);
    }
  }

  function moveUnderlineTo(el) {
    const boxRect = wordBox.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    underline.style.width = `${elRect.width}px`;
    underline.style.left = `${elRect.left - boxRect.left}px`;
  }

  function showWords() {
    wordBox.innerHTML = selectedWords
      .map((word, i) => {
        if (i === currentWordIndex) {
          let highlighted = "";
          for (let j = 0; j < word.length; j++) {
            const char = word[j];
            const typedChar = typed[j];
            if (typedChar == null) {
              highlighted += `<span>${char}</span>`;
            } else if (typedChar === char) {
              highlighted += `<span style="color: #E1B62B">${char}</span>`;
            } else {
              highlighted += `<span style="color: #C24554">${char}</span>`;
            }
          }
          return `<span class="current-word">${highlighted}</span>`;
        }
        return `<span>${word}</span>`;
      })
      .join(" ");

    wordBox.appendChild(underline); // keep underline at end
    const current = wordBox.querySelector(".current-word");
    if (current) moveUnderlineTo(current);

    updateStats();
  }

  function handleTyping(event) {
    const key = event.key;
    const isSpace = key === " " || key === "Enter";
    const isBackspace = key === "Backspace";

    if (isBackspace) {
      typed = typed.slice(0, -1);
      showWords();
    } else if (isSpace) {
      if (typed === selectedWords[currentWordIndex]) {
        correctCount += typed.length;
      } else {
        incorrectCount += typed.length;
      }

      totalTyped += typed.length;
      currentWordIndex++;

      if (currentWordIndex >= selectedWords.length) {
        currentWordIndex = 0;
        shuffleWords();
      }

      typed = "";
      showWords();
    } else if (key.length === 1) {
      if (currentWordIndex === 0) {
        startTime = Date.now(); // Start timer on first key press
      }
      typed += key;
      showWords();
    }
  }

  shuffleWords();
  showWords();
  document.addEventListener("keydown", handleTyping);
});
