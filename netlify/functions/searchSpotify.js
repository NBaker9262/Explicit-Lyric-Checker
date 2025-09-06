// netlify/functions/searchSpotify.js
export async function handler(event) {
  const { query } = JSON.parse(event.body || "{}");
  if (!query) {
    return { statusCode: 400, body: "Missing query" };
  }

  // Get token
  const tokenRes = await fetch(`${process.env.URL}/.netlify/functions/getSpotifyToken`);
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  const data = await res.json();
  return {
    statusCode: res.ok ? 200 : res.status,
    body: JSON.stringify(data)
  };
}
