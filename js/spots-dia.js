window.SPOTS_SETTINGS = {
	sphereRadius: 5,
	enableModal: true
};

window.SPOTS = [
	{
		id: 'dia-fachada',
		type: 'photo',
		label: 'Fachada',
		title: 'Ingreso principal',
		description: 'Vista diurna del ingreso al pasaje y su contexto inmediato.',
		media: './img/foto2.jpg',
		color: '#facc15',
		spherical: { lon: -15, lat: 4 }
	},
	{
		id: 'dia-restauracion',
		type: 'gallery',
		label: 'Proceso',
		title: 'Proceso de restauración',
		description: 'Secuencia de intervención arquitectónica.',
		color: '#34d399',
		items: [
			{ src: './img/foto3.jpg', alt: 'Registro 01' },
			{ src: './img/foto4.jpg', alt: 'Registro 02' },
			{ src: './img/foto1.jpg', alt: 'Registro 03' }
		],
		spherical: { lon: 74, lat: -8 }
	},
	{
		id: 'dia-testimonio',
		type: 'audio',
		label: 'Voz',
		title: 'Testimonio vecinal',
		description: 'Relato que acompaña el recorrido diurno.',
		color: '#fb7185',
		audios: [
			{
				title: 'Entrevista a María',
				src: 'https://cdn.pixabay.com/download/audio/2021/09/29/audio_37eecc2cf3.mp3?filename=ambient-piano-10534.mp3'
			}
		],
		spherical: { lon: 138, lat: 18 }
	},
        
	{
		id: 'dia-memoria',
		type: 'photo',
		label: 'Detalle',
		title: 'Memoria gráfica',
		description: 'Registro de archivo que evidencia los cambios del sitio.',
		media: './img/foto1.jpg',
		color: '#c084fc',
		spherical: { lon: -102, lat: -12 }
	}
];

