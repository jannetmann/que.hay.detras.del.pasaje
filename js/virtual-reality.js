import * as THREE from 'three';

const defaultConfig = {
	sphereRadius: 5,
	spots: [],
	enableModal: true,
	spotLabelFormatter: spot => spot.label || spot.title || '●'
};

const legacyConfig = window.VR_CONFIG || {};

const config = {
	...defaultConfig,
	...legacyConfig,
	...(window.SPOTS_SETTINGS || {})
};

const spotsSource = Array.isArray(window.SPOTS) ? window.SPOTS : legacyConfig.spots;
config.spots = Array.isArray(spotsSource) ? spotsSource : [];

let camera;
let scene;
let renderer;

let isUserInteracting = false;
let lon = 0;
let lat = 0;
let phi = 0;
let theta = 0;
let onPointerDownPointerX = 0;
let onPointerDownPointerY = 0;
let onPointerDownLon = 0;
let onPointerDownLat = 0;

const distance = 0.5;

const overlayLayer = ensureOverlayLayer();
const modal = document.getElementById('spot-modal');
const modalTitle = modal?.querySelector('[data-spot-modal-title]');
const modalContent = modal?.querySelector('[data-spot-modal-content]');
const modalCloseButton = modal?.querySelector('[data-spot-modal-close]');

const spotElements = new Map();

document.addEventListener('click', handleCommandClick);

init();

function init() {

	const container = document.getElementById('container');

	if (!container) {

		throw new Error('Container element with id "container" was not found.');

	}

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.25, 10);

	scene = new THREE.Scene();

	const geometry = new THREE.SphereGeometry(config.sphereRadius, 60, 40);
	geometry.scale(- 1, 1, 1);

	const video = document.getElementById('video');

	if (!video) {

		throw new Error('Video element with id "video" was not found.');

	}

	video.setAttribute('playsinline', 'true');
	video.setAttribute('webkit-playsinline', 'true');
	video.playsInline = true;
	video.muted = true;
	video.loop = true;

	void video.play();

	const texture = new THREE.VideoTexture(video);
	texture.colorSpace = THREE.SRGBColorSpace;
	const material = new THREE.MeshBasicMaterial({ map: texture });

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animate);
	container.appendChild(renderer.domElement);

	document.addEventListener('pointerdown', onPointerDown);
	document.addEventListener('pointermove', onPointerMove);
	document.addEventListener('pointerup', onPointerUp);

	window.addEventListener('resize', onWindowResize);

	setupSpots();
	setupModal();

}

function ensureOverlayLayer() {

	const existing = document.getElementById('spots-layer');

	if (existing) {

		return existing;

	}

	const container = document.createElement('div');
	container.id = 'spots-layer';
	document.body.appendChild(container);
	return container;

}

function setupSpots() {

	if (!overlayLayer) {

		return;

	}

	config.spots.forEach(spot => {

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'spot-button';
		button.textContent = config.spotLabelFormatter(spot);
		button.dataset.spotId = spot.id;
		button.style.setProperty('--spot-color', spot.color || '#ffffff');
		button.setAttribute('command', '--open-spot-modal');

		overlayLayer.appendChild(button);
		spotElements.set(spot.id, { element: button, spot });

	});

}

function setupModal() {

	if (!modal || !modalCloseButton) {

		return;

	}

	modalCloseButton.setAttribute('command', '--close-spot-modal');

	modalCloseButton.addEventListener('click', closeSpotModal);
	modal.addEventListener('click', event => {

		if (event.target === modal) {

			closeSpotModal();

		}

	});

	document.addEventListener('keydown', event => {

		if (event.key === 'Escape') {

			closeSpotModal();

		}

	});

}

function openSpotModal(spot) {

	if (!modal || !modalContent || !modalTitle) {

		return;

	}

	modal.classList.add('is-visible');
	modal.setAttribute('aria-hidden', 'false');

	modalTitle.textContent = spot.title || spot.label || 'Spot interactivo';
	modalContent.innerHTML = renderSpotContent(spot);

}

function handleCommandClick(event) {

	const commandTarget = event.target.closest('[command]');

	if (!commandTarget) {

		return;

	}

	const rawCommand = commandTarget.getAttribute('command');
	const command = rawCommand?.replace(/^--/, '');

	if (command === 'open-spot-modal') {

		const spotId = commandTarget.dataset.spotId;
		const entry = spotElements.get(spotId);

		if (entry && config.enableModal) {

			event.preventDefault();
			openSpotModal(entry.spot);

		}

	}

	if (command === 'close-spot-modal') {

		event.preventDefault();
		closeSpotModal();

	}

}

function closeSpotModal() {

	if (!modal) {

		return;

	}

	modal.classList.remove('is-visible');
	modal.setAttribute('aria-hidden', 'true');

}

function renderSpotContent(spot) {

	const description = spot.description ? `<p class="spot-modal__description">${spot.description}</p>` : '';

	switch (spot.type) {

		case 'photo':
			return `
				${description}
				<figure class="spot-modal__figure">
					<img src="${spot.media}" alt="${spot.title || 'Fotografía'}">
					${spot.caption ? `<figcaption>${spot.caption}</figcaption>` : ''}
				</figure>
			`;

		case 'gallery':
			if (Array.isArray(spot.items) && spot.items.length > 0) {

				return `
					${description}
					<div class="spot-modal__gallery">
						${spot.items.map(item => `<img src="${item.src}" alt="${item.alt || 'Galería'}">`).join('')}
					</div>
				`;

			}

			return description || '<p>Agrega elementos a la galería.</p>';

		case 'audio':
			if (Array.isArray(spot.audios) && spot.audios.length > 0) {

				return `
					${description}
					<div class="spot-modal__audios">
						${spot.audios.map(audio => `
							<div class="spot-modal__audio-item">
								<strong>${audio.title || 'Testimonio'}</strong>
								<audio controls src="${audio.src}"></audio>
							</div>
						` ).join('')}
					</div>
				`;

			}

			return `
				${description}
				<p>Agrega pistas de audio al spot.</p>
			`;

		default:
			return `
				${description}
				<p>Configura el tipo de contenido para este spot.</p>
			`;

	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerDown(event) {

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onPointerMove(event) {

	if (isUserInteracting === true) {

		lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
		lat = (onPointerDownPointerY - event.clientY) * 0.1 + onPointerDownLat;

	}

}

function onPointerUp() {

	isUserInteracting = false;

}

function animate() {

	lat = Math.max(- 85, Math.min(85, lat));
	phi = THREE.MathUtils.degToRad(90 - lat);
	theta = THREE.MathUtils.degToRad(lon);

	camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
	camera.position.y = distance * Math.cos(phi);
	camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(0, 0, 0);

	renderer.render(scene, camera);

	updateSpotScreenPositions();

}

function updateSpotScreenPositions() {

	if (spotElements.size === 0) {

		return;

	}

	const canvasBounds = renderer.domElement.getBoundingClientRect();
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	spotElements.forEach(({ element, spot }) => {

		const worldPosition = getSpotWorldPosition(spot);

		// Verificar si el spot está del lado frontal de la esfera (frente a la cámara)
		// Calcular el vector desde la cámara hacia el spot
		const cameraToSpot = new THREE.Vector3().subVectors(worldPosition, camera.position);

		// Obtener la dirección forward de la cámara (hacia donde está mirando)
		const cameraForward = new THREE.Vector3();
		camera.getWorldDirection(cameraForward);

		// Normalizar el vector desde la cámara hacia el spot
		const cameraToSpotNormalized = cameraToSpot.clone().normalize();

		// Si el producto punto es negativo, el spot está detrás de la cámara
		const dotProduct = cameraToSpotNormalized.dot(cameraForward);

		// Solo mostrar el spot si está frente a la cámara (producto punto positivo)
		/* if ( dotProduct < 0 ) {
			element.style.display = 'none';
			return;
		} 
		*/

		const projected = worldPosition.clone().project(camera);

		/* 	// Verificar si el punto está dentro del frustum de la cámara (z entre -1 y 1)
			if ( projected.z < -1 || projected.z > 1 ) {
				element.style.display = 'none';
				return;
			} 
		*/
		let x = (projected.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
		let y = (- projected.y * 0.5 + 0.5) * canvasBounds.height + canvasBounds.top;

		// Obtener el tamaño del elemento spot
		const spotRect = element.getBoundingClientRect();
		const spotWidth = spotRect.width;
		const spotHeight = spotRect.height;

		// Limitar x para que el spot se mantenga visible dentro del viewport
		if (x < 0) {
			x = 0;
		} else if (x + spotWidth > viewportWidth) {
			x = viewportWidth - spotWidth;
		}

		// Limitar y para que el spot se mantenga visible dentro del viewport
		if (y < 0) {
			y = 0;
		} else if (y + spotHeight > viewportHeight) {
			y = viewportHeight - spotHeight;
		}

		element.style.transform = `translate(${x}px, ${y}px)`;

	});
}

function getSpotWorldPosition(spot) {

	const radius = config.sphereRadius;

	const lonDeg = spot.spherical.lon ?? 0;
	const latDeg = spot.spherical.lat ?? 0;

	const phiAngle = THREE.MathUtils.degToRad(90 - latDeg);
	const thetaAngle = THREE.MathUtils.degToRad(lonDeg);

	const x = radius * Math.sin(phiAngle) * Math.sin(thetaAngle);
	const y = radius * Math.cos(phiAngle);
	const z = radius * Math.sin(phiAngle) * Math.cos(thetaAngle);

	return new THREE.Vector3(x, y, z);

}

