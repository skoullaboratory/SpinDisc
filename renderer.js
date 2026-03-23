const circle = document.getElementById('circle');
const resizeHandle = document.getElementById('resize-handle');
const rotator = document.getElementById('rotator');
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

// 1. Thumbnail loading (persists regardless of playback)
ipcRenderer.on('media-thumbnail', (event, base64) => {
  if (base64) {
    circle.style.backgroundImage = `url(data:image/png;base64,${base64})`;
    circle.style.backgroundSize = 'cover';
    circle.style.backgroundPosition = 'center';
  } else {
    circle.style.backgroundImage = '';
  }
});

// 2. Playback Status (only controls rotation)
ipcRenderer.on('media-status', (event, isPlaying) => {
  if (isPlaying) {
    rotator.classList.add('is-playing');
  } else {
    rotator.classList.remove('is-playing');
  }
});