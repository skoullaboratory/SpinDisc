const { SMTCMonitor, PlaybackStatus } = require('@coooookies/windows-smtc-monitor');

let currentThumbHash = null;
let lastPlayingState = null;

function updateUI() {
  try {
    const session = SMTCMonitor.getCurrentMediaSession();
    
    if (session) {
      // 1. Send playback status for rotation (independent of thumbnail)
      const isPlaying = (session.playback && session.playback.playbackStatus === PlaybackStatus.PLAYING);
      if (lastPlayingState !== isPlaying) {
        lastPlayingState = isPlaying;
        process.send({ type: 'status', playing: isPlaying });
      }

      // 2. Send thumbnail (persistence during pause)
      if (session.media && session.media.thumbnail) {
        const base64 = session.media.thumbnail.toString('base64');
        const hash = base64.slice(0, 50) + base64.slice(-50);
        
        if (currentThumbHash !== hash) {
          currentThumbHash = hash;
          process.send({ type: 'thumbnail', base64 });
        }
      }
    } else {
      // No sessions active - clear everything
      if (lastPlayingState !== false) {
        lastPlayingState = false;
        process.send({ type: 'status', playing: false });
      }
      if (currentThumbHash !== null) {
        currentThumbHash = null;
        process.send({ type: 'thumbnail', base64: null });
      }
    }
  } catch (e) {
    // Silence errors to keep worker alive
  }
}

setInterval(updateUI, 500);
updateUI();
