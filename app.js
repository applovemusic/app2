const API_KEY = "SUA_CHAVE_DE_API";
const PLAYLIST_ID = "PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5";
const MAX_RESULTS = 10;

async function fetchPlaylistItems() {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_RESULTS}&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  const playlistSection = document.querySelector(".playlist");
  playlistSection.innerHTML = ""; // Limpa conteúdo anterior

  data.items.forEach(item => {
    const title = item.snippet.title;
    const videoId = item.snippet.resourceId.videoId;

    const track = document.createElement("div");
    track.className = "track";
    track.textContent = title;
    track.dataset.videoId = videoId;

    playlistSection.appendChild(track);
  });
}

fetchPlaylistItems();


document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.querySelector("iframe");
  const playerWindow = iframe.contentWindow;

  function sendCommand(command) {
    playerWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "*"
    );
  }

  document.getElementById("btn-play").addEventListener("click", () => {
    sendCommand("playVideo");
  });

  document.getElementById("btn-pause").addEventListener("click", () => {
    sendCommand("pauseVideo");
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    sendCommand("nextVideo");
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    sendCommand("previousVideo");
  });
});

let isPlayerReady = false;

window.addEventListener("message", (event) => {
  if (typeof event.data === "string" && event.data.indexOf("onReady") > -1) {
    isPlayerReady = true;
  }
});

function sendCommand(command) {
  if (isPlayerReady) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "*"
    );
  } else {
    console.warn("Player ainda não está pronto!");
  }
}
