import fetch from "node-fetch";

export async function handler(event) {
  const { track, artist } = event.queryStringParameters;
  if (!track || !artist) {
    return { statusCode: 400, body: "Missing track or artist" };
  }

  try {
    // === Step 1: Get lyrics from AudD ===
    const auddRes = await fetch("https://api.audd.io/findLyrics/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        q: `${track} ${artist}`,
        api_token: process.env.AUDD_API_KEY,
      }),
    });

    const auddData = await auddRes.json();
    const lyrics = auddData.result?.[0]?.lyrics || "Lyrics not found";

    // === Step 2: Run moderation with OpenAI ===
    const moderationRes = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: lyrics,
      }),
    });

    const moderationData = await moderationRes.json();

    // Decide if safe or flagged
    const flagged = moderationData.results?.[0]?.flagged || false;

    return {
      statusCode: 200,
      body: JSON.stringify({
        track,
        artist,
        lyrics,
        safe: !flagged,
        moderation: moderationData,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
