// netlify/functions/moderateLyrics.js
export async function handler(event) {
  const { lyrics } = JSON.parse(event.body || "{}");
  if (!lyrics) {
    return { statusCode: 400, body: "Missing lyrics" };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: lyrics
      })
    });

    const data = await res.json();

    return {
      statusCode: res.ok ? 200 : res.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
