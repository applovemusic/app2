let videoIds = [];
let currentIndex = 0;

function loadPlaylist() {
  const playlistSection = document.querySelector(".playlist");
  playlistSection.innerHTML = "";

  // Exemplo fixo de vídeos; em um cenário real, poderia ser carregado de um JSON local ou servidor próprio
  videoIds = [
    "M7lc1UVf-VE",
    "dQw4w9WgXcQ",
    "e-ORhEE9VVg"
  ];

  videoIds.forEach((videoId, index) => {
    const track = document.createElement("div");
    track.className = "track";
    track.textContent = `Vídeo ${index + 1}`;
    track.dataset.index = index;
    track.addEventListener("click", () => {
      currentIndex = index;
      loadVideo(videoIds[currentIndex]);
    });
    playlistSection.appendChild(track);
  });

  if (videoIds.length > 0) {
    loadVideo(videoIds[currentIndex]);
  }
}

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "360",
    width: "640",
    videoId: "",
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady() {
  setupControls();
}

function loadVideo(videoId) {
  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  }
}

function setupControls() {
  document.getElementById("btn-play").addEventListener("click", () => {
    if (player) player.playVideo();
  });

  document.getElementById("btn-pause").addEventListener("click", () => {
    if (player) player.pauseVideo();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    if (videoIds.length > 0) {
      currentIndex = (currentIndex + 1) % videoIds.length;
      loadVideo(videoIds[currentIndex]);
    }
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    if (videoIds.length > 0) {
      currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
      loadVideo(videoIds[currentIndex]);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlaylist();
});
