/**
 * AudioManager - Clase para manejar la reproducción de audio
 * 
 * Esta clase se encarga de:
 * - Reproducir y pausar elementos de audio
 * - Toggle entre play/pause
 * 
 * Para agregar audio: crea elementos <audio> en el HTML y referencia con data-target
 */

(function() {
	'use strict';

	/**
	 * @constructor
	 */
	function AudioManager() {
		this.audioElements = new Map(); // Cache de elementos de audio
	}

	/**
	 * Toggle de reproducción de audio
	 * @param {string} audioSelector - Selector CSS del elemento de audio
	 */
	AudioManager.prototype.toggle = function(audioSelector) {
		var audioElement = this.getAudioElement(audioSelector);
		
		if (!audioElement) {
			console.warn('Audio element not found: ' + audioSelector);
			return;
		}

		// Toggle play/pause
		if (audioElement.paused) {
			audioElement.play().catch(function(error) {
				console.error('Error playing audio:', error);
			});
		} else {
			audioElement.pause();
		}
	};

	/**
	 * Obtiene un elemento de audio (con cache)
	 */
	AudioManager.prototype.getAudioElement = function(selector) {
		// Verificar cache
		if (this.audioElements.has(selector)) {
			return this.audioElements.get(selector);
		}

		// Buscar en el DOM
		var element = document.querySelector(selector);
		if (element) {
			this.audioElements.set(selector, element);
		}

		return element;
	};

	/**
	 * Reproduce un audio
	 */
	AudioManager.prototype.play = function(audioSelector) {
		var audioElement = this.getAudioElement(audioSelector);
		if (audioElement) {
			audioElement.play().catch(function(error) {
				console.error('Error playing audio:', error);
			});
		}
	};

	/**
	 * Pausa un audio
	 */
	AudioManager.prototype.pause = function(audioSelector) {
		var audioElement = this.getAudioElement(audioSelector);
		if (audioElement) {
			audioElement.pause();
		}
	};

	// Exportar
	window.AudioManager = AudioManager;

})();

