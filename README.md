<p align="center">
  <h1 align="center">🌧️ 夜カフェ — Lofi Café</h1>
  <p align="center">
    <em>An immersive anime-inspired lofi music experience with ambient rain, cozy café vibes, and a pomodoro timer.</em>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Framer_Motion-12-FF0050?style=flat-square&logo=framer" />
    <img src="https://img.shields.io/badge/Zustand-5-433E38?style=flat-square" />
    <img src="https://img.shields.io/badge/Howler.js-2.2-FF6B35?style=flat-square" />
    <img src="https://img.shields.io/badge/Three.js-r170-000000?style=flat-square&logo=threedotjs" />
    <img src="https://img.shields.io/badge/React_Three_Fiber-9-000000?style=flat-square" />
    <img src="https://img.shields.io/badge/Drei-10-000000?style=flat-square" />
  </p>
</p>

---

## ✨ Overview

**Lofi Café** is a modern, fully client-side web application that recreates the experience of sitting in a cozy anime-style café on a rainy night. It combines procedurally generated lofi music, ambient soundscapes, and cinematic visual effects to create an immersive relaxation and focus environment.

No backend. No authentication. No accounts. Just pure ambience.

---

## 🎬 Features

### 🎵 Generative Lofi Music Engine
- **Procedurally generated** warm chord pad loops using the Web Audio API's `OfflineAudioContext`
- Four unique generative tracks with distinct chord progressions and tempos:
  - 🌙 **Midnight Drift** — C minor, 68 BPM
  - 🔥 **Amber Glow** — F major, 72 BPM
  - 💜 **Neon Dreams** — D minor, 65 BPM
  - 🌧️ **Rainy Horizons** — A minor, 70 BPM
- Triangle/sine oscillators with detuning for analog warmth
- Heavy low-pass filtering for that classic lofi muffled quality
- Smooth crossfade transitions between tracks via **Howler.js**
- Audio visualizer bars that react to playback state

### 🌧️ Ambient Sound System
- **Rain** — Filtered white noise with natural volume modulation (LFO)
- **Café murmur** — Brown noise through a low-pass filter for cozy background chatter
- **Wind** — Bandpass-filtered noise with slow gusts
- **Vinyl crackle** — Sparse random impulse noise for that warm record player feel
- All generated in real-time via the **Web Audio API** — no audio files needed
- Independent volume controls and toggles for each channel
- Animated level indicators per channel

### 🎨 Visual Atmosphere
- **Canvas-based rain** with depth layers, wind physics, and splash particles
- **Floating luminous particles** with glow effects, pulse, and gentle drift
- **Animated scene backgrounds** with CSS gradients, neon light sources, and building silhouettes
- **Cinematic vignette** overlay and subtle film grain texture
- **Scene transitions** with smooth Framer Motion crossfades

### 🎬 Scene System (4 Scenes)
| Scene | Japanese | Mood | Rain | Wind |
|-------|----------|------|------|------|
| Rainy Night Café | 夜のカフェ | Warm purple/amber glow | Heavy | Light |
| Urban Rooftop | 屋上の夜 | Cool cyan/pink neon | Moderate | Strong |
| Midnight Garden | 真夜中の庭 | Serene teal/green | Light drizzle | Gentle |
| Neon Alley | ネオン路地 | Vibrant purple/pink | Heavy | Still |

Each scene dynamically adjusts:
- Background gradient colors
- Neon light positions and colors
- Rain intensity and wind strength
- Particle color, count, and glow
- Building silhouette styling

### ⏱️ Pomodoro Timer
- Three modes: **Focus** (25 min) · **Break** (5 min) · **Long Break** (15 min)
- Circular SVG progress ring with color-coded modes
- Auto-transitions between focus and break sessions
- Session counter with persistence
- Japanese labels (集中 / 休憩 / 長休)

### 🖥️ UI & UX
- **Glassmorphism** panels with backdrop blur and subtle borders
- **Fullscreen mode** via the Fullscreen API
- **Hide UI** toggle for a pure ambient experience
- Responsive design — works on mobile, tablet, and desktop
- Smooth micro-animations on every interaction
- Custom-styled range sliders with purple glow
- Japanese + English bilingual labels throughout

---

## 🏗️ Architecture

```
src/
├── audio/
│   ├── ambientEngine.js        # Web Audio API ambient sound generator
│   └── musicEngine.js          # Generative lofi music + Howler.js playback
├── components/
│   ├── Audio/
│   │   ├── AmbientControls.jsx # Ambient sound mixer panel
│   │   └── MusicPlayer.jsx     # Music player with visualizer
│   ├── Background/
│   │   ├── FloatingParticles.jsx  # Canvas particle system
│   │   ├── RainEffect.jsx         # Canvas rain with splash physics
│   │   └── SceneBackground.jsx    # Animated gradient + neon backgrounds
│   ├── Timer/
│   │   └── PomodoroTimer.jsx   # Pomodoro timer with circular progress
│   └── UI/
│       ├── ControlBar.jsx      # Bottom navigation bar
│       ├── GlassPanel.jsx      # Reusable glassmorphism container
│       └── SceneSelector.jsx   # Scene picker grid
├── hooks/
│   └── useFullscreen.js        # Fullscreen API hook
├── scenes/
│   └── scenes.js               # Scene definitions + track metadata
├── stores/
│   ├── useAppStore.js          # App state (scene, panels, UI)
│   ├── useAudioStore.js        # Audio state (volumes, toggles)
│   └── useTimerStore.js        # Pomodoro timer state
├── App.jsx                     # Root component compositor
├── index.css                   # Tailwind v4 theme + global styles
└── main.jsx                    # React entry point
```

### Design Patterns

| Pattern | Usage |
|---------|-------|
| **Singleton engines** | `ambientEngine` and `musicEngine` are module-level singletons managing Web Audio API contexts |
| **Zustand + persist** | All stores use Zustand with `persist` middleware for localStorage serialization |
| **Scene-driven config** | Visual and audio parameters are data-driven from `scenes.js`, making it trivial to add new scenes |
| **Canvas rendering** | Rain and particles use raw Canvas 2D for maximum performance |
| **Offline rendering** | Music loops are pre-rendered via `OfflineAudioContext` and served as WAV blobs to Howler |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev) | 19.x | UI component framework |
| [Vite](https://vite.dev) | 8.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS with `@theme` tokens |
| [Framer Motion](https://motion.dev) | 12.x | Declarative animations & transitions |
| [Zustand](https://zustand.docs.pmnd.rs) | 5.x | Lightweight state management |
| [Howler.js](https://howlerjs.com) | 2.2.x | Audio playback management |
| [Three.js](https://threejs.org) | r170+ | 3D rendering engine |
| [React Three Fiber](https://r3f.docs.pmnd.rs) | 9.x | React renderer for Three.js |
| [Drei](https://drei.docs.pmnd.rs) | 10.x | Useful R3F helpers & abstractions |
| Web Audio API | Native | Procedural sound synthesis |
| Canvas API | Native | Rain & particle rendering |
| Fullscreen API | Native | Immersive fullscreen mode |
| localStorage | Native | Settings persistence |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone or navigate to the project directory
cd "lofi-cafe"

# Install dependencies
npm install

# Install Three.js integration (if not already present)
npm install three @react-three/fiber @react-three/drei

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 🎮 Usage Guide

### First Launch
1. Open the app in your browser
2. Click the **Play** button on the music player — this initializes the audio engine (browsers require a user gesture to start audio)
3. The generative lofi music and ambient rain will begin playing

### Controls

| Control | Action |
|---------|--------|
| ▶️ Play/Pause | Start or pause the generative music |
| ⏮ / ⏭ | Switch between the 4 generative tracks |
| 🔊 Volume slider | Adjust music volume |
| 🎬 Scenes button | Open the scene selector to change environments |
| 🎵 Ambient button | Open the ambient sound mixer |
| ⏱️ Timer button | Open the Pomodoro timer |
| ⛶ Fullscreen button | Toggle fullscreen mode |
| 👁️ Eye button | Toggle UI visibility for pure ambient mode |

### Ambient Mixer
- Toggle individual channels: **Rain**, **Café**, **Wind**, **Vinyl**
- Adjust volume per channel with independent sliders
- All settings persist across sessions via localStorage

### Pomodoro Timer
- Select mode: **Focus** (25 min), **Break** (5 min), or **Long Break** (15 min)
- Press play to start — the timer auto-transitions to break after focus completes
- Every 4 focus sessions triggers a long break
- Session count persists across page reloads

---

## 🎨 Customization

### Adding New Scenes

Edit `src/scenes/scenes.js` and add a new entry to the `scenes` array:

```javascript
{
  id: 'your-scene-id',
  name: '日本語名',           // Japanese name
  subtitle: 'English Name',  // English subtitle
  gradient: ['#color1', '#color2', '#color3'],
  accentColor: 'rgba(r, g, b, 0.6)',
  warmGlow: 'rgba(r, g, b, 0.15)',
  rainIntensity: 0.5,        // 0.0 to 1.0
  windStrength: 0.3,         // 0.0 to 1.0
  particleColor: 'rgba(r, g, b, 0.6)',
  particleCount: 25,
  ambientLight: 0.3,
  neonColors: ['#hex1', '#hex2', '#hex3'],
}
```

### Adding Real Music Tracks

The music engine supports loading external audio via Howler.js. To add real MP3 files:

1. Place `.mp3` files in the `public/music/` directory
2. Modify `src/audio/musicEngine.js` to load from URLs instead of generated blobs:

```javascript
this.howl = new Howl({
  src: ['/music/your-track.mp3'],
  loop: true,
  volume: 0,
});
```

### Theme Customization

All design tokens are defined in `src/index.css` under the `@theme` block:

```css
@theme {
  --color-primary: oklch(0.65 0.2 280);    /* Main purple */
  --color-accent: oklch(0.7 0.15 200);     /* Accent blue */
  --color-accent-warm: oklch(0.75 0.12 50); /* Warm accent */
  --color-surface: oklch(0.15 0.03 280);   /* Background */
  --color-glass: rgba(255, 255, 255, 0.04); /* Glass fill */
  /* ... */
}
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 640px) | Stacked panels, compact controls, hidden labels |
| Tablet (640px–1024px) | Side-by-side panels, full control labels |
| Desktop (> 1024px) | Full layout with all panels visible |

---

## 🔧 Key Design Decisions

1. **No external audio files** — All sounds are generated client-side using Web Audio API and `OfflineAudioContext`. This means the app works completely offline after initial load.

2. **Howler.js for playback management** — While audio is generated via Web Audio API, playback is managed through Howler.js for reliable cross-browser play/pause/fade control.

3. **Canvas over CSS for animations** — Rain and particles use HTML5 Canvas for smooth 60fps rendering without DOM overhead.

4. **Zustand over Context/Redux** — Minimal boilerplate, built-in `persist` middleware, and excellent performance with selector-based re-renders.

5. **Tailwind CSS v4 with `@theme`** — Uses the new CSS-first configuration approach for design tokens, avoiding a separate `tailwind.config.js`.

---

## 🌌 Three.js Integration

The app leverages **React Three Fiber** to render immersive anime-style animated environments directly within React's component model. **Three.js** powers the cinematic backgrounds, providing:

- **Parallax depth** — Multi-layered scenes that respond subtly to mouse/gyroscope movement
- **Floating 3D objects** — Soft geometric shapes (spheres, tori, icosahedrons) drifting through the scene for added depth
- **Ambient visual effects** — Volumetric light shafts, fog, and bloom post-processing for that dreamy anime glow
- **Scene-reactive lighting** — Dynamic point lights and ambient occlusion that shift with each scene's color palette

**Drei** provides convenient abstractions like `useTexture`, `Float`, `Stars`, and environment maps to accelerate development without writing raw Three.js boilerplate.

> **Performance note:** The project intentionally avoids heavy 3D geometry, complex shaders, or high-poly models. All Three.js scenes are kept lightweight (low vertex count, simple materials) to maintain smooth 60fps rendering and preserve the relaxing, non-distracting ambience that defines the experience.

### Example Imports

```jsx
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
```

### Integration Pattern

The Three.js canvas sits as a background layer beneath the 2D UI, blending seamlessly with the existing rain and particle canvases:

```jsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 50 }}
  style={{ position: 'fixed', inset: 0, zIndex: 5 }}
  gl={{ antialias: true, alpha: true }}
>
  <ambientLight intensity={0.2} />
  <pointLight position={[10, 10, 10]} color={scene.neonColors[0]} />
  {/* Scene-specific 3D elements */}
</Canvas>
```

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

No copyrighted anime characters or music are used. All audio is procedurally generated.

---

<p align="center">
  <em>☽ Take a deep breath and relax ☽</em>
</p>
