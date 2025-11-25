const audioBtn = document.getElementById('audio-btn');
const audio = document.getElementById('audio');

function toggleAudio() {
	if (audio.paused) {
		audioBtn.classList.add('is-active');
		audio.play();
	} else {
		audioBtn.classList.remove('is-active');
		audio.pause();
	}
}

audioBtn.addEventListener('click', toggleAudio);