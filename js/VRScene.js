/**
 * VRScene - Clase para manejar la escena 3D con Three.js
 * 
 * Esta clase se encarga de:
 * - Crear y configurar la escena 3D
 * - Manejar la cámara y el renderer
 * - Controlar la interacción del usuario (arrastrar para rotar)
 * - Actualizar la posición de los spots en pantalla
 * 
 * Para personalizar: modifica las propiedades en el constructor
 */

import * as THREE from 'three';

	/**
	 * @constructor
	 * @param {Object} config - Configuración de la escena
	 * @param {number} config.sphereRadius - Radio de la esfera (default: 5)
	 * @param {HTMLElement} config.container - Contenedor donde se renderiza
	 * @param {HTMLElement} config.video - Elemento de video para la textura
	 */
	function VRScene(config) {
		// Configuración
		this.config = {
			sphereRadius: config.sphereRadius || 5,
			container: config.container,
			video: config.video
		};

		// Objetos de Three.js
		this.camera = null;
		this.scene = null;
		this.renderer = null;
		this.mesh = null;

		// Estado de interacción
		this.isUserInteracting = false;
		this.isModalOpen = false;

		// Ángulos de rotación de la cámara
		this.lon = 0;
		this.lat = 0;
		this.phi = 0;
		this.theta = 0;

		// Punto de inicio del arrastre
		this.onPointerDownPointerX = 0;
		this.onPointerDownPointerY = 0;
		this.onPointerDownLon = 0;
		this.onPointerDownLat = 0;

		// Distancia de la cámara al centro
		this.distance = 0.5;

		// Referencia a la función de actualización de spots
		this.updateSpotsCallback = null;

		// Bind de métodos para mantener el contexto
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.animate = this.animate.bind(this);
	}

	/**
	 * Inicializa la escena 3D
	 */
	VRScene.prototype.init = function() {
		if (!this.config.container) {
			throw new Error('Container element not found');
		}

		if (!this.config.video) {
			throw new Error('Video element not found');
		}

		// Crear cámara
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.25,
			10
		);

		// Crear escena
		this.scene = new THREE.Scene();

		// Crear geometría de esfera
		var geometry = new THREE.SphereGeometry(
			this.config.sphereRadius,
			60,
			40
		);
		geometry.scale(-1, 1, 1); // Invertir para ver desde adentro

		// Configurar video
		this.config.video.setAttribute('playsinline', 'true');
		this.config.video.setAttribute('webkit-playsinline', 'true');
		this.config.video.playsInline = true;
		this.config.video.muted = true;
		this.config.video.loop = true;
		this.config.video.play();

		// Crear textura desde el video
		var texture = new THREE.VideoTexture(this.config.video);
		texture.colorSpace = THREE.SRGBColorSpace;
		var material = new THREE.MeshBasicMaterial({ map: texture });

		// Crear malla y agregar a la escena
		this.mesh = new THREE.Mesh(geometry, material);
		this.scene.add(this.mesh);

		// Crear renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setAnimationLoop(this.animate);
		this.config.container.appendChild(this.renderer.domElement);

		// Configurar eventos
		this.setupEvents();

		// Configurar resize
		window.addEventListener('resize', this.onWindowResize);
	};

	/**
	 * Configura los event listeners para la interacción
	 */
	VRScene.prototype.setupEvents = function() {
		var canvas = this.renderer.domElement;
		canvas.addEventListener('pointerdown', this.onPointerDown);
		document.addEventListener('pointermove', this.onPointerMove);
		document.addEventListener('pointerup', this.onPointerUp);
	};

	/**
	 * Maneja el inicio del arrastre
	 */
	VRScene.prototype.onPointerDown = function(event) {
		// No permitir interacción si el modal está abierto
		if (this.isModalOpen || 
			event.target.closest('.spot-modal') || 
			event.target.closest('.spot-button')) {
			return;
		}

		this.isUserInteracting = true;
		this.onPointerDownPointerX = event.clientX;
		this.onPointerDownPointerY = event.clientY;
		this.onPointerDownLon = this.lon;
		this.onPointerDownLat = this.lat;

		event.stopPropagation();
	};

	/**
	 * Maneja el movimiento durante el arrastre
	 */
	VRScene.prototype.onPointerMove = function(event) {
		if (this.isModalOpen) {
			return;
		}

		if (this.isUserInteracting) {
			if (event.target.closest('.spot-modal')) {
				return;
			}

			// Calcular nueva rotación basada en el movimiento del mouse
			this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
			this.lat = (this.onPointerDownPointerY - event.clientY) * 0.1 + this.onPointerDownLat;
		}
	};

	/**
	 * Maneja el fin del arrastre
	 */
	VRScene.prototype.onPointerUp = function(event) {
		if (event && event.target && event.target.closest('.spot-modal')) {
			return;
		}

		this.isUserInteracting = false;
	};

	/**
	 * Maneja el redimensionamiento de la ventana
	 */
	VRScene.prototype.onWindowResize = function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	/**
	 * Bucle de animación que se ejecuta cada frame
	 */
	VRScene.prototype.animate = function() {
		// Limitar la latitud para evitar voltear la cámara
		this.lat = Math.max(-85, Math.min(85, this.lat));

		// Convertir ángulos a radianes
		this.phi = THREE.MathUtils.degToRad(90 - this.lat);
		this.theta = THREE.MathUtils.degToRad(this.lon);

		// Calcular posición de la cámara en coordenadas esféricas
		this.camera.position.x = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
		this.camera.position.y = this.distance * Math.cos(this.phi);
		this.camera.position.z = this.distance * Math.sin(this.phi) * Math.sin(this.theta);

		// Hacer que la cámara mire al centro
		this.camera.lookAt(0, 0, 0);

		// Renderizar la escena
		this.renderer.render(this.scene, this.camera);

		// Actualizar posiciones de los spots si hay callback
		if (this.updateSpotsCallback) {
			this.updateSpotsCallback(this.camera, this.renderer);
		}
	};

	/**
	 * Convierte coordenadas esféricas a posición 3D
	 * @param {number} lon - Longitud en grados
	 * @param {number} lat - Latitud en grados
	 * @returns {THREE.Vector3} Posición en el espacio 3D
	 */
	VRScene.prototype.sphericalToWorld = function(lon, lat) {
		var radius = this.config.sphereRadius;
		var phi = THREE.MathUtils.degToRad(90 - lat);
		var theta = THREE.MathUtils.degToRad(lon);

		var x = radius * Math.sin(phi) * Math.sin(theta);
		var y = radius * Math.cos(phi);
		var z = radius * Math.sin(phi) * Math.cos(theta);

		return new THREE.Vector3(x, y, z);
	};

	/**
	 * Establece el estado del modal (para deshabilitar interacción)
	 */
	VRScene.prototype.setModalOpen = function(isOpen) {
		this.isModalOpen = isOpen;
		this.isUserInteracting = false;
	};

	/**
	 * Establece el callback para actualizar posiciones de spots
	 */
	VRScene.prototype.setUpdateSpotsCallback = function(callback) {
		this.updateSpotsCallback = callback;
	};

	// Exportar al scope global
	window.VRScene = VRScene;

