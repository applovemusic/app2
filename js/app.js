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
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.nextVideo(); // avança na playlist
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
