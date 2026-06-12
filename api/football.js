export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') { 
    res.status(200).end(); 
    return; 
  }

  const { path, ...params } = req.query;
  if (!path) { res.status(400).json({ error: 'No path provided' }); return; }

  const queryParts = Object.entries(params)
    .filter(([k, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  
  const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : '';
  const url = `https://free-api-live-football-data.p.rapidapi.com/${path}${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPID_KEY,
        'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
