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

    // Buscar na playlist
    document.getElementById('playlist-search').addEventListener('input', function () {
        mostrarListaPlaylist(this.value);
    });
});

// Substitua por sua chave de API do YouTube
const YT_API_KEY = 'SUA_API_KEY_AQUI';
const PLAYLIST_ID = 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5';

let playlistVideos = [];

// Busca os vídeos reais da playlist
function buscarVideosPlaylist(callback) {
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}`)
        .then(res => res.json())
        .then(data => {
            playlistVideos = (data.items || []).map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                author: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || ''
            }));
            if (callback) callback();
        })
        .catch(() => {
            // fallback: mantém lista fixa se erro
            if (callback) callback();
        });
}

// Modal playlist
function abrirModalPlaylist() {
    document.getElementById('playlist-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('playlist-search').value = '';
    document.getElementById('playlist-search').focus();
    if (playlistVideos.length === 0) {
        buscarVideosPlaylist(() => mostrarListaPlaylist(''));
    } else {
        mostrarListaPlaylist('');
    }
}

function fecharModalPlaylist() {
    document.getElementById('playlist-modal').style.display = 'none';
    document.body.style.overflow = '';
}

function mostrarListaPlaylist(filtro) {
    const ul = document.getElementById('playlist-list');
    ul.innerHTML = '';
    const termo = filtro.trim().toLowerCase();
    playlistVideos
        .filter(v => v.title.toLowerCase().includes(termo))
        .forEach(v => {
            const li = document.createElement('li');
            li.textContent = `${v.title} — ${v.author}`;
            li.onclick = () => {
                fecharModalPlaylist();
                if (window.player && typeof window.player.loadVideoById === 'function') {
                    window.player.loadVideoById(v.id);
                }
            };
            ul.appendChild(li);
        });
}

// Função para formatar tempo em mm:ss
function formatarTempo(segundos) {
    segundos = Math.floor(segundos);
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
