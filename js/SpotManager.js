/**
 * SpotManager - Clase para manejar los spots interactivos
 * 
 * Esta clase se encarga de:
 * - Leer los spots desde los botones HTML
 * - Crear los botones flotantes en la escena
 * - Actualizar sus posiciones en pantalla según la cámara
 * - Manejar los clics en los spots
 * 
 * Para agregar spots: agrega botones en #spots-container con atributos data-*
 */

(function() {
	'use strict';

	/**
	 * @constructor
	 * @param {HTMLElement} overlayLayer - Capa donde se renderizan los spots
	 * @param {VRScene} vrScene - Instancia de la escena VR
	 */
	function SpotManager(overlayLayer, vrScene) {
		this.overlayLayer = overlayLayer;
		this.vrScene = vrScene;
		this.spots = new Map(); // Almacena los spots: id -> {element, spot}
		this.commandHandlers = {}; // Handlers para comandos de spots

		// Bind de métodos
		this.handleCommandClick = this.handleCommandClick.bind(this);
		this.updatePositions = this.updatePositions.bind(this);
	}

	/**
	 * Inicializa los spots desde el HTML
	 */
	SpotManager.prototype.init = function() {
		if (!this.overlayLayer) {
			console.warn('Overlay layer not found');
			return;
		}

		var spotsContainer = document.getElementById('spots-container');
		if (!spotsContainer) {
			console.warn('Spots container not found');
			return;
		}

		var spotButtons = spotsContainer.querySelectorAll('.spot');
		var self = this;

		spotButtons.forEach(function(button, index) {
			self.createSpotFromButton(button, index);
		});

		// Configurar listener para comandos
		document.addEventListener('click', this.handleCommandClick);

		// Configurar callback para actualizar posiciones
		this.vrScene.setUpdateSpotsCallback(this.updatePositions);
	};

	/**
	 * Crea un spot desde un botón HTML
	 */
	SpotManager.prototype.createSpotFromButton = function(button, index) {
		// Leer atributos del botón
		var spotType = button.dataset.type;
		var spotTarget = button.dataset.target;
		var lon = parseFloat(button.dataset.lon) || 0;
		var lat = parseFloat(button.dataset.lat) || 0;
		var label = button.dataset.label || button.textContent || '●';
		var spotId = button.id || 'spot-' + Date.now() + '-' + index;

		// Crear objeto spot
		var spot = {
			id: spotId,
			type: spotType,
			target: spotTarget,
			spherical: { lon: lon, lat: lat },
			label: label,
			element: button
		};

		// Clonar botón para el overlay
		var overlayButton = button.cloneNode(true);
		overlayButton.className = 'spot-button spot';
		overlayButton.textContent = label;
		overlayButton.dataset.spotId = spotId;
		overlayButton.dataset.spotType = spotType;
		overlayButton.dataset.spotTarget = spotTarget;
		overlayButton.dataset.lon = lon.toString();
		overlayButton.dataset.lat = lat.toString();
		overlayButton.style.setProperty('--spot-color', '#ffffff');

		// Configurar comando según el tipo
		if (spotType === 'gallery') {
			overlayButton.setAttribute('command', '--open-spot-modal');
		} else if (spotType === 'audio') {
			overlayButton.setAttribute('command', '--toggle-audio');
		}

		// Agregar al overlay
		this.overlayLayer.appendChild(overlayButton);

		// Guardar referencia
		this.spots.set(spotId, {
			element: overlayButton,
			spot: spot
		});
	};

	/**
	 * Maneja los clics en los spots
	 */
	SpotManager.prototype.handleCommandClick = function(event) {
		var commandTarget = event.target.closest('[command]');
		if (!commandTarget) {
			return;
		}

		// Prevenir propagación
		event.stopPropagation();
		event.preventDefault();

		var rawCommand = commandTarget.getAttribute('command');
		var command = rawCommand ? rawCommand.replace(/^--/, '') : '';

		// Ejecutar handler si existe
		if (this.commandHandlers[command]) {
			var spotId = commandTarget.dataset.spotId;
			var entry = this.spots.get(spotId);
			if (entry) {
				this.commandHandlers[command](entry.spot, event);
			}
		}
	};

	/**
	 * Registra un handler para un comando
	 */
	SpotManager.prototype.onCommand = function(command, handler) {
		this.commandHandlers[command] = handler;
	};

	/**
	 * Actualiza las posiciones de los spots en pantalla
	 */
	SpotManager.prototype.updatePositions = function(camera, renderer) {
		if (this.spots.size === 0) {
			return;
		}

		var canvasBounds = renderer.domElement.getBoundingClientRect();
		var viewportWidth = window.innerWidth;
		var viewportHeight = window.innerHeight;
		var self = this;

		this.spots.forEach(function(entry) {
			var element = entry.element;
			var spot = entry.spot;

			// Obtener coordenadas desde dataset
			var lon = parseFloat(element.dataset.lon) || 0;
			var lat = parseFloat(element.dataset.lat) || 0;

			// Convertir a posición 3D
			var worldPosition = self.vrScene.sphericalToWorld(lon, lat);

			// Proyectar a coordenadas de pantalla
			var projected = worldPosition.clone().project(camera);

			// Convertir a píxeles
			var x = (projected.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
			var y = (-projected.y * 0.5 + 0.5) * canvasBounds.height + canvasBounds.top;

			// Obtener tamaño del elemento
			var spotRect = element.getBoundingClientRect();
			var spotWidth = spotRect.width;
			var spotHeight = spotRect.height;

			// Limitar dentro del viewport
			if (x < 0) {
				x = 0;
			} else if (x + spotWidth > viewportWidth) {
				x = viewportWidth - spotWidth;
			}

			if (y < 0) {
				y = 0;
			} else if (y + spotHeight > viewportHeight) {
				y = viewportHeight - spotHeight;
			}

			// Aplicar posición
			element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
		});
	};

	// Exportar
	window.SpotManager = SpotManager;

})();

