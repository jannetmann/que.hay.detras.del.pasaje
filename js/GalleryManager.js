/**
 * GalleryManager - Clase para manejar las galerías con Swiper
 * 
 * Esta clase se encarga de:
 * - Inicializar Swiper cuando se abre una galería
 * - Aislar eventos de Swiper para que no interfieran con Three.js
 * - Clonar contenido de galerías al modal
 * 
 * Requiere: Swiper desde CDN
 * Para personalizar: modifica las opciones en initialize()
 */

(function() {
	'use strict';

	/**
	 * @constructor
	 */
	function GalleryManager() {
		this.swiperInstances = new Map(); // Cache de instancias de Swiper
	}

	/**
	 * Inicializa Swiper en un contenedor
	 * @param {HTMLElement} container - Contenedor donde buscar .swiper-container
	 */
	GalleryManager.prototype.initialize = function(container) {
		// Verificar que Swiper esté cargado
		if (typeof Swiper === 'undefined') {
			console.warn('Swiper library not loaded. Make sure to include Swiper from CDN.');
			return;
		}

		// Buscar contenedor de Swiper
		var swiperContainer = container.querySelector('.swiper-container');
		if (!swiperContainer) {
			return;
		}

		// Verificar si ya está inicializado
		if (swiperContainer.swiper) {
			swiperContainer.swiper.update();
			return;
		}

		// Crear nueva instancia de Swiper
		var swiperInstance = new Swiper(swiperContainer, {
			slidesPerView: 1,
			spaceBetween: 10,
			navigation: {
				nextEl: swiperContainer.querySelector('.swiper-button-next'),
				prevEl: swiperContainer.querySelector('.swiper-button-prev'),
			},
			pagination: {
				el: swiperContainer.querySelector('.swiper-pagination'),
				clickable: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			simulateTouch: true,
			touchEventsTarget: 'container',
			preventClicks: true,
			preventClicksPropagation: true,
		});

		// Aislar eventos de Swiper
		this.isolateSwiperEvents(swiperContainer);

		// Guardar instancia
		swiperContainer.swiperInstance = swiperInstance;
		this.swiperInstances.set(swiperContainer, swiperInstance);
	};

	/**
	 * Aísla eventos de Swiper para evitar conflictos con Three.js
	 */
	GalleryManager.prototype.isolateSwiperEvents = function(container) {
		// Prevenir propagación de eventos táctiles
		container.addEventListener('touchstart', function(e) {
			e.stopPropagation();
		}, { passive: true });

		container.addEventListener('touchmove', function(e) {
			e.stopPropagation();
		}, { passive: true });

		container.addEventListener('touchend', function(e) {
			e.stopPropagation();
		}, { passive: true });

		// Prevenir propagación de eventos pointer
		container.addEventListener('pointerdown', function(e) {
			e.stopPropagation();
		});

		container.addEventListener('pointermove', function(e) {
			e.stopPropagation();
		});

		container.addEventListener('pointerup', function(e) {
			e.stopPropagation();
		});
	};

	/**
	 * Renderiza el contenido de una galería para el modal
	 * @param {string} gallerySelector - Selector CSS de la galería
	 * @returns {HTMLElement|null} Elemento clonado de la galería
	 */
	GalleryManager.prototype.renderContent = function(gallerySelector) {
		var galleryContainer = document.querySelector(gallerySelector);
		
		if (!galleryContainer) {
			return null;
		}

		// Clonar el contenido de la galería
		var galleryClone = galleryContainer.cloneNode(true);
		galleryClone.style.display = 'block';
		
		return galleryClone;
	};

	// Exportar
	window.GalleryManager = GalleryManager;

})();

