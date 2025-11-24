/**
 * AudioManager - Clase para manejar la reproducción de audio
 * 
 * Esta clase se encarga de:
 * - Reproducir y pausar elementos de audio
 * - Toggle entre play/pause
 * - Manejar eventos de clic en botones de audio
 * 
 * Para agregar audio: crea elementos <audio> en el HTML y referencia con data-target
 */

export class AudioManager {
	/**
	 * @constructor
	 */
	constructor() {
		this.audioElements = new Map(); // Cache de elementos de audio
	}

	/**
	 * Maneja el clic en un spot de audio
	 * @param {Object} spot - Objeto spot con información del botón
	 * @param {Event} event - Evento de clic
	 */
	handleSpotClick(spot, event) {
		if (spot.type !== 'audio') {
			return;
		}

		if (spot.target) {
			this.toggle(spot.target);
		} else {
			console.warn('Audio spot has no target specified');
		}
	}

	/**
	 * Toggle de reproducción de audio
	 * @param {string} audioSelector - Selector CSS del elemento de audio
	 */
	toggle(audioSelector) {
		const audioElement = this.getAudioElement(audioSelector);
		
		if (!audioElement) {
			console.warn(`Audio element not found: ${audioSelector}`);
			return;
		}

		// Toggle play/pause
		if (audioElement.paused) {
			audioElement.play().catch((error) => {
				console.error('Error playing audio:', error);
			});
		} else {
			audioElement.pause();
		}
	}

	/**
	 * Obtiene un elemento de audio (con cache)
	 */
	getAudioElement(selector) {
		// Verificar cache
		if (this.audioElements.has(selector)) {
			return this.audioElements.get(selector);
		}

		// Buscar en el DOM
		const element = document.querySelector(selector);
		if (element) {
			this.audioElements.set(selector, element);
		}

		return element;
	}

	/**
	 * Reproduce un audio
	 */
	play(audioSelector) {
		const audioElement = this.getAudioElement(audioSelector);
		if (audioElement) {
			audioElement.play().catch((error) => {
				console.error('Error playing audio:', error);
			});
		}
	}

	/**
	 * Pausa un audio
	 */
	pause(audioSelector) {
		const audioElement = this.getAudioElement(audioSelector);
		if (audioElement) {
			audioElement.pause();
		}
	}
}
