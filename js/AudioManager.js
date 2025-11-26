const audioBtn = document.getElementById('audio-btn');

const ambientAudio = document.getElementById('ambient-audio');        // el de ENTRAR
const audioConversaciones = document.getElementById('audio-conversaciones'); // audio 1
const audioClaxon = document.getElementById('audio-claxon');          // audio 2

// 0 = nada, 1 = conversaciones, 2 = claxon
let audioState = 0;

function stopAllButtonAudios() {
  if (audioConversaciones) {
    audioConversaciones.pause();
    audioConversaciones.currentTime = 0;
  }
  if (audioClaxon) {
    audioClaxon.pause();
    audioClaxon.currentTime = 0;
  }
}

function toggleAudio() {
  if (!audioBtn) return;

  // siempre que usamos el botón Audio, pausamos el ambiente
  if (ambientAudio) {
    ambientAudio.pause();
  }

  if (audioState === 0) {
    // PRIMER CLICK -> conversaciones
    stopAllButtonAudios();
    if (audioConversaciones) {
      audioConversaciones.currentTime = 0;
      audioConversaciones.play().catch(console.warn);
    }
    audioBtn.classList.add('is-active');
    audioState = 1;

  } else if (audioState === 1) {
    // SEGUNDO CLICK -> claxon
    stopAllButtonAudios();
    if (audioClaxon) {
      audioClaxon.currentTime = 0;
      audioClaxon.play().catch(console.warn);
    }
    audioBtn.classList.add('is-active');
    audioState = 2;

  } else {
    // TERCER CLICK -> apagar audios del botón y (opcional) volver al ambiente
    stopAllButtonAudios();
    audioBtn.classList.remove('is-active');
    audioState = 0;

    if (ambientAudio) {
      ambientAudio.currentTime = 0;
      ambientAudio.play().catch(console.warn);
    }
  }
}

if (audioBtn) {
  audioBtn.addEventListener('click', toggleAudio);
}

