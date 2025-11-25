/**
 * SpotManager - Maneja el tracking de posiciones de los spots
 * 
 * Solo se encarga de actualizar las posiciones de los spots en pantalla
 * según la posición de la cámara
 */

import * as THREE from 'three';

export class SpotManager {
	constructor(spotsRoot, vrScene) {
		this.spotsRoot = spotsRoot || document.getElementById('spots-container');
		this.vrScene = vrScene;
		this.spots = []; // Array de elementos de spots
	}

	init() {
		if (!this.spotsRoot) {
			console.warn('Spots root container not found');
			return;
		}

		// Obtener todos los botones de spots
		const spotButtons = this.spotsRoot.querySelectorAll('.spot');
		this.spots = Array.from(spotButtons);

		// Configurar callback para actualizar posiciones
		this.vrScene.setUpdateSpotsCallback(this.updatePositions.bind(this));
	}

	updatePositions(camera, renderer) {

		const canvasBounds = renderer.domElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calcular dirección de la cámara
		const cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection).normalize();

		// Actualizar posición de cada spot
		this.spots.forEach((element) => {
			// Obtener coordenadas desde dataset
			const lon = parseFloat(element.dataset.lon) || 0;
			const lat = parseFloat(element.dataset.lat) || 0;

			// Convertir a posición 3D
			const worldPosition = this.vrScene.sphericalToWorld(lon, lat);

			// Determinar si el spot está frente a la cámara
			const toSpot = worldPosition.clone().sub(camera.position).normalize();
			const isFacingCamera = cameraDirection.dot(toSpot) > 0;

			element.style.opacity = isFacingCamera ? '1' : '0';
			element.style.pointerEvents = isFacingCamera ? 'auto' : 'none';

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
