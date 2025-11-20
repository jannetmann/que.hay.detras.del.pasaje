window.SPOTS_SETTINGS = {
	sphereRadius: 5,
	enableModal: true
};

window.SPOTS = [
	{
		id: 'noche-iluminacion',
		type: 'photo',
		label: 'Luz',
		title: 'Iluminación ambiental',
		description: 'Contraste de luces cálidas en el pasaje nocturno.',
		media: './img/foto4.jpg',
		color: '#fde047',
		spherical: { lon: 12, lat: 6 }
	},
	{
		id: 'noche-galeria',
		type: 'gallery',
		label: 'Texturas',
		title: 'Texturas nocturnas',
		description: 'Reflejos y sombras que aparecen después del anochecer.',
		color: '#38bdf8',
		items: [
			{ src: './img/foto1.jpg', alt: 'Textura 01' },
			{ src: './img/foto2.jpg', alt: 'Textura 02' },
			{ src: './img/foto3.jpg', alt: 'Textura 03' }
		],
		spherical: { lon: -68, lat: -10 }
	},
	{
		id: 'noche-audio',
		type: 'audio',
		label: 'Ambiente',
		title: 'Ambiente sonoro',
		description: 'Registro binaural de la vida nocturna.',
		color: '#f472b6',
		audios: [
			{
				title: 'Ambiente 22:15',
				src: 'https://cdn.pixabay.com/download/audio/2023/03/16/audio_199435682b.mp3?filename=night-street-story-142056.mp3'
			}
		],
		spherical: { lon: 122, lat: 20 }
	},
	{
		id: 'noche-detalle',
		type: 'photo',
		label: 'Detalle',
		title: 'Archivo nocturno',
		description: 'Documento visual que captura la quietud de la noche.',
		media: './img/foto2.jpg',
		color: '#a78bfa',
		spherical: { lon: -130, lat: -5 }
	}
];

