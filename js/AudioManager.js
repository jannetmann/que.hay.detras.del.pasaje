const audioBtn = document.getElementById('audio-btn');

const ambientAudio   = document.getElementById('ambient-audio');   // ambiente ENTRAR
const interviewAudio = document.getElementById('interview-audio'); // entrevistas

// Rutas de tus 4 entrevistas
const interviewTracks = [
  './entrevistas/daniel.franco.mp3',
  './entrevistas/felipe.sanchez.mp3',
  './entrevistas/joseluis.perez.mp3',
  './entrevistas/manuel.hernandez.mp3',
];

// -1 = ninguna entrevista sonando
//  0 = Daniel, 1 = Felipe, 2 = José Luis, 3 = Manuel
let interviewIndex = -1;

function stopInterview() {
  if (interviewAudio) {
    interviewAudio.pause();
    interviewAudio.currentTime = 0;
  }
}

// Cambia color del icono según la entrevista
function updateButtonStateClasses() {
  if (!audioBtn) return;

  audioBtn.classList.remove('state-1', 'state-2', 'state-3', 'state-4', 'is-active');

  if (interviewIndex >= 0) {
    audioBtn.classList.add('is-active');
    audioBtn.classList.add(`state-${interviewIndex + 1}`);
  }
}

function toggleAudio() {
  if (!audioBtn || !interviewAudio) return;

  // Siempre que se usa el botón, pausamos el ambiente
  if (ambientAudio) {
    ambientAudio.pause();
  }

  // Pasar a la siguiente entrevista
  interviewIndex++;

  // Si ya pasamos la última → apagamos todo y volvemos al ambiente
  if (interviewIndex >= interviewTracks.length) {
    interviewIndex = -1;
    stopInterview();
    updateButtonStateClasses();

    if (ambientAudio) {
      ambientAudio.currentTime = 0;
      ambientAudio.play().catch(err => console.warn('No se pudo reproducir ambiente:', err));
    }
    return;
  }

  // Cargar y reproducir la entrevista actual
  const src = interviewTracks[interviewIndex];
  interviewAudio.src = src;
  interviewAudio.currentTime = 0;
  interviewAudio.play().catch(err => {
    console.warn('No se pudo reproducir entrevista:', err);
  });

  updateButtonStateClasses();
}

if (audioBtn) {
  audioBtn.addEventListener('click', toggleAudio);
}

// ================== BOTÓN BOCINA (MUTE GLOBAL) ==================

const footerMuteBtn = document.getElementById('footer-audio-btn');
let isMuted = false;

function muteToggle() {
  if (!footerMuteBtn) return;

  if (!isMuted) {
    // 🔇 Silenciar TODO
    if (ambientAudio) {
      ambientAudio.pause();
    }
    if (interviewAudio) {
      interviewAudio.pause();
    }

    footerMuteBtn.classList.add('is-active');
    isMuted = true;
  } else {
    // 🔊 Al volver a pulsar, solo reactivamos ambiente SI no hay entrevista seleccionada
    footerMuteBtn.classList.remove('is-active');
    isMuted = false;

    // Si no hay entrevista activa (interviewIndex = -1), retomamos ambiente
    if (typeof interviewIndex !== 'undefined' && interviewIndex === -1 && ambientAudio) {
      ambientAudio.currentTime = 0;
      ambientAudio.play().catch(console.warn);
    }
    // Si sí había entrevista, se queda en silencio hasta que piques de nuevo el chofer
  }
}

if (footerMuteBtn) {
  footerMuteBtn.addEventListener('click', muteToggle);
}

// ================== DÍA / NOCHE (CAMBIO DE VIDEO) ==================

const dayNightBtn = document.getElementById('day-night-btn');
const videoElem   = document.getElementById('video');

let isNight = false; // false = día, true = noche

if (dayNightBtn && videoElem) {
  dayNightBtn.addEventListener('click', () => {
    isNight = !isNight;

    const desktopSrc = isNight
      ? "https://res.cloudinary.com/dpfqraeom/video/upload/v1763918456/detras-del-pasaje-noche.mp4"
      : "https://res.cloudinary.com/dpfqraeom/video/upload/v1763918447/detras-del-pasaje-dia.mp4";

    const mobileSrc = isNight
      ? "https://res.cloudinary.com/dpfqraeom/video/upload/v1763922699/detras-del-pasaje-noche-mobile.mp4"
      : "https://res.cloudinary.com/dpfqraeom/video/upload/v1763922698/detras-del-pasaje-dia-mobile.mp4";

    // Limpiar <source> anteriores
    while (videoElem.firstChild) {
      videoElem.removeChild(videoElem.firstChild);
    }

    // Crear source de escritorio
    const sourceDesktop = document.createElement('source');
    sourceDesktop.src = desktopSrc;
    sourceDesktop.media = "(min-width: 769px)";

    // Crear source de móvil
    const sourceMobile = document.createElement('source');
    sourceMobile.src = mobileSrc;
    sourceMobile.media = "(max-width: 768px)";

    videoElem.appendChild(sourceDesktop);
    videoElem.appendChild(sourceMobile);

    // Recargar y reproducir
    videoElem.load();
    videoElem.play().catch(err => console.warn('No se pudo reproducir el video:', err));

    // (Opcional) cambiar estilo del botón según modo
    if (isNight) {
      dayNightBtn.classList.add('is-night');
    } else {
      dayNightBtn.classList.remove('is-night');
    }
  });
}


