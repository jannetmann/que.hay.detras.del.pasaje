import * as THREE from 'three';

const markerModal = document.getElementById( 'marker-modal' );
const markerReference = document.getElementById( 'marker-reference' );
const openMarkerButton = document.getElementById( 'open-marker-modal' );
const closeMarkerButton = markerModal?.querySelector( '[data-marker-close]' );
const coordinatesLabel = document.querySelector( '[data-marker-coordinates]' );
const snippetOutput = document.querySelector( '[data-marker-snippet]' );
const copySnippetButton = document.querySelector( '[data-marker-copy]' );

const sphereRadius = window.SPOTS_SETTINGS?.sphereRadius ?? window.VR_CONFIG?.sphereRadius ?? 5;

if ( openMarkerButton && markerModal ) {

	openMarkerButton.addEventListener( 'click', () => toggleMarkerModal( true ) );

}

if ( closeMarkerButton && markerModal ) {

	closeMarkerButton.addEventListener( 'click', () => toggleMarkerModal( false ) );

}

if ( markerModal ) {

	markerModal.addEventListener( 'click', event => {

		if ( event.target === markerModal ) {

			toggleMarkerModal( false );

		}

	} );

}

if ( markerReference ) {

	markerReference.addEventListener( 'click', event => {

		event.preventDefault();
		processMarkerClick( event );

	} );

}

if ( copySnippetButton && snippetOutput ) {

	copySnippetButton.addEventListener( 'click', () => {

		if ( ! snippetOutput.textContent?.trim() ) {

			return;

		}

		navigator.clipboard?.writeText( snippetOutput.textContent )
			.then( () => {

				copySnippetButton.textContent = 'Copiado';
				setTimeout( () => ( copySnippetButton.textContent = 'Copiar JSON' ), 1500 );

			} )
			.catch( () => {

				copySnippetButton.textContent = 'Error';
				setTimeout( () => ( copySnippetButton.textContent = 'Copiar JSON' ), 1500 );

			} );

	} );

}

function toggleMarkerModal( shouldShow ) {

	if ( ! markerModal ) {

		return;

	}

	markerModal.classList.toggle( 'is-visible', shouldShow );
	markerModal.setAttribute( 'aria-hidden', shouldShow ? 'false' : 'true' );

}

function processMarkerClick( event ) {

	const bounds = markerReference.getBoundingClientRect();
	const relativeX = ( event.clientX - bounds.left ) / bounds.width;
	const relativeY = ( event.clientY - bounds.top ) / bounds.height;

	const lon = +( relativeX * 360 - 180 ).toFixed( 2 );
	const lat = +( 90 - relativeY * 180 ).toFixed( 2 );

	const cartesian = sphericalToCartesian( lat, lon, sphereRadius );

	if ( coordinatesLabel ) {

		coordinatesLabel.textContent = `lon: ${ lon }°, lat: ${ lat }°`;

	}

	if ( snippetOutput ) {

		const snippet = {
			id: `spot-${ Date.now() }`,
			type: 'photo',
			label: 'Nuevo spot',
			spherical: { lon, lat },
			radius: sphereRadius,
			description: 'Reemplaza con el contenido correspondiente',
			media: './img/foto1.jpg'
		};

		snippetOutput.textContent = JSON.stringify(
			{
				...snippet,
				cartesian
			},
			null,
			2
		);

	}

}

function sphericalToCartesian( lat, lon, radius ) {

	const phi = THREE.MathUtils.degToRad( 90 - lat );
	const theta = THREE.MathUtils.degToRad( lon );

	const x = +( radius * Math.sin( phi ) * Math.sin( theta ) ).toFixed( 3 );
	const y = +( radius * Math.cos( phi ) ).toFixed( 3 );
	const z = +( radius * Math.sin( phi ) * Math.cos( theta ) ).toFixed( 3 );

	return [ x, y, z ];

}


