// netlify/functions/getLyrics.js
export async function handler(event) {
  const { track, artist } = JSON.parse(event.body || "{}");
  if (!track || !artist) {
    return { statusCode: 400, body: "Missing track or artist" };
  }

  const res = await fetch("https://api.audd.io/findLyrics/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: `${track} ${artist}`,
      api_token: process.env.AUDD_API_KEY
    })
  });

  const data = await res.json();
  return {
    statusCode: res.ok ? 200 : res.status,
    body: JSON.stringify(data)
  };
}
