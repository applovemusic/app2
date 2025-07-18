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
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.nextVideo(); // avança na playlist
  }
}
