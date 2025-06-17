const quizData = [
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<style>", "<css>", "<script>", "<link>"],
    answer: "<style>"
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    answer: "font-size"
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    answer: "<script>"
  }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  scoreEl.textContent = `Your score: ${score} / ${quizData.length}`;

  // Create Retake button
  const retakeBtn = document.createElement("button");
  retakeBtn.textContent = "Retake Quiz";
  retakeBtn.style.marginTop = "20px";
  retakeBtn.style.padding = "10px 20px";
  retakeBtn.style.fontSize = "16px";
  retakeBtn.style.cursor = "pointer";

  retakeBtn.onclick = resetQuiz;

  optionsEl.appendChild(retakeBtn);
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreEl.textContent = "";
  nextBtn.style.display = "inline-block";
  loadQuestion();
}


nextBtn.onclick = () => {
  loadQuestion();
};

loadQuestion();

// Weather API
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherResult = document.getElementById("weather-result");

getWeatherBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.textContent = "Please enter a city name.";
    return;
  }

  weatherResult.textContent = "Loading weather...";

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.textContent = "City not found.";
      return;
    }
    const { latitude, longitude } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const weather = weatherData.current_weather;

    weatherResult.innerHTML = `
      <strong>Temperature:</strong> ${weather.temperature}°C<br>
      <strong>Windspeed:</strong> ${weather.windspeed} km/h<br>
      <strong>Condition:</strong> ${weather.weathercode}
    `;
  } catch (err) {
    console.error(err);
    weatherResult.textContent = "Error fetching weather.";
  }
});

// Hamburger menu toggle
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.getElementById("nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

const allSections = {
  "quiz-container": document.getElementById("quiz-container"),
  "weather": document.getElementById("weather"),
  "joke": document.getElementById("joke")
};

document.querySelectorAll(".nav-links li").forEach(item => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-target");
    for (let key in allSections) {
      allSections[key].style.display = (key === target) ? "block" : "none";
    }
    navLinks.style.display = "none";
  });
});

// Initial display setup
allSections["quiz-container"].style.display = "block";
allSections["weather"].style.display = "none";
allSections["joke"].style.display = "none";

// Joke API
const jokeBtn = document.getElementById("joke-btn");
const jokeText = document.getElementById("joke-text");

jokeBtn.addEventListener("click", async () => {
  jokeText.textContent = "Loading joke...";
  try {
    const res = await fetch("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" }
    });
    const data = await res.json();
    jokeText.textContent = data.joke;
  } catch (err) {
    console.error(err);
    jokeText.textContent = "Failed to fetch a joke.";
  }
});