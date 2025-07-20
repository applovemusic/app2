// 1. Carregar a API do YouTube async
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// 2. Cria o player depois que a API estiver pronta
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '1OgQdgSQB3o',
    playerVars: {
      playlist: 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5',
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      controls: 1,
      loop: 1
    },
    events: {
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}
