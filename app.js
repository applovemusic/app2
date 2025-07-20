// Função para inserir o player do YouTube na div .midia
function mostrarPlaylist() {
    const midiaDiv = document.querySelector('.midia');
    // Limpa conteúdo anterior
    midiaDiv.innerHTML = '';
    // Cria o iframe do YouTube com playlist e vídeo inicial
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube.com/embed/xiN4EOqpvwc?list=PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5&rel=0&autoplay=0`;
    midiaDiv.appendChild(iframe);
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', mostrarPlaylist);
