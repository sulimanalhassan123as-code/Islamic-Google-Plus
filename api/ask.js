export default async function handler(req, res) {
  try {
    const { question } = await req.json();

    if (!question) {
      return res.status(400).json({ error: "Missing question input." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      }
    );

    const data = await geminiResponse.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get AI response." });
  }
}
