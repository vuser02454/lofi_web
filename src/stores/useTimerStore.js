import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTimerStore = create(
  persist(
    (set, get) => ({
      mode: 'focus',
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      timeRemaining: 25 * 60,
      isRunning: false,
      sessionsCompleted: 0,
      intervalId: null,

      setMode: (mode) => {
        const durations = {
          focus: get().focusDuration,
          break: get().breakDuration,
          longBreak: get().longBreakDuration,
        };
        set({ mode, timeRemaining: durations[mode], isRunning: false });
        if (get().intervalId) {
          clearInterval(get().intervalId);
          set({ intervalId: null });
        }
      },

      startTimer: () => {
        if (get().intervalId) return;
        const id = setInterval(() => {
          const { timeRemaining, mode, sessionsCompleted } = get();
          if (timeRemaining <= 0) {
            clearInterval(get().intervalId);
            const newSessions = mode === 'focus' ? sessionsCompleted + 1 : sessionsCompleted;
            const nextMode = mode === 'focus'
              ? (newSessions % 4 === 0 ? 'longBreak' : 'break')
              : 'focus';
            const durations = {
              focus: get().focusDuration,
              break: get().breakDuration,
              longBreak: get().longBreakDuration,
            };
            set({
              intervalId: null,
              isRunning: false,
              sessionsCompleted: newSessions,
              mode: nextMode,
              timeRemaining: durations[nextMode],
            });
            return;
          }
          set({ timeRemaining: timeRemaining - 1 });
        }, 1000);
        set({ intervalId: id, isRunning: true });
      },

      pauseTimer: () => {
        if (get().intervalId) {
          clearInterval(get().intervalId);
          set({ intervalId: null, isRunning: false });
        }
      },

      resetTimer: () => {
        if (get().intervalId) clearInterval(get().intervalId);
        const durations = {
          focus: get().focusDuration,
          break: get().breakDuration,
          longBreak: get().longBreakDuration,
        };
        set({ intervalId: null, isRunning: false, timeRemaining: durations[get().mode] });
      },
    }),
    {
      name: 'lofi-timer-store',
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsCompleted: state.sessionsCompleted,
      }),
    }
  )
);

export default useTimerStore;
