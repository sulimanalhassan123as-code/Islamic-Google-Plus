// Theme toggle
const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
});

// Show AI input
const aiToggle = document.getElementById('toggle-ai');
const aiContainer = document.getElementById('ai-container');
aiToggle.addEventListener('click', () => {
  aiContainer.classList.toggle('hidden');
});

// Placeholder for search
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  document.getElementById('loading-message').innerText = `Searching for "${query}"...`;
  setTimeout(() => {
    document.getElementById('search-results-container').innerHTML = `<div class="search-result-item">Result for <b>${query}</b></div>`;
    document.getElementById('loading-message').innerText = '';
  }, 1000);
});

// Placeholder for AI answer
const aiSendBtn = document.getElementById('ai-send-btn');
aiSendBtn.addEventListener('click', () => {
  const question = document.getElementById('ai-question-input').value;
  const answerContainer = document.getElementById('ai-answer-container');
  answerContainer.innerHTML = `<div class="ai-answer">AI Answer for: <b>${question}</b></div>`;
});

// Placeholder for Qibla widget
document.getElementById('qibla-widget').innerText = "Qibla direction will appear here.";

// Placeholder for daily quote
document.getElementById('daily-quote').innerText = "Be kind, pray, and seek knowledge daily.";
