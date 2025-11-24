/**
 * virtual-reality.js - Archivo principal de inicialización
 * 
 * Este archivo:
 * - Inicializa todas las clases necesarias
 * - Conecta los diferentes módulos
 * - Configura los handlers de eventos
 * 
 * Para personalizar: modifica la configuración al inicio
 */

(function() {
	'use strict';

	// ============================================
	// CONFIGURACIÓN
	// ============================================
	// Modifica estos valores para personalizar la experiencia
	
	var CONFIG = {
		sphereRadius: 5,        // Radio de la esfera 3D
		enableModal: true        // Habilitar modal para galerías
	};

	// Permitir configuración externa (legacy)
	if (window.VR_CONFIG) {
		CONFIG = Object.assign({}, CONFIG, window.VR_CONFIG);
	}

	// ============================================
	// VARIABLES GLOBALES
	// ============================================
	
	var vrScene = null;
	var spotManager = null;
	var modalManager = null;
	var audioManager = null;
	var galleryManager = null;

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
		var container = document.getElementById('container');
		var video = document.getElementById('video');
		var spotsRoot = document.getElementById('spots-container');
		var modal = document.getElementById('spot-modal');

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
			container: container,
			video: video
		});
		vrScene.init();

		// 2. Gestor de spots
		spotManager = new SpotManager(spotsRoot, vrScene);
		spotManager.init();

		// 3. Gestor de modal
		modalManager = new ModalManager(modal, vrScene);
		modalManager.init();

		// 4. Gestor de audio
		audioManager = new AudioManager();

		// 5. Gestor de galerías
		galleryManager = new GalleryManager();

		// ============================================
		// CONFIGURAR HANDLERS DE COMANDOS
		// ============================================

		// Handler para abrir modal (galerías)
		spotManager.onCommand('open-spot-modal', function(spot) {
			if (!CONFIG.enableModal) {
				return;
			}

			// Renderizar contenido según el tipo
			var content = null;
			if (spot.type === 'gallery') {
				content = galleryManager.renderContent(spot.target);
			}

			// Abrir modal
			modalManager.open(spot, function(spot) {
				return content;
			});

			// Inicializar Swiper si es galería
			if (spot.type === 'gallery' && content) {
				galleryManager.initialize(modalManager.modalContent);
			}
		});

		// Handler para toggle de audio
		spotManager.onCommand('toggle-audio', function(spot) {
			if (spot.target) {
				audioManager.toggle(spot.target);
			}
		});

		// Handler para cerrar modal
		spotManager.onCommand('close-spot-modal', function() {
			modalManager.close();
		});
	}

	// ============================================
	// FUNCIONES AUXILIARES
	// ============================================

	// ============================================
	// INICIAR APLICACIÓN
	// ============================================
	
	init();

})();
