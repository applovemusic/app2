// Carrega a YouTube IFrame API dinamicamente
function loadYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) {
        callback();
        return;
    }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = callback;
    document.body.appendChild(tag);
}

let player;
let videoTitle = '';
let videoAuthor = '';
let duration = 0;

// Função para inserir o player do YouTube na div .midia
function mostrarPlaylist() {
    const midiaDiv = document.querySelector('.midia');
    midiaDiv.innerHTML = '<div id="yt-player"></div>';
    loadYouTubeAPI(() => {
        player = new YT.Player('yt-player', {
            width: '100%',
            height: '100%',
            videoId: 'xiN4EOqpvwc',
            playerVars: {
                list: 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5',
                rel: 0,
                autoplay: 0,
                controls: 0,
                enablejsapi: 1,
                modestbranding: 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    });
}

function onPlayerReady(event) {
    atualizarInfo();
    atualizarTempo();
}

function onPlayerStateChange(event) {
    atualizarInfo();
}

function atualizarInfo() {
    // Tenta capturar título e autor
    try {
        videoTitle = player.getVideoData().title || '';
        videoAuthor = player.getVideoData().author || '';
        duration = player.getDuration() || 0;
    } catch (e) {}
    document.getElementById('info-video').textContent = videoTitle;
    document.getElementById('info-artista').textContent = videoAuthor;
    document.getElementById('duration').textContent = formatarTempo(duration);
}

function atualizarTempo() {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const current = player.getCurrentTime();
    document.getElementById('current-time').textContent = formatarTempo(current);
    document.getElementById('duration').textContent = formatarTempo(duration);
    // Atualiza barra de progresso
    const percent = duration ? (current / duration) * 100 : 0;
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = percent;
    progressBar.style.setProperty('--progress', percent + '%');
    progressBar.style.background = `linear-gradient(to right, #e53935 ${percent}%, #333 ${percent}%)`;
    // Atualiza a cada 500ms
    setTimeout(atualizarTempo, 500);
}

// Permite clicar na barra para buscar no vídeo
document.addEventListener('DOMContentLoaded', () => {
    mostrarPlaylist();

    document.getElementById('progress-bar').addEventListener('input', function () {
        if (player && duration) {
            const seekTo = (this.value / 100) * duration;
            player.seekTo(seekTo, true);
        }
    });

    // Botões de controle
    document.getElementById('play-pause').addEventListener('click', () => {
        if (!player) return;
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            document.getElementById('icon-play').style.display = '';
            document.getElementById('icon-pause').style.display = 'none';
        } else {
            player.playVideo();
            document.getElementById('icon-play').style.display = 'none';
            document.getElementById('icon-pause').style.display = '';
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        if (player) player.nextVideo();
    });

    document.getElementById('previous').addEventListener('click', () => {
        if (player) player.previousVideo();
    });

    // Abrir modal ao clicar no botão playlist
    document.getElementById('playlist').addEventListener('click', abrirModalPlaylist);

    // Fechar modal ao clicar no botão fechar
    document.getElementById('close-modal').addEventListener('click', fecharModalPlaylist);

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModalPlaylist();
    });

    // A busca não faz nada, pois não há lista
    document.getElementById('playlist-search').addEventListener('input', function () {
        // Não faz nada
    });
});

// Modal playlist
function abrirModalPlaylist() {
    document.getElementById('playlist-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('playlist-search').value = '';
    document.getElementById('playlist-search').focus();

    // Captura dados do vídeo atual do player
    let titulo = '';
    let autor = '';
    if (window.player && typeof window.player.getVideoData === 'function') {
        const data = window.player.getVideoData();
        titulo = data.title || '';
        autor = data.author || '';
    }

    // Exibe informações do vídeo atual no modal
    document.getElementById('playlist-list').innerHTML =
        `<li><strong>Título:</strong> ${titulo}</li>
         <li><strong>Artista:</strong> ${autor}</li>
         <li style="text-align:center;color:#aaa;">Use os controles do player para navegar pela playlist.</li>`;
}

function fecharModalPlaylist() {
    document.getElementById('playlist-modal').style.display = 'none';
    document.body.style.overflow = '';
}

// Função para formatar tempo em mm:ss
function formatarTempo(segundos) {
    segundos = Math.floor(segundos);
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
