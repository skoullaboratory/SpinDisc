const discMedia = document.getElementById('disc-media');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const rotator = document.getElementById('rotator');
const centerHole = document.getElementById('center-hole');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const { ipcRenderer } = require('electron');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seekBackBtn = document.getElementById('seek-back-btn');
const seekFwdBtn = document.getElementById('seek-fwd-btn');

let isCommandCooldown = false;
function sendCommand(id) {
  if (isCommandCooldown) return;
  isCommandCooldown = true;
  ipcRenderer.send(id);
  setTimeout(() => { isCommandCooldown = false; }, 800); // 800ms protection
}

zoomInBtn.addEventListener('click', () => {
  ipcRenderer.send('zoom-window', 1);
});

zoomOutBtn.addEventListener('click', () => {
  ipcRenderer.send('zoom-window', -1);
});

centerHole.addEventListener('click', () => {
  sendCommand('toggle-playback');
});

prevBtn.addEventListener('click', () => {
  sendCommand('media-prev');
});

nextBtn.addEventListener('click', () => {
  sendCommand('media-next');
});

seekBackBtn.addEventListener('click', () => {
  sendCommand('media-seek-back');
});

seekFwdBtn.addEventListener('click', () => {
  sendCommand('media-seek-fwd');
});

// 1. Thumbnail loading
ipcRenderer.on('media-thumbnail', (event, base64) => {
  if (base64) {
    discMedia.style.backgroundImage = `url(data:image/png;base64,${base64})`;
    discMedia.style.backgroundSize = 'cover';
    discMedia.style.backgroundPosition = 'center';
  } else {
    discMedia.style.backgroundImage = '';
  }
});

// 2. Playback Status
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