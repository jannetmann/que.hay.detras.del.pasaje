// Obtener elementos del DOM
const container = document.getElementById('container');
const video = document.getElementById('video');
const spotsRoot = document.getElementById('spots-container');
const enterBtn = document.getElementById('intro-btn');
const bgAudio = document.getElementById('bg-audio'); 

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
    // animaciones
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

    // AUDIO DE FONDO (ruido lejano de cumbias)
    if (bgAudio) {
        bgAudio.loop = true;
        bgAudio.currentTime = 0;
        bgAudio.volume = 0.7; // ajusta si suena muy fuerte
        bgAudio.play().catch(err => {
            console.warn('No se pudo reproducir bg-audio:', err);
        });
    }
});
