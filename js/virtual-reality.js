// Obtener elementos del DOM
const container = document.getElementById('container');
const video = document.getElementById('video');
const spotsRoot = document.getElementById('spots-container');
const enterBtn = document.getElementById('intro-btn');
const ambientAudio = document.getElementById('ambient-audio');
const dragHint = document.getElementById('drag-hint');


// Después de agregar el canvas al DOM
const canvas = container.querySelector('canvas');
let hasDragged = false;

if (canvas) {
  canvas.addEventListener('pointerdown', () => {
    canvas.classList.add('is-dragging');
  });

  canvas.addEventListener('pointerup', () => {
    canvas.classList.remove('is-dragging');

    if (!hasDragged) {
      hasDragged = true;
      if (dragHint) {
        dragHint.classList.remove('is-visible');  // ocultar mensaje
      }
    }
  });

  canvas.addEventListener('pointerleave', () => {
    canvas.classList.remove('is-dragging');
  });
}


import { VRScene } from './VRScene.js';
import { SpotManager } from './SpotManager.js';

// Inicializar escena VR
const vrScene = new VRScene({
	sphereRadius: 5,
	container,
	video
});
vrScene.init();

// Inicializar gestor de spots
const spotManager = new SpotManager(spotsRoot, vrScene);
spotManager.init();

enterBtn.addEventListener('click', () => {
  gsap.to("#intro-container", {
    duration: 1,
    opacity: 0,
    display: 'none',
  });

  gsap.to("#spots-container", {
    duration: 1,
    opacity: 1,
    display: 'block',
  });

  // 👇 Mostrar pista de arrastre después de entrar
  if (dragHint) {
    dragHint.classList.add('is-visible');
  }
});

  // Ocultar la pista cuando el usuario interactúe por primera vez con el 360
if (dragHint && container) {
  container.addEventListener('pointerdown', () => {
    dragHint.classList.add('is-hidden');
  }, { once: true }); // solo la primera vez
}


  // AUDIO AMBIENTE
  if (ambientAudio) {
    ambientAudio.currentTime = 0;
    ambientAudio.play().catch(err => {
      console.warn('No se pudo reproducir el audio de ambiente:', err);
    });
  }

const introAudio = document.getElementById('intro-audio');

enterBtn.addEventListener('click', () => {

    // Reproducir audio de entrada
    introAudio.currentTime = 0;
    introAudio.loop = true;
    introAudio.play().catch(err => console.log(err));

    // animaciones...
});

// =======================
// Ocultar aviso al primer drag
// =======================
if (container && dragHint) {
  const hideHint = () => {
    dragHint.classList.remove('is-visible');
  };

  // Se dispara solo una vez, en el primer intento de arrastrar
  container.addEventListener('pointerdown', hideHint, { once: true });
}

