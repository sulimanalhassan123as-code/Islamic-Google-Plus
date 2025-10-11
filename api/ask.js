import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Robust body parsing:
    // - If req.body is already an object (Next.js with bodyParser), use it.
    // - If req.body is a string, parse it.
    // - If running in an environment where req is a WHATWG Request (Edge),
    //   try req.json() if available.
    // - Fallback: read the raw stream and parse.
    let bodyData;
    if (req.body) {
      bodyData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } else if (typeof req.json === "function") {
      // Some runtimes (edge) expose req.json()
      bodyData = await req.json();
    } else {
      // Fallback for raw Node req stream
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8");
      bodyData = raw ? JSON.parse(raw) : {};
    }

    const userMessage = bodyData?.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return res.status(500).json({ error: "Server misconfiguration: missing GEMINI_API_KEY" });
    }
    const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ error: "Failed to fetch AI results", details: data });
    }

    const aiReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t understand that.";

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("Ask error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
        }
