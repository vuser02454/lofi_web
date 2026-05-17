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
    <section className="dark-card p-6 text-center">
      <h3 className="text-[10px] uppercase tracking-[0.15em] dark-text-muted font-medium mb-4">
        ⏱️ Pomodoro
      </h3>

      {/* Mode selector */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[#252525] border border-[#333]">
        {Object.entries(modeColors).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              mode === key ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
            style={mode === key ? { backgroundColor: val.bg, border: `1px solid ${val.ring}50`, boxShadow: `0 0 10px ${val.ring}20` } : {}}
            id={`timer-mode-${key}`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative w-36 h-36 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2a2a" strokeWidth="5" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={current.ring}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ filter: `drop-shadow(0 0 8px ${current.ring}66)` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeRemaining}
            className="text-4xl font-semibold tracking-wider text-white tabular-nums"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.span>
          <span className="text-[10px] mt-1 tracking-widest uppercase font-medium" style={{ color: current.ring }}>
            {current.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-[#252525] border border-[#333] hover:bg-[#2a2a2a] flex items-center justify-center transition-all text-gray-400 hover:text-white"
          id="timer-reset-btn"
          aria-label="Reset timer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
        </button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${current.ring}, ${current.ring}dd)`,
            boxShadow: isRunning ? `0 0 20px ${current.ring}88` : `0 4px 10px rgba(0,0,0,0.3)`,
          }}
          id="timer-play-pause-btn"
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-400">
            #{sessionsCompleted}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
        Sessions completed: {sessionsCompleted}
      </p>
    </section>
  );
}
