window.VR_CONFIG = {
    sphereRadius: 5,
    spots: [
        {
            id: 'spot-foto-1',
            type: 'photo',
            label: 'Foto',
            title: 'Archivo histórico',
            description: 'Documentación fotográfica del interior del pasaje.',
            media: './img/foto1.jpg',
            caption: 'Rescate visual 1998',
            color: '#f97316',
            spherical: { lon: 35, lat: 8 }
        },
        {
            id: 'spot-galeria-1',
            type: 'gallery',
            label: 'Galería',
            title: 'Galería de detalles',
            description: 'Selección de texturas y materiales presentes en el sitio.',
            color: '#22d3ee',
            items: [
                { src: './img/foto2.jpg', alt: 'Detalle 1' },
                { src: './img/foto3.jpg', alt: 'Detalle 2' },
                { src: './img/foto4.jpg', alt: 'Detalle 3' }
            ],
            spherical: { lon: -60, lat: -12 }
        },
        {
            id: 'spot-audio-1',
            type: 'audio',
            label: 'Testimonio',
            title: 'Voces del pasaje',
            description: 'Fragmentos de entrevistas con habitantes.',
            color: '#a78bfa',
            audios: [
                {
                    title: 'Testimonio 01',
                    src: 'https://cdn.pixabay.com/download/audio/2023/03/16/audio_199435682b.mp3?filename=night-street-story-142056.mp3'
                }
            ],
            spherical: { lon: 120, lat: 18 }
        }
    ],
            {
    "id": "spot-1763581057263",
    "type": "photo",
    "label": "Nuevo spot",
    "spherical": {
        "lon": 111.89,
        "lat": -11
    },
    "radius": 5,
    "description": "Reemplaza con el contenido correspondiente",
    "media": "./img/foto1.jpg",
    "cartesian": [
        4.554,
        -0.954,
        -1.83
    ]
}