export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { path, ...params } = req.query;
  if (!path) { res.status(400).json({ error: 'No path' }); return; }

  const query = new URLSearchParams(params).toString();
  const url = `https://free-api-live-football-data.p.rapidapi.com/${path}${query ? '?' + query : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': process.env.RAPID_KEY,
        'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
