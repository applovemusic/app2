let player;
let progressInterval = null;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
  height: "100%",
  width: "100%",
  playerVars: {
    autoplay: 0,
    controls: 0,
    enablejsapi: 1,
    modestbranding: 1,
    rel: 0,
    playlist: "PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5"
  },
  events: {
    onReady: onPlayerReady,
    onStateChange: onPlayerStateChange
  }
});

}

function onPlayerReady(event) {
  setupControls();
  updateProgressBar();
  progressInterval = setInterval(updateProgressBar, 1000);
}

function onPlayerStateChange(event) {
  // Pode adicionar lógica para mudar ícones de play/pause, se quiser
}

function setupControls() {
  document.getElementById("btn-play").addEventListener("click", () => {
    player.playVideo();
  });

  document.getElementById("btn-pause").addEventListener("click", () => {
    player.pauseVideo();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    player.nextVideo();
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    player.previousVideo();
  });
}

function updateProgressBar() {
  if (player && player.getDuration) {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    const progressPercent = (currentTime / duration) * 100;

    const progressEl = document.querySelector(".progress");
    const timeEl = document.querySelector(".current-time");
    const durationEl = document.querySelector(".duration");

    if (progressEl) progressEl.style.width = `${progressPercent}%`;
    if (timeEl) timeEl.textContent = formatTime(currentTime);
    if (durationEl) durationEl.textContent = formatTime(duration);
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
