// js/app.js — Knowledge Garden Edition (fixed version)

// ========== THEME ==========
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('kg_theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', next);
  localStorage.setItem('kg_theme', next);
  themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
});

// ========== SEARCH ==========
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsEl = document.getElementById('search-results');
const loadingEl = document.getElementById('search-loading');

async function runSearch(q){
  loadingEl.textContent = 'Searching…';
  resultsEl.innerHTML = '';
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      loadingEl.textContent = j?.error || 'Search error';
      return;
    }
    const data = await res.json();
    loadingEl.textContent = '';
    const items = data.results || [];
    if (!items.length) {
      resultsEl.innerHTML = `<div class="muted small">No results found.</div>`;
      return;
    }
    resultsEl.innerHTML = items.map(it => `
      <div class="result-item">
        <a href="${it.link}" target="_blank" rel="noopener">${it.title}</a>
        <div class="snippet">${it.snippet || ''}</div>
      </div>`).join('');
  } catch (err) {
    console.error('Search error', err);
    loadingEl.textContent = 'Network error while searching.';
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  runSearch(q);
});

// ========== ASK AI ==========
const askBtn = document.getElementById('ask-button');
const askInput = document.getElementById('ask-input');
const askAnswer = document.getElementById('ask-answer');
const askLoading = document.getElementById('ask-loading');

askBtn.addEventListener('click', async () => {
  const q = askInput.value.trim();
  if (!q) return;
  askAnswer.innerHTML = '';
  askLoading.textContent = 'Thinking…';
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: q }) // ✅ FIXED FIELD NAME
    });
    const data = await res.json();
    askLoading.textContent = '';
    if (res.ok && data.answer) {
      askAnswer.innerHTML = `<div class="ai-answer">${escapeHtml(data.answer)}</div>`;
    } else {
      askAnswer.innerHTML = `<div class="ai-answer">No answer — ${data?.error || 'unknown error'}</div>`;
    }
  } catch (err) {
    console.error('Ask error', err);
    askLoading.textContent = '';
    askAnswer.innerHTML = `<div class="ai-answer">Network error while contacting AI.</div>`;
  }
});

// tiny safe-escape function
function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

// ========== DAILY QUOTE ==========
const dailyQuoteEl = document.getElementById('daily-quote');
const newQuoteBtn = document.getElementById('new-quote');

const QUOTES = [
  "Indeed, with hardship comes ease. — Qur'an 94:6",
  "The best among you are those who learn the Qur'an and teach it. — Prophet ﷺ",
  "Whoever seeks knowledge, Allah will make easy for him a path to Paradise. — Hadith",
  "Kindness is a mark of faith. — Prophet ﷺ",
  "Remember Allah in times of ease and He will remember you in times of difficulty. — Tirmidhi"
];

function showDailyQuote(){
  const day = new Date().getDate();
  dailyQuoteEl.textContent = QUOTES[day % QUOTES.length];
}
showDailyQuote();

newQuoteBtn.addEventListener('click', () => {
  dailyQuoteEl.textContent = QUOTES[Math.floor(Math.random()*QUOTES.length)];
});

// ========== WHATSAPP SENDING ==========
const WA_PHONE = '233599931348';
const waSend = document.getElementById('wa-send');
const waMessageInput = document.getElementById('wa-message');

waSend.addEventListener('click', () => {
  const msg = waMessageInput.value.trim();
  if (!msg) {
    window.open(`https://wa.me/${WA_PHONE}`, '_blank');
    return;
  }
  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${WA_PHONE}?text=${encoded}`;
  window.open(url, '_blank');
});
