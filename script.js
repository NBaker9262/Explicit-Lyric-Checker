const searchInput = document.getElementById("search");
const resultsList = document.getElementById("results");
const outputDiv = document.getElementById("output");

let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  const query = searchInput.value.trim();
  if (!query) {
    resultsList.innerHTML = "";
    return;
  }
  debounceTimer = setTimeout(() => searchSpotify(query), 300);
});

async function searchSpotify(query) {
  const res = await fetch(`/.netlify/functions/search?q=${encodeURIComponent(query)}`);
  const tracks = await res.json();

  resultsList.innerHTML = "";
  tracks.forEach((t) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${t.albumArt}" width="40"/> ${t.name} – ${t.artist}`;
    li.addEventListener("click", () => fetchLyrics(t.name, t.artist));
    resultsList.appendChild(li);
  });
}

async function fetchLyrics(track, artist) {
  outputDiv.innerHTML = "Loading lyrics and moderation...";
  const res = await fetch(`/.netlify/functions/lyrics?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
  const data = await res.json();

  outputDiv.innerHTML = `
    <h2>${data.track} – ${data.artist}</h2>
    <pre>${data.lyrics}</pre>
    <h3>Moderation Result:</h3>
    <p>${data.safe ? "✅ Safe" : "⚠️ Contains inappropriate content"}</p>
    <details>
      <summary>Raw moderation JSON</summary>
      <pre>${JSON.stringify(data.moderation, null, 2)}</pre>
    </details>
  `;
}
