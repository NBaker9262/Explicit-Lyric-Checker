document.getElementById("search").addEventListener("input", async (e) => {
  const query = e.target.value;
  if (query.length < 3) return;

  const res = await fetch("/.netlify/functions/searchSpotify", {
    method: "POST",
    body: JSON.stringify({ query })
  });
  const data = await res.json();

  const resultsEl = document.getElementById("results");
  resultsEl.innerHTML = "";

  if (data.tracks && data.tracks.items) {
    data.tracks.items.forEach(track => {
      const li = document.createElement("li");
      li.textContent = `${track.name} — ${track.artists[0].name}`;
      li.addEventListener("click", () => handleSongClick(track));
      resultsEl.appendChild(li);
    });
  }
});

async function handleSongClick(track) {
  const trackName = track.name;
  const artistName = track.artists[0].name;

  // Fetch lyrics
  const lyricsRes = await fetch("/.netlify/functions/getLyrics", {
    method: "POST",
    body: JSON.stringify({ track: trackName, artist: artistName })
  });
  const lyricsData = await lyricsRes.json();
  const lyrics = lyricsData.result?.[0]?.lyrics || "Lyrics not found.";
  document.getElementById("lyrics").textContent = lyrics;

  // Moderate lyrics
  const modRes = await fetch("/.netlify/functions/moderateLyrics", {
    method: "POST",
    body: JSON.stringify({ lyrics })
  });
  const modData = await modRes.json();
  document.getElementById("moderation").textContent = JSON.stringify(modData, null, 2);
}
