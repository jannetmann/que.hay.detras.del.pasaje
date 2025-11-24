// Obtener elementos del DOM
const container = document.getElementById('container');
const video = document.getElementById('video');
const spotsRoot = document.getElementById('spots-container');
const enterBtn = document.getElementById('intro-btn');

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
});