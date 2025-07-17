let player;
let isPlaying = false;
let playlistLoaded = false;
let playlistOverlay;
let progressInterval;

const playlistId = 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5';
const qualidadeFixa = 'medium';

const resolucoes = {
  tiny: '144p', small: '240p', medium: '360p', large: '480p',
  hd720: '720p', hd1080: '1080p', highres: '1080p+', default: 'Desconhecida'
};

document.addEventListener("DOMContentLoaded", () => {
  playlistOverlay = document.getElementById('playlist-overlay');
  carregarAPIYoutube();
});

function carregarAPIYoutube() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('music-player', {
    height: '100%', width: '100%',
    playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
    events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange }
  });
};

function onPlayerReady() {
  setupControles();

  player.loadPlaylist({ list: playlistId, index: 0 });
  esperarPlaylistCarregar();

  progressInterval = setInterval(() => {
    if (player && player.getCurrentTime) atualizarBarraProgresso();
  }, 1000);
}

function esperarPlaylistCarregar() {
  const timeout = 15000;
  let tempoDecorrido = 0;

  const interval = setInterval(() => {
    const lista = player.getPlaylist();
    if (Array.isArray(lista) && lista.length > 0) {
      playlistLoaded = true;
      atualizarQualidade();
      clearInterval(interval);
    } else if (tempoDecorrido >= timeout) {
      console.warn("Playlist não carregada. Recarregando.");
      clearInterval(interval);
      location.reload();
    }
    tempoDecorrido += 500;
  }, 500);
}

function atualizarQualidade() {
  let tentativas = 0;
  const maxTentativas = 5;
  const intQualidade = setInterval(() => {
    if (tentativas >= maxTentativas) return clearInterval(intQualidade);

    try {
      player.setPlaybackQuality(qualidadeFixa);
      const label = document.getElementById('quality-label');
      if (label) {
        label.innerText = `Qualidade: ${resolucoes[qualidadeFixa]}`;
      }
      console.log(`Qualidade forçada: ${qualidadeFixa}`);
    } catch (e) {
      console.error("Erro forçando qualidade:", e);
    }
    tentativas++;
  }, 1000);
}

function setupControles() {
  document.getElementById('play-btn').addEventListener('click', togglePlayPause);
  document.getElementById('next-btn').addEventListener('click', () => player.nextVideo());
  document.getElementById('prev-btn').addEventListener('click', () => player.previousVideo());
  document.getElementById('open-playlist-btn').addEventListener('click', () => playlistOverlay.style.display = 'flex');
  document.getElementById('close-playlist-btn').addEventListener('click', () => playlistOverlay.style.display = 'none');
}

function togglePlayPause() {
  if (!playlistLoaded) return;

  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
  isPlaying = !isPlaying;
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    atualizarTitulo();
  }
}

function atualizarTitulo() {
  const d = player.getVideoData();
  document.getElementById('title').textContent = d.title || "";
  document.getElementById('artist').textContent = d.author || "";
}

function atualizarBarraProgresso() {
  const progress = document.getElementById('progress');
  const current = document.getElementById('current-time');
  const duration = document.getElementById('duration');

  const dur = player.getDuration();
  const cur = player.getCurrentTime();

  if (dur > 0) {
    progress.value = (cur / dur) * 100;
    current.textContent = formatarTempo(cur);
    duration.textContent = formatarTempo(dur);
  }
}

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
