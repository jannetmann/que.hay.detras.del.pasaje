/**
 * virtual-reality.js - Archivo principal de inicialización
 * 
 * Este archivo:
 * - Inicializa todas las clases necesarias
 * - Conecta los diferentes módulos
 * - Configura los managers para manejar eventos
 * 
 * Para personalizar: modifica la configuración al inicio
 */

import { VRScene } from './VRScene.js';
import { SpotManager } from './SpotManager.js';
import { ModalManager } from './ModalManager.js';
import { AudioManager } from './AudioManager.js';
import { GalleryManager } from './GalleryManager.js';

// ============================================
// CONFIGURACIÓN
// ============================================
// Modifica estos valores para personalizar la experiencia

const CONFIG = {
	sphereRadius: 5,        // Radio de la esfera 3D
	enableModal: true        // Habilitar modal para galerías
};

// ============================================
// VARIABLES GLOBALES
// ============================================

let vrScene = null;
let spotManager = null;
let modalManager = null;
let audioManager = null;
let galleryManager = null;

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa toda la aplicación
 */
function init() {
	// Esperar a que el DOM esté listo
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
		return;
	}

	// Obtener elementos del DOM
	const container = document.getElementById('container');
	const video = document.getElementById('video');
	const spotsRoot = document.getElementById('spots-container');
	const modal = document.getElementById('spot-modal');

	// Verificar elementos necesarios
	if (!container) {
		throw new Error('Container element with id "container" not found');
	}

	if (!video) {
		throw new Error('Video element with id "video" not found');
	}

	// ============================================
	// INICIALIZAR CLASES
	// ============================================

	// 1. Escena VR (Three.js)
	vrScene = new VRScene({
		sphereRadius: CONFIG.sphereRadius,
		container,
		video
	});
	vrScene.init();

	// 2. Gestor de modal
	modalManager = new ModalManager(modal, vrScene);
	modalManager.init();

	// 3. Gestor de spots
	spotManager = new SpotManager(spotsRoot, vrScene);
	spotManager.init();

	// 4. Gestor de audio
	audioManager = new AudioManager();
	spotManager.registerManager('audio', audioManager);

	// 5. Gestor de galerías
	galleryManager = new GalleryManager(modalManager);
	spotManager.registerManager('gallery', galleryManager);
}

// ============================================
// INICIAR APLICACIÓN
// ============================================

init();