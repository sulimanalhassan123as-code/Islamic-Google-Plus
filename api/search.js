// api/search.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Missing search query" });
    }

    const API_KEY = process.env.API_KEY;
    const CX = process.env.CX;

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(
      q
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res
        .status(200)
        .json({ results: [], message: "No results found for your query." });
    }

    const results = data.items.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ error: "Something went wrong fetching search data." });
  }
}
