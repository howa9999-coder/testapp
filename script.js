const cousins = [
  { name: "Mariem", images: ["images/mariem1.jpg", "images/mariem2.jpg"] },
  { name: "Khadija", images: ["images/khadija1.jpg", "images/khadija2.jpg", "images/khadija3.jpg", "images/khadija4.jpg", "images/khadija5.jpg", "images/khadija6.jpg", "images/khadija8.jpg"] },
  { name: "Abd El Rahman", images: ["images/abd1.jpg", "images/abd2.jpg", "images/abd3.jpg", "images/abd4.jpg", "images/abd6.jpg", "images/abd7.jpg"] }
];

/* const effects = ["blurred", "pixelated", "cropped"];
 */const effects = ["blurred", "cropped"];

let correctCousin = null;
let score = 0;
let attempts = 0;
let maxAttempts = 10;
let timer;
let timeLeft = 10;
let playerName = "";
let imageQueue = [];

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const finalScreen = document.getElementById("final-screen");
const playerNameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const mysteryImage = document.getElementById("mysteryImage");
const result = document.getElementById("result");
const choicesContainer = document.getElementById("choices");
const scoreSpan = document.getElementById("score");
const attemptsSpan = document.getElementById("attempts");
const timerSpan = document.getElementById("timer");
const finalMessage = document.getElementById("finalMessage");

const welcomeSound = document.getElementById("welcomeSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const finalScoreSound = document.getElementById("finalScoreSound");

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name to start!");
    return;
  }

  welcomeSound.play();
  welcomeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  finalScreen.classList.add("hidden");

  score = 0;
  attempts = 0;
  updateScoreDisplay();
  result.innerText = "";
  mysteryImage.className = "";

  // Build image queue
  imageQueue = [];
  cousins.forEach(cousin => {
    cousin.images.forEach(img => {
      imageQueue.push({ cousin, image: img });
    });
  });
  shuffle(imageQueue);

  maxAttempts = imageQueue.length;

  startRound();
}

function startRound() {
  if (attempts >= maxAttempts || imageQueue.length === 0) {
    endGame();
    return;
  }

  result.innerText = "";
  mysteryImage.className = "";

  const next = imageQueue.pop();
  correctCousin = next.cousin;
  const imageSrc = next.image;
  const randomEffect = getRandom(effects);

  mysteryImage.src = imageSrc;
  mysteryImage.classList.add(randomEffect);

  // Create guess buttons
  const shuffled = shuffle([...cousins]);
  choicesContainer.innerHTML = "";
  shuffled.forEach(cousin => {
    const btn = document.createElement("button");
    btn.innerText = cousin.name;
    btn.onclick = () => checkAnswer(cousin.name);
    choicesContainer.appendChild(btn);
  });

  clearInterval(timer);
  startTimer();
}

function startTimer() {
  timeLeft = 10;
  timerSpan.innerText = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerSpan.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      checkAnswer("⏰ Time's up");
    }
  }, 1000);
}

/* function checkAnswer(selectedName) {
  clearInterval(timer);
  mysteryImage.className = "";

  if (selectedName === correctCousin.name) {
    result.innerText = "✅ Correct!";
    result.style.color = "green";
    score++;
    correctSound.play();
  } else if (selectedName === "⏰ Time's up") {
    result.innerText = `⏰ Time's up! It was ${correctCousin.name}`;
    result.style.color = "orange";
    wrongSound.play();
  } else {
    result.innerText = `❌ Wrong! It was ${correctCousin.name}`;
    result.style.color = "red";
    wrongSound.play();
  }

  attempts++;
  updateScoreDisplay();

  // Show clear image for 2.5 seconds before next round
  mysteryImage.src = imageQueue.length > 0 ? imageQueue[imageQueue.length - 1].image : mysteryImage.src;
  setTimeout(startRound, 2500);
} */
function checkAnswer(selectedName) {
  clearInterval(timer);

  // Reveal clear image immediately
  mysteryImage.className = "";

  // Show result text
  if (selectedName === correctCousin.name) {
    result.innerText = "✅ Correct!";
    result.style.color = "green";
    score++;
    correctSound.play();
  } else if (selectedName === "⏰ Time's up") {
    result.innerText = `⏰ Time's up! It was ${correctCousin.name}`;
    result.style.color = "orange";
    wrongSound.play();
  } else {
    result.innerText = `❌ Wrong! It was ${correctCousin.name}`;
    result.style.color = "red";
    wrongSound.play();
  }

  attempts++;
  updateScoreDisplay();

  // Wait 2.5 seconds with clear image and message, then start next round
  setTimeout(() => {
    result.innerText = "";
    startRound();
  }, 2500);
}


function updateScoreDisplay() {
  scoreSpan.innerText = `Score: ${score}`;
  attemptsSpan.innerText = `Attempts: ${attempts}`;
}

function endGame() {
  gameScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  finalScoreSound.play();
  let compliment = "";

if (score === maxAttempts) {
  compliment = "👑 Sibling Mastermind! You know your siblings better than anyone! 💖";
} else if (score >= maxAttempts * 0.7) {
  compliment = "👏 Great job! You really know your siblings' faces! 😄";
} else if (score >= maxAttempts * 0.4) {
  compliment = "😅 Not bad! Maybe spend a bit more time looking through sibling selfies! 🧩";
} else {
  compliment = "😂 Oops! Are you sure you're related? Just kidding — siblings are full of surprises! 💕";
}

  finalMessage.innerText = `<b> ${playerName} </b>, your final score is <b> ${score} </b> out of ${maxAttempts}. <br> ${compliment}`;
}

startBtn.onclick = startGame;
playAgainBtn.onclick = () => {
  attempts = 0;
  score = 0;
  playerNameInput.value = "";
  finalScreen.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
};

document.getElementById("resetBtn").onclick = () => {
  score = 0;
  attempts = 0;
  updateScoreDisplay();
  result.innerText = "";
};

document.getElementById("downloadBtn").addEventListener("click", downloadAllImages);

function downloadAllImages() {
  const zip = new JSZip();
  const imgFolder = zip.folder("cousin-images");

  const imagePaths = [];
  cousins.forEach(cousin => {
    cousin.images.forEach(img => {
      imagePaths.push(img);
    });
  });

  let count = 0;

  imagePaths.forEach(imgPath => {
    fetch(imgPath)
      .then(res => res.blob())
      .then(blob => {
        const fileName = imgPath.split("/").pop();
        imgFolder.file(fileName, blob);
        count++;
        if (count === imagePaths.length) {
          zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "cousins_pictures.zip");
          });
        }
      })
      .catch(err => {
        console.error(`Failed to load ${imgPath}:`, err);
      });
  });
}
