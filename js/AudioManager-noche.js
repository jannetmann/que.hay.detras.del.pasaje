document.addEventListener('DOMContentLoaded', () => {
  const audioBtn = document.getElementById('audio-btn');
  const ambientAudio = document.getElementById('ambient-audio');
  const interviewAudio = document.getElementById('interview-audio');

  if (!audioBtn || !ambientAudio || !interviewAudio) return;

  // SOLO ENTREVISTAS DE NOCHE
  const interviews = [
    './entrevistas/joseluis.perez.mp3',    // Entrevista 3
    './entrevistas/manuel.hernandez.mp3'   // Entrevista 4
  ];

  let currentIndex = -1;

  function stopInterview() {
    interviewAudio.pause();
    interviewAudio.currentTime = 0;
  }

  function setStateClass(className) {
    audioBtn.classList.remove('state-1', 'state-2', 'state-3', 'state-4');
    if (className) {
      audioBtn.classList.add(className);
    }
  }

  audioBtn.addEventListener('click', () => {
    // CLICK 1 → Entrevista 3
    if (currentIndex === -1) {
      if (!ambientAudio.paused) {
        ambientAudio.pause();
      }

      currentIndex = 0;
      interviewAudio.src = interviews[currentIndex];
      interviewAudio.currentTime = 0;
      interviewAudio.play().catch(console.warn);

      setStateClass('state-3'); // icono normal

    // CLICK 2 → Entrevista 4
    } else if (currentIndex === 0) {
      stopInterview();

      currentIndex = 1;
      interviewAudio.src = interviews[currentIndex];
      interviewAudio.currentTime = 0;
      interviewAudio.play().catch(console.warn);

      setStateClass('state-4'); // icono invertido

    // CLICK 3 → apagar entrevistas y volver al ambiente
    } else {
      stopInterview();
      currentIndex = -1;
      setStateClass(null);

      ambientAudio.currentTime = 0;
      ambientAudio.play().catch(console.warn);
    }
  });
});






