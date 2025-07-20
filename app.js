// Função para inserir o player do YouTube na div .midia
function mostrarPlaylist() {
    const midiaDiv = document.querySelector('.midia');
    // Limpa conteúdo anterior
    midiaDiv.innerHTML = '';
    // Cria o iframe do YouTube com playlist e vídeo inicial
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.minHeight = "300px";
    iframe.style.background = "#000";
    iframe.style.border = "none";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    // Remover controles do player
    iframe.src = "https://www.youtube.com/embed/xiN4EOqpvwc?list=PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5&rel=0&autoplay=0&controls=0&enablejsapi=1";
    iframe.id = "youtube-player";
    midiaDiv.appendChild(iframe);
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarPlaylist();

    // Funções de controle usando postMessage para o iframe do YouTube
    function sendCommand(command, args = {}) {
        const iframe = document.getElementById('youtube-player');
        if (!iframe) return;
        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            ...args
        }), '*');
    }

    // Alternar ícone play/pause
    function togglePlayPauseIcon(isPlaying) {
        document.getElementById('icon-play').style.display = isPlaying ? 'none' : '';
        document.getElementById('icon-pause').style.display = isPlaying ? '' : 'none';
    }

    let isPlaying = false;

    document.getElementById('play-pause').addEventListener('click', () => {
        if (isPlaying) {
            sendCommand('pauseVideo');
        } else {
            sendCommand('playVideo');
        }
        isPlaying = !isPlaying;
        togglePlayPauseIcon(isPlaying);
    });

    document.getElementById('next').addEventListener('click', () => {
        sendCommand('nextVideo');
        isPlaying = true;
        togglePlayPauseIcon(isPlaying);
    });

    document.getElementById('previous').addEventListener('click', () => {
        sendCommand('previousVideo');
        isPlaying = true;
        togglePlayPauseIcon(isPlaying);
    });
});
