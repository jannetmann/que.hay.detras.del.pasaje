const audioBtn = document.getElementById('audio-btn');
const audio = document.getElementById('audio');       // cumbias.y.conversaciones...
const bgAudio = document.getElementById('bg-audio');  // ruido.lejano.de.cumbias

function toggleAudio() {
    if (audio.paused) {
        // al activar el botón AUDIO:
        // 1) marcamos activo
        audioBtn.classList.add('is-active');

        // 2) detenemos el audio de fondo si está sonando
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
            bgAudio.currentTime = 0;
        }

        // 3) reproducimos el audio principal
        audio.currentTime = 0;
        audio.play();
    } else {
        // al desactivar el botón AUDIO:
        audioBtn.classList.remove('is-active');
        audio.pause();
        // aquí NO reanudamos el bg-audio (a menos que tú quieras)
    }
}

if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
}
