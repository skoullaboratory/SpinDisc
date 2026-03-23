const discMedia = document.getElementById('disc-media');
const resizeHandle = document.getElementById('resize-handle');
const rotator = document.getElementById('rotator');
const centerHole = document.getElementById('center-hole');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const { ipcRenderer } = require('electron');

let isResizing = false;
let rafId = null;

resizeHandle.addEventListener('mousedown', (e) => {
  e.stopPropagation();
  isResizing = true;

  const startMouseX = e.screenX;
  const startWidth = window.innerWidth;

  const onMouseMove = (moveEvent) => {
    if (!isResizing) return;
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const deltaX = moveEvent.screenX - startMouseX;
      const newSize = Math.max(60, startWidth + deltaX);
      ipcRenderer.send('resize-window', newSize);
      rafId = null;
    });
  };

  const onMouseUp = () => {
    isResizing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
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