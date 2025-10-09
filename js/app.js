// === ISLAMIC GOOGLE PLUS - app.js ===

// 🌙 Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle?.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Load theme from storage
document.body.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

// === SEARCH FUNCTIONALITY ===
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");

// Paste your Google API key and CX in Vercel environment variables
const API_KEY = import.meta.env.VITE_API_KEY || "YOUR_API_KEY_HERE";
const CX = import.meta.env.VITE_CX || "YOUR_SEARCH_ENGINE_ID";

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.items) {
      resultsDiv.innerHTML = data.items.map(item => `
        <div class="result-item">
          <a href="${item.link}" target="_blank">${item.title}</a>
          <div class="result-snippet">${item.snippet}</div>
        </div>
      `).join("");
    } else {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">Error fetching search results.</p>`;
  }
}

searchBtn?.addEventListener("click", performSearch);
searchInput?.addEventListener("keydown", e => {
  if (e.key === "Enter") performSearch();
});

// === ASK AI (Gemini or OpenAI) ===
const askBtn = document.getElementById("ask-btn");
const askInput = document.getElementById("ask-input");
const answerDiv = document.getElementById("answer");

async function askAI() {
  const question = askInput.value.trim();
  if (!question) return;

  answerDiv.innerHTML = "<p>Thinking...</p>";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    answerDiv.innerHTML = `<div class="ai-answer">${data.answer}</div>`;
  } catch {
    answerDiv.innerHTML = `<p style="color:red;">Failed to get AI response.</p>`;
  }
}

askBtn?.addEventListener("click", askAI);

// === DAILY ISLAMIC QUOTE ===
const quotes = [
  "Indeed, with hardship [will be] ease. — Qur'an 94:6",
  "The best among you are those who have the best manners and character. — Prophet Muhammad ﷺ",
  "Kindness is a mark of faith, and whoever has not kindness has not faith. — Prophet Muhammad ﷺ",
  "Do not lose hope, nor be sad. — Qur'an 3:139",
  "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him. — Hadith"
];

function showDailyQuote() {
  const quoteEl = document.getElementById("daily-quote");
  if (!quoteEl) return;
  const today = new Date().getDate();
  quoteEl.textContent = quotes[today % quotes.length];
}
showDailyQuote();

// === QIBLA DIRECTION (Simple Compass) ===
function initQibla() {
  const qiblaEl = document.getElementById("qibla");
  if (!qiblaEl) return;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const kaabaLat = 21.4225;
      const kaabaLon = 39.8262;
      const rad = Math.PI / 180;
      const deltaLon = (kaabaLon - longitude) * rad;
      const y = Math.sin(deltaLon);
      const x =
        Math.cos(latitude * rad) * Math.tan(kaabaLat * rad) -
        Math.sin(latitude * rad) * Math.cos(deltaLon);
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const direction = (angle + 360) % 360;

      qiblaEl.innerHTML = `
        <h2>🕋 Qibla Direction</h2>
        <p>Point your device to <strong>${Math.round(direction)}°</strong> from North.</p>
      `;
    });
  } else {
    qiblaEl.textContent = "Qibla direction unavailable.";
  }
}
initQibla();
// === QIBLA DIRECTION ===
async function initQibla() {
  const qiblaInfo = document.getElementById("qibla-info");
  const canvas = document.getElementById("qibla-compass");
  const ctx = canvas.getContext("2d");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const kaabaLat = 21.4225;
      const kaabaLon = 39.8262;

      const qiblaDir = Math.atan2(
        Math.sin(kaabaLon - lon),
        Math.cos(lat) * Math.tan(kaabaLat) - Math.sin(lat) * Math.cos(kaabaLon - lon)
      );

      const angle = (qiblaDir * (180 / Math.PI) + 360) % 360;
      qiblaInfo.textContent = `Qibla direction: ${angle.toFixed(1)}° from North`;

      drawCompass(angle);
    }, () => {
      qiblaInfo.textContent = "Location access denied.";
    });
  } else {
    qiblaInfo.textContent = "Geolocation not supported.";
  }

  function drawCompass(angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(90, 90, 80, 0, 2 * Math.PI);
    ctx.strokeStyle = "#00bfa6";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.save();
    ctx.translate(90, 90);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -60);
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
}

initQibla();

// === DAILY ISLAMIC QUOTE ===
const quotes = [
  "“The best among you are those who learn the Qur’an and teach it.” – Prophet Muhammad ﷺ",
  "“Indeed, with hardship comes ease.” – Qur'an 94:6",
  "“The most beloved deeds to Allah are those done regularly, even if small.” – Bukhari",
  "“Allah does not burden a soul beyond that it can bear.” – Qur'an 2:286",
  "“Remember Allah in times of ease and He will remember you in times of difficulty.” – Tirmidhi"
];

document.getElementById("daily-quote").textContent = quotes[Math.floor(Math.random() * quotes.length)];
