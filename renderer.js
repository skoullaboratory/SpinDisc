const discMedia = document.getElementById('disc-media');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const rotator = document.getElementById('rotator');
const centerHole = document.getElementById('center-hole');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const { ipcRenderer } = require('electron');

zoomInBtn.addEventListener('click', () => {
  ipcRenderer.send('zoom-window', 1); // 1 for zoom in
});

zoomOutBtn.addEventListener('click', () => {
  ipcRenderer.send('zoom-window', -1); // -1 for zoom out
});

centerHole.addEventListener('click', () => {
  ipcRenderer.send('toggle-playback');
});

// 1. Thumbnail loading (persists regardless of playback)
ipcRenderer.on('media-thumbnail', (event, base64) => {
  if (base64) {
    discMedia.style.backgroundImage = `url(data:image/png;base64,${base64})`;
    discMedia.style.backgroundSize = 'cover';
    discMedia.style.backgroundPosition = 'center';
  } else {
    discMedia.style.backgroundImage = '';
  }
});

// 2. Playback Status (only controls rotation)
ipcRenderer.on('media-status', (event, isPlaying) => {
  if (isPlaying) {
    rotator.classList.add('is-playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    rotator.classList.remove('is-playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
});