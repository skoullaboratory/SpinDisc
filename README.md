# SpinDisc

SpinDisc is a circular, minimalist "Picture-in-Picture" (PiP) music player overlay for Windows. It acts as a transparent, frameless, and interactive desktop widget that simulates a physical record or CD, reacting in real-time to your system's media playback.

## Features

- **Real-Time Media Synchronization:** The disc rotates smoothly when music is playing and stops automatically when paused. It detects media via Windows SMTC (system media transport controls) and works with Spotify, YouTube, web browsers, and most native Windows media players.
- **Live Thumbnails:** Captures and displays the album art or thumbnail of the currently playing track directly on the surface of the disc.
- **Always on Top:** Floats transparently over any window, making it ideal for coding, designing, or gaming workspaces.
- **Dynamic Design:** Features a curveless, frameless design with realistic vinyl reflections and glassmorphism hover effects.
- **Integrated Controls:** 
  - **Click to Play/Pause:** Click the center hole of the disc to toggle playback without opening the source application.
  - **Curved UI Controls:** Semi-transparent controls that follow the natural curvature of the disc to zoom in, zoom out, or close the application.
- **Seamless Performance:** Audio monitoring is handled by a separate background worker process to guarantee UI fluidity and prevent application crashes.

## Usage

1. Launch SpinDisc.
2. Play media from your preferred application (Spotify, browser, etc.).
3. The disc will automatically sync the album art and start rotating.
4. Drag the disc from anywhere on its surface to position it on your screen.
5. Hover over the top-right curve to access zoom and close controls.

## Development

Clone the repository and install dependencies:

```bash
npm install
npm start
```

To build a standalone Windows installer:

```bash
npm run build
```

## License

ISC License
