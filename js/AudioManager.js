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


