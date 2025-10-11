// api/ask.js
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = await req.json();
    const question = (body && body.question) ? String(body.question).trim() : '';
    if (!question) return res.status(400).json({ error: 'Missing question' });

    const KEY = process.env.GEMINI_API_KEY;
    const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

    if (!KEY) return res.status(500).json({ error: 'Gemini API key missing' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

    // Minimal prompt wrapper — you can adapt for stricter Islamic guidance
    const payload = {
      // The simple request format that works for many examples:
      contents: [
        {
          parts: [
            { text: `You are an Islamic assistant. Answer concisely and respectfully. Question: ${question}` }
          ]
        }
      ]
    };

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json();
    // try multiple response shapes:
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output?.[0]?.content?.text ||
      data?.output?.[0]?.content?.text ||
      data?.output?.[0]?.content?.[0]?.text;

    const answer = candidateText || 'No answer returned from Gemini.';
    res.status(200).json({ answer });
  } catch (err) {
    console.error('Ask error', err);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
      }
