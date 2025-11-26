// Botón de audio
const audioBtn = document.getElementById('audio-btn');

// Audios disponibles en este botón:
const audioTracks = [
    './audio/cumbias.y.conversaciones.mias.mp3',   // 1er audio
    './audio/vibracion.claxon.mp3'                 // 2do audio
];

// Elemento <audio> principal que ya está en el HTML
const audio = document.getElementById('audio');

// Audio que suena en la INTRO — debe apagarse cuando se usa el botón
const introAudio = document.getElementById('intro-audio'); // 👈 lo definiremos abajo

let currentTrack = 0; // índice del audio actual

function toggleAudio() {

    // Si el audio de ENTRAR está sonando → apagarlo
    if (introAudio && !introAudio.paused) {
        introAudio.pause();
        introAudio.currentTime = 0;
    }

    // Si el botón NO está activo → reproducir audio
    if (!audioBtn.classList.contains('is-active')) {
        audioBtn.classList.add('is-active');

        audio.src = audioTracks[currentTrack];   // cargar pista actual
        audio.currentTime = 0;
        audio.play();

    } else {
        // Si el botón está activo → cambiar al siguiente audio
        currentTrack = (currentTrack + 1) % audioTracks.length;
        audio.src = audioTracks[currentTrack];
        audio.currentTime = 0;
        audio.play();
    }
}

// Evento del botón
audioBtn.addEventListener('click', toggleAudio);
