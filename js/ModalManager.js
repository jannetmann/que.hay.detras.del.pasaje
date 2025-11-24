/**
 * ModalManager - Clase para manejar el modal de galerías
 * 
 * Esta clase se encarga de:
 * - Abrir y cerrar el modal
 * - Renderizar el contenido según el tipo de spot
 * - Aislar eventos del modal para que no interfieran con Three.js
 * 
 * Para personalizar: modifica los estilos en spots.css
 */

(function() {
	'use strict';

	/**
	 * @constructor
	 * @param {HTMLElement} modalElement - Elemento del modal
	 * @param {VRScene} vrScene - Instancia de la escena VR
	 */
	function ModalManager(modalElement, vrScene) {
		this.modal = modalElement;
		this.vrScene = vrScene;
		this.modalTitle = null;
		this.modalContent = null;
		this.modalCloseButton = null;
		this.isOpen = false;

		// Bind de métodos
		this.close = this.close.bind(this);
		this.handleModalClick = this.handleModalClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	/**
	 * Inicializa el modal
	 */
	ModalManager.prototype.init = function() {
		if (!this.modal) {
			console.warn('Modal element not found');
			return;
		}

		this.modalTitle = this.modal.querySelector('[data-spot-modal-title]');
		this.modalContent = this.modal.querySelector('[data-spot-modal-content]');
		this.modalCloseButton = this.modal.querySelector('[data-spot-modal-close]');

		// Configurar botón de cerrar
		if (this.modalCloseButton) {
			this.modalCloseButton.setAttribute('command', '--close-spot-modal');
			this.modalCloseButton.addEventListener('click', function(event) {
				event.stopPropagation();
				this.close();
			}.bind(this));
		}

		// Configurar clic fuera del modal
		this.modal.addEventListener('click', this.handleModalClick);

		// Prevenir propagación de eventos pointer
		this.modal.addEventListener('pointerdown', function(e) {
			e.stopPropagation();
		}, true);
		this.modal.addEventListener('pointermove', function(e) {
			e.stopPropagation();
		}, true);
		this.modal.addEventListener('pointerup', function(e) {
			e.stopPropagation();
		}, true);

		// Configurar tecla Escape
		document.addEventListener('keydown', this.handleKeyDown);
	};

	/**
	 * Abre el modal con el contenido del spot
	 */
	ModalManager.prototype.open = function(spot, contentRenderer) {
		if (!this.modal || !this.modalContent || !this.modalTitle) {
			return;
		}

		this.isOpen = true;
		this.modal.classList.add('is-visible');
		this.modal.setAttribute('aria-hidden', 'false');

		// Deshabilitar interacción de Three.js
		this.vrScene.setModalOpen(true);

		// Actualizar título
		if (this.modalTitle) {
			this.modalTitle.textContent = spot.label || spot.title || 'Spot interactivo';
		}

		// Limpiar y renderizar contenido
		this.modalContent.innerHTML = '';
		var content = contentRenderer(spot);
		
		if (typeof content === 'string') {
			this.modalContent.innerHTML = content;
		} else if (content) {
			this.modalContent.appendChild(content);
		}
	};

	/**
	 * Cierra el modal
	 */
	ModalManager.prototype.close = function() {
		if (!this.modal) {
			return;
		}

		this.isOpen = false;
		this.modal.classList.remove('is-visible');
		this.modal.setAttribute('aria-hidden', 'true');

		// Habilitar interacción de Three.js
		this.vrScene.setModalOpen(false);
	};

	/**
	 * Maneja clics en el modal
	 */
	ModalManager.prototype.handleModalClick = function(event) {
		// Prevenir propagación dentro del diálogo
		if (event.target.closest('.spot-modal__dialog')) {
			event.stopPropagation();
		}

		// Cerrar si se hace clic fuera del diálogo
		if (event.target === this.modal) {
			this.close();
		}
	};

	/**
	 * Maneja teclas del teclado
	 */
	ModalManager.prototype.handleKeyDown = function(event) {
		if (event.key === 'Escape' && this.isOpen) {
			event.stopPropagation();
			this.close();
		}
	};

	/**
	 * Verifica si el modal está abierto
	 */
	ModalManager.prototype.getIsOpen = function() {
		return this.isOpen;
	};

	// Exportar
	window.ModalManager = ModalManager;

})();

