// Obtener elementos del DOM
const modal = document.getElementById('spot-modal');
const galleryBtn = document.getElementById('gallery-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
// Inicializar Swiper
new Swiper('.swiper-container', {
	slidesPerView: 1,
	spaceBetween: 10,
	navigation: {
		nextEl: document.querySelector('.swiper-button-next'),
		prevEl: document.querySelector('.swiper-button-prev'),
	},
	pagination: {
		el: document.querySelector('.swiper-pagination'),
		clickable: true,
	},
});

// Función para abrir la galería
function openGallery() {
	modal.classList.add('is-visible');
	modal.setAttribute('aria-hidden', 'false');
}

// Función para cerrar la galería
function closeGallery() {
	modal.classList.remove('is-visible');
	modal.setAttribute('aria-hidden', 'true');
}	

// EVENTS: Configurar botón de galería y cerrar
galleryBtn.addEventListener('click', openGallery);
modalCloseBtn.addEventListener('click', closeGallery);