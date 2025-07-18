document.addEventListener('DOMContentLoaded', () => {
  const controls = {
    shuffle: document.querySelector('[data-control="shuffle"]'),
    prev: document.querySelector('[data-control="prev"]'),
    play: document.querySelector('[data-control="play"]'),
    next: document.querySelector('[data-control="next"]'),
    playlist: document.querySelector('[data-control="playlist"]'),
  };

  let isShuffle = false;
  let isPlaying = false;

  // Troca ícone SVG <use>
  function setIcon(button, iconId) {
    const use = button.querySelector('use');
    if (use) {
      use.setAttribute('href', `icons/icons.svg#${iconId}`);
    }
  }

  // Shuffle
  controls.shuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    controls.shuffle.classList.toggle('active', isShuffle);
    setIcon(controls.shuffle, isShuffle ? 'shuffle' : 'repeat');
  });

  // Previous
  controls.prev.addEventListener('click', () => {
    console.log('Voltar para faixa anterior');
  });

  // Play/Pause
  controls.play.addEventListener('click', () => {
    isPlaying = !isPlaying;
    controls.play.classList.toggle('active', isPlaying);
    setIcon(controls.play, isPlaying ? 'pause' : 'play');
  });

  // Next
  controls.next.addEventListener('click', () => {
    console.log('Avançar para próxima faixa');
  });

  // Playlist
  controls.playlist.addEventListener('click', () => {
    console.log('Abrir modal da playlist');
  });
});
