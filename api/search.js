// api/search.js
export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Missing query' });

    const API_KEY = process.env.GOOGLE_API_KEY || process.env.API_KEY;
    const CX = process.env.CX;
    if (!API_KEY || !CX) {
      return res.status(500).json({ error: 'Search API key or CX missing' });
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    const data = await r.json();

    // Normalize to only include title, link, snippet
    const items = (data.items || []).map(item => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || ''
    }));

    res.status(200).json({ results: items });
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
      }
