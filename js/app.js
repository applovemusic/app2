let player;
const playlistId = 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5';
const initialVideoId = 'xiN4EOqpvwc';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-frame', {
    height: '100%',
    width: '100%',
    videoId: initialVideoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      disablekb: 1,
      listType: 'playlist',
      list: playlistId,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  setupCustomControls(); // ativar controles personalizados
  updateVideoInfo(); // Atualiza título/autor ao iniciar
  //Atualizar a barra a cada 500ms
  setInterval(() => {
  if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
    updateProgressBar();
  }
}, 500);

  enableSeekBar();

}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.nextVideo(); // avança na playlist
  }
  if (event.data === YT.PlayerState.PLAYING) {
    setTimeout(updateVideoInfo, 500); //exibe titulo e artista
  }
}

//Função para controlar o player via botões personalizados
function setupCustomControls() {
  const btnPlay = document.querySelector('img[src*="play.svg"]');
  const btnNext = document.querySelector('img[src*="next.svg"]');
  const btnPrev = document.querySelector('img[src*="prev.svg"]');
  const btnShuffle = document.querySelector('img[src*="shuffle.svg"]');

  btnPlay?.addEventListener('click', () => {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  btnNext?.addEventListener('click', () => {
    player.nextVideo();
  });

  btnPrev?.addEventListener('click', () => {
    player.previousVideo();
  });

  btnShuffle?.addEventListener('click', () => {
    const playlist = player.getPlaylist();
    const randomIndex = Math.floor(Math.random() * playlist.length);
    player.playVideoAt(randomIndex);
  });
}
//Função para capturar título e artista do vídeo atual
function updateVideoInfo() {
  const data = player.getVideoData();
  const titleEl = document.querySelector('.video-title');
  const artistEl = document.querySelector('.video-artist');

  if (titleEl) titleEl.textContent = data.title || 'Titulo';
  if (artistEl) artistEl.textContent = data.author || 'Artista';
}
//Função para atualizar a barra de progresso em tempo real
function updateProgressBar() {
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const progressEl = document.querySelector('.progress');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');

  if (!duration || !progressEl) return;

  const percent = (currentTime / duration) * 100;
  progressEl.style.width = `${percent}%`;

  if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
  if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
}
//Função para formatar tempo (ex: 2:03)
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}
//Permitir clique na barra para pular no vídeo
function enableSeekBar() {
  const barEl = document.querySelector('.bar');

  barEl?.addEventListener('click', (e) => {
    const rect = barEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const duration = player.getDuration();
    const newTime = percent * duration;

    player.seekTo(newTime, true);
  });
}
