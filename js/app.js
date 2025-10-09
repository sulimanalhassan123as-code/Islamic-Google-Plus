// Fetch search results
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  const resultsContainer = document.getElementById('search-results-container');
  document.getElementById('loading-message').innerText = "Searching...";

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    resultsContainer.innerHTML = "";
    if (data.items?.length) {
      data.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
          <a href="${item.link}" class="result-title">${item.title}</a>
          <span class="result-url">${item.link}</span>
          <p class="result-snippet">${item.snippet}</p>
        `;
        resultsContainer.appendChild(div);
      });
    } else {
      resultsContainer.innerHTML = "<p>No results found</p>";
    }
  } catch (err) {
    resultsContainer.innerHTML = "<p>Error fetching results</p>";
  }
  document.getElementById('loading-message').innerText = "";
});

// Fetch AI answer
aiSendBtn.addEventListener('click', async () => {
  const question = document.getElementById('ai-question-input').value;
  const answerContainer = document.getElementById('ai-answer-container');
  answerContainer.innerHTML = "Loading AI answer...";

  try {
    const res = await fetch(`/api/ask?question=${encodeURIComponent(question)}`);
    const data = await res.json();
    answerContainer.innerHTML = `<div class="ai-answer">${data.answer}</div>`;
  } catch (err) {
    answerContainer.innerHTML = "<div class='ai-answer'>Error fetching AI answer</div>";
  }
});

// Fetch daily quote
async function loadDailyQuote() {
  const quoteEl = document.getElementById('daily-quote');
  try {
    const res = await fetch('/api/quotes');
    const data = await res.json();
    quoteEl.innerText = data.quote;
  } catch (err) {
    quoteEl.innerText = "Unable to load quote.";
  }
}
loadDailyQuote();
