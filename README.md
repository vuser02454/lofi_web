# ☕ Lofi Café — Rainy Night Ambience

A beautifully crafted, immersive lofi music & ambient sound web experience inspired by Studio Ghibli aesthetics. Relax, focus, and study with HD anime background loops, ambient soundscapes, a Pomodoro timer, and Spotify integration — all wrapped in a cozy glassmorphism UI.

🌐 **Live Demo:** [lofi-web-anime.vercel.app](https://lofi-web-anime.vercel.app)

---

## ✨ Features

### 🎬 HD Anime Video Backgrounds
- Looping cinematic backgrounds from **Kimi No Nawa**, **Garden of Words**, and **Weathering With You**
- Smooth scene switching with a built-in scene selector
- Full-viewport coverage on both desktop and mobile (using `100dvh`)

### 🎵 Music Player
- **Local Chill Mode** — Built-in lo-fi tracks with play/pause, skip, and volume controls
- **Spotify Integration** — Paste any Spotify playlist, album, or track link to embed it directly
- Now Playing display with track info (key, BPM)

### 🎧 Ambient Sound Mixer
- Layer ambient sounds on top of your music:
  - 🌧️ Rain
  - ☕ Café chatter
  - 🍃 Wind
  - 💿 Vinyl crackle
- Individual volume sliders for each channel

### 🍅 Pomodoro Timer
- Focus / Short Break / Long Break presets (25 / 5 / 15 min)
- Animated circular progress ring
- Session tracking dots
- Alert on session completion

### ⏱️ Stopwatch
- Start / Pause / Reset controls
- Lap recording with scrollable lap list

### 📝 Task Notes
- Quick to-do list with check-off functionality
- Minimal, distraction-free design

### 😌 Mood Tracker
- One-tap mood selection with emoji reactions
- Daily inspirational quotes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Zustand** | Lightweight state management |
| **Framer Motion** | Smooth tab transitions & animations |
| **Tailwind CSS 4** | Utility-first styling |
| **Web Audio API** | Ambient sound engine |
| **Spotify Embed API** | Playlist integration |
| **Vercel** | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/vuser02454/lofi_web.git
cd lofi_web

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npx vercel --prod
```

---

## 📁 Project Structure

```
├── public/
│   └── videos/                  # HD anime background videos
│       ├── kimi-no-nawa-1.mp4
│       ├── kimi-no-nawa-2.mp4
│       ├── kimi-no-nawa-3.mp4
│       ├── garden-of-words.mp4
│       └── weathering-with-you.mp4
├── src/
│   ├── audio/
│   │   ├── ambientEngine.js     # Web Audio API ambient sound mixer
│   │   └── musicEngine.js       # Music playback engine
│   ├── components/
│   │   ├── Audio/
│   │   │   ├── AmbientControls.jsx
│   │   │   ├── MusicPlayer.jsx
│   │   │   └── SpotifyPlayer.jsx
│   │   ├── Background/
│   │   │   └── MediaBackground.jsx  # Video background renderer
│   │   ├── Timer/
│   │   │   └── PomodoroTimer.jsx
│   │   └── UI/
│   │       ├── LoFiDashboard.jsx    # Main dashboard drawer
│   │       └── GlassPanel.jsx
│   ├── stores/
│   │   ├── useAudioStore.js     # Audio state (music, ambient)
│   │   ├── useBackgroundStore.js # Background video state
│   │   └── useAppStore.js
│   ├── scenes/
│   │   └── scenes.js            # Track metadata & scene configs
│   ├── App.jsx                  # Root layout
│   ├── main.jsx                 # Entry point
│   └── index.css                # Design tokens & global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

The UI uses a **warm, analog-inspired** design language:

- **Typography:** Vollkorn (headings) + Plus Jakarta Sans (body)
- **Color Palette:** Muted purples, warm oranges, soft ivory backgrounds
- **Glass Panels:** `backdrop-filter: blur(20px)` with subtle grain textures
- **Animations:** Framer Motion blur-fade transitions between tabs

---

## 📱 Responsive Design

- **Desktop:** 420px side drawer with full background visibility
- **Mobile:** 70vw compact drawer so the HD background stays visible
- **Dynamic Viewport:** Uses `100dvh` for proper full-screen on mobile browsers

---

## 📄 License

This project is for personal and educational use. Anime video clips are used under fair use for non-commercial purposes.

---

<p align="center">
  Made with 💜 and lots of ☕
</p>
