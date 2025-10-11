// --- Islamic Google Plus app.js ---
// Handles both Search and AI ask functions properly

// ======== SEARCH FUNCTION =========
document.getElementById("searchButton")?.addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter something to search.");

  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "<p>Searching...</p>";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    resultsContainer.innerHTML = data.results
      .map(
        (item) => `
        <div class="result">
          <a href="${item.link}" target="_blank">${item.title}</a>
          <p>${item.snippet}</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>Failed to fetch search results.</p>";
  }
});

// ======== ASK AI FUNCTION =========
document.getElementById("askButton")?.addEventListener("click", async () => {
  const userInput = document.getElementById("askInput").value.trim();
  const aiResponse = document.getElementById("aiResponse");

  if (!userInput) {
    aiResponse.innerHTML = "Please type your question.";
    return;
  }

  aiResponse.innerHTML = "🤖 Thinking...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }), // ✅ this sends the actual question
    });

    const data = await response.json();

    if (data.error) {
      aiResponse.innerHTML = "⚠️ " + (data.error || "AI error");
    } else {
      aiResponse.innerHTML = data.reply || "No answer received.";
    }
  } catch (error) {
    console.error("AI fetch error:", error);
    aiResponse.innerHTML = "⚠️ Network error when connecting to AI.";
  }
});
