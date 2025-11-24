/**
 * GalleryManager - Clase para manejar las galerías con Swiper
 * 
 * Esta clase se encarga de:
 * - Inicializar Swiper cuando se abre una galería
 * - Aislar eventos de Swiper para que no interfieran con Three.js
 * - Clonar contenido de galerías al modal
 * - Manejar eventos de clic en botones de galería
 * 
 * Requiere: Swiper desde CDN
 * Para personalizar: modifica las opciones en initialize()
 */

export class GalleryManager {
	/**
	 * @constructor
	 * @param {ModalManager} modalManager - Instancia del gestor de modales
	 */
	constructor(modalManager) {
		this.modalManager = modalManager;
		this.swiperInstances = new Map(); // Cache de instancias de Swiper
	}

	/**
	 * Maneja el clic en un spot de galería
	 * @param {Object} spot - Objeto spot con información del botón
	 * @param {Event} event - Evento de clic
	 */
	handleSpotClick(spot, event) {
		if (spot.type !== 'gallery') {
			return;
		}

		if (!this.modalManager) {
			console.warn('ModalManager not available');
			return;
		}

		if (!spot.target) {
			console.warn('Gallery spot has no target specified');
			return;
		}

		// Renderizar contenido de la galería
		const content = this.renderContent(spot.target);

		// Abrir modal con el contenido
		this.modalManager.open(spot, () => content);

		// Inicializar Swiper si hay contenido
		if (content && this.modalManager.modalContent) {
			this.initialize(this.modalManager.modalContent);
		}
	}

	/**
	 * Inicializa Swiper en un contenedor
	 * @param {HTMLElement} container - Contenedor donde buscar .swiper-container
	 */
	initialize(container) {
		// Verificar que Swiper esté cargado
		if (typeof Swiper === 'undefined') {
			console.warn('Swiper library not loaded. Make sure to include Swiper from CDN.');
			return;
		}

		// Buscar contenedor de Swiper
		const swiperContainer = container.querySelector('.swiper-container');
		if (!swiperContainer) {
			return;
		}

		// Verificar si ya está inicializado
		if (swiperContainer.swiper) {
			swiperContainer.swiper.update();
			return;
		}

		// Crear nueva instancia de Swiper
		const swiperInstance = new Swiper(swiperContainer, {
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
	}

	/**
	 * Aísla eventos de Swiper para evitar conflictos con Three.js
	 */
	isolateSwiperEvents(container) {
		// Prevenir propagación de eventos táctiles
		container.addEventListener('touchstart', (e) => {
			e.stopPropagation();
		}, { passive: true });

		container.addEventListener('touchmove', (e) => {
			e.stopPropagation();
		}, { passive: true });

		container.addEventListener('touchend', (e) => {
			e.stopPropagation();
		}, { passive: true });

		// Prevenir propagación de eventos pointer
		container.addEventListener('pointerdown', (e) => {
			e.stopPropagation();
		});

		container.addEventListener('pointermove', (e) => {
			e.stopPropagation();
		});

		container.addEventListener('pointerup', (e) => {
			e.stopPropagation();
		});
	}

	/**
	 * Renderiza el contenido de una galería para el modal
	 * @param {string} gallerySelector - Selector CSS de la galería
	 * @returns {HTMLElement|null} Elemento clonado de la galería
	 */
	renderContent(gallerySelector) {
		const galleryContainer = document.querySelector(gallerySelector);
		
		if (!galleryContainer) {
			return null;
		}

		// Clonar el contenido de la galería
		const galleryClone = galleryContainer.cloneNode(true);
		galleryClone.style.display = 'block';
		
		return galleryClone;
	}
}
