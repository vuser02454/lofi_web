import { motion } from 'framer-motion';
import useTimerStore from '../../stores/useTimerStore';
import GlassPanel from '../UI/GlassPanel';

export default function PomodoroTimer() {
  const {
    mode, timeRemaining, isRunning, sessionsCompleted,
    startTimer, pauseTimer, resetTimer, setMode,
  } = useTimerStore();

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'break' ? 5 * 60 : 15 * 60;
  const progress = 1 - timeRemaining / totalTime;
  const circumference = 2 * Math.PI * 54;

  const modeColors = {
    focus: { ring: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', label: '集中 Focus' },
    break: { ring: '#34d399', bg: 'rgba(52,211,153,0.1)', label: '休憩 Break' },
    longBreak: { ring: '#38bdf8', bg: 'rgba(56,189,248,0.1)', label: '長休 Long Break' },
  };

  const current = modeColors[mode];

  return (
    <GlassPanel className="w-full max-w-xs text-center">
      <h3 className="text-sm font-medium tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--color-text-dim)' }}>
        ⏱️ Pomodoro
      </h3>

      {/* Mode selector */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl bg-white/5">
        {Object.entries(modeColors).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              mode === key ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
            style={mode === key ? { backgroundColor: val.bg, boxShadow: `0 0 15px ${val.ring}33` } : {}}
            id={`timer-mode-${key}`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative w-32 h-32 mx-auto mb-5">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={current.ring}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ filter: `drop-shadow(0 0 8px ${current.ring}66)` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeRemaining}
            className="text-3xl font-light tracking-wider text-white tabular-nums"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.span>
          <span className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: current.ring }}>
            {current.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={resetTimer}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          id="timer-reset-btn"
          aria-label="Reset timer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
        </button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${current.ring}cc, ${current.ring}88)`,
            boxShadow: isRunning ? `0 0 25px ${current.ring}44` : 'none',
          }}
          id="timer-play-pause-btn"
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="w-9 h-9 flex items-center justify-center">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>
            #{sessionsCompleted}
          </span>
        </div>
      </div>

      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
        Sessions completed: {sessionsCompleted}
      </p>
    </GlassPanel>
  );
}
