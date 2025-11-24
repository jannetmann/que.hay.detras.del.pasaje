/**
 * SpotManager - Clase para manejar los spots interactivos
 * 
 * Esta clase se encarga de:
 * - Leer los spots desde los botones HTML
 * - Actualizar sus posiciones en pantalla según la cámara
 * - Coordinar con otros managers para manejar eventos
 * 
 * Para agregar spots: agrega botones en #spots-container con atributos data-*
 */

import * as THREE from 'three';

export class SpotManager {
	/**
	 * @constructor
	 * @param {HTMLElement} spotsRoot - Contenedor donde se definen los spots
	 * @param {VRScene} vrScene - Instancia de la escena VR
	 */
	constructor(spotsRoot, vrScene) {
		this.spotsRoot = spotsRoot || document.getElementById('spots-container');
		this.vrScene = vrScene;
		this.spots = new Map(); // Almacena los spots: id -> {element, spot}
		this.managers = {}; // Referencias a otros managers
	}

	/**
	 * Registra un manager para manejar eventos de spots
	 * @param {string} type - Tipo de spot (ej: 'audio', 'gallery')
	 * @param {Object} manager - Instancia del manager
	 */
	registerManager(type, manager) {
		this.managers[type] = manager;
	}

	/**
	 * Inicializa los spots desde el HTML
	 */
	init() {
		if (!this.spotsRoot) {
			console.warn('Spots root container not found');
			return;
		}

		const spotButtons = this.spotsRoot.querySelectorAll('.spot');

		spotButtons.forEach((button, index) => {
			this.createSpotFromButton(button, index);
		});

		// Configurar callback para actualizar posiciones
		this.vrScene.setUpdateSpotsCallback(this.updatePositions.bind(this));
	}

	/**
	 * Crea un spot desde un botón HTML
	 */
	createSpotFromButton(button, index) {
		// Leer atributos del botón
		const spotType = button.dataset.type;
		const spotTarget = button.dataset.target;
		const lon = parseFloat(button.dataset.lon) || 0;
		const lat = parseFloat(button.dataset.lat) || 0;
		const label = button.dataset.label || button.textContent || '●';
		const spotId = button.id || `spot-${Date.now()}-${index}`;

		// Crear objeto spot
		const spot = {
			id: spotId,
			type: spotType,
			target: spotTarget,
			spherical: { lon, lat },
			label,
			element: button
		};

		// Configurar dataset en el botón existente
		button.dataset.spotId = spotId;
		button.dataset.spotType = spotType || '';
		if (spotTarget) {
			button.dataset.spotTarget = spotTarget;
		}
		button.dataset.lon = lon.toString();
		button.dataset.lat = lat.toString();
		button.textContent = label;

		if (!button.style.getPropertyValue('--spot-color')) {
			button.style.setProperty('--spot-color', '#ffffff');
		}

		// Configurar listener de click según el tipo
		button.addEventListener('click', (event) => {
			event.stopPropagation();
			event.preventDefault();
			this.handleSpotClick(spot, event);
		});

		// Guardar referencia al botón original
		this.spots.set(spotId, {
			element: button,
			spot
		});
	}

	/**
	 * Maneja los clics en los spots y delega al manager correspondiente
	 */
	handleSpotClick(spot, event) {
		const manager = this.managers[spot.type];
		
		if (manager && typeof manager.handleSpotClick === 'function') {
			manager.handleSpotClick(spot, event);
		} else {
			console.warn(`No manager registered for spot type: ${spot.type}`);
		}
	}

	/**
	 * Actualiza las posiciones de los spots en pantalla
	 */
	updatePositions(camera, renderer) {
		if (this.spots.size === 0) {
			return;
		}

		const canvasBounds = renderer.domElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calcular dirección de la cámara
		const cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection).normalize();

		this.spots.forEach((entry) => {
			const { element, spot } = entry;

			// Obtener coordenadas desde dataset
			const lon = parseFloat(element.dataset.lon) || 0;
			const lat = parseFloat(element.dataset.lat) || 0;

			// Convertir a posición 3D
			const worldPosition = this.vrScene.sphericalToWorld(lon, lat);

			// Determinar si el spot está frente a la cámara
			const toSpot = worldPosition.clone().sub(camera.position).normalize();
			const isFacingCamera = cameraDirection.dot(toSpot) > 0;

			if (!isFacingCamera) {
				element.style.opacity = '0';
				element.style.pointerEvents = 'none';
				return;
			}

			element.style.opacity = '';
			element.style.pointerEvents = '';

			// Proyectar a coordenadas de pantalla
			const projected = worldPosition.clone().project(camera);

			// Convertir a píxeles
			let x = (projected.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
			let y = (-projected.y * 0.5 + 0.5) * canvasBounds.height + canvasBounds.top;

			// Obtener tamaño del elemento
			const spotRect = element.getBoundingClientRect();
			const spotWidth = spotRect.width;
			const spotHeight = spotRect.height;

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
			element.style.transform = `translate(${x}px, ${y}px)`;
		});
	}
}
