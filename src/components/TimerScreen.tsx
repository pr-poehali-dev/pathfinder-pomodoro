import { useState, useEffect, useCallback, useRef } from 'react';
import { Duration, Difficulty, TimerSession, AppState } from '@/types';
import { saveSession } from '@/lib/storage';
import { difficultyLabel, durationLabel } from '@/lib/mapFragments';
import TimerRing from './TimerRing';
import Icon from '@/components/ui/icon';

interface TimerScreenProps {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onComplete: (duration: Duration, difficulty: Difficulty) => void;
}

const DURATIONS: Duration[] = [10, 15, 25];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export default function TimerScreen({ state, onStateChange, onComplete }: TimerScreenProps) {
  const [duration, setDuration] = useState<Duration>(25);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeMap = state.maps.find(m => m.id === state.activeMapId)!;

  // Restore session on mount
  useEffect(() => {
    const s = state.session;
    if (s && s.isRunning && s.endTime) {
      const remaining = Math.round((s.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setDuration(s.duration);
        setDifficulty(s.difficulty);
        setTimeLeft(remaining);
        setIsRunning(true);
      } else {
        setTimeLeft(0);
        setIsDone(true);
        setIsRunning(false);
        setDuration(s.duration);
        setDifficulty(s.difficulty);
      }
    } else if (s && !s.isRunning && s.endTime) {
      const remaining = Math.round((s.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setDuration(s.duration);
        setDifficulty(s.difficulty);
        setTimeLeft(remaining);
        setIsRunning(false);
      }
    } else {
      setTimeLeft(duration * 60);
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setIsDone(true);
          const next = saveSession(null, state);
          onStateChange(next);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    const secs = duration * 60;
    const endTime = Date.now() + secs * 1000;
    const session: TimerSession = {
      duration,
      difficulty,
      endTime,
      startTime: Date.now(),
      isRunning: true,
      mapId: state.activeMapId,
    };
    const next = saveSession(session, state);
    onStateChange(next);
    setTimeLeft(secs);
    setIsRunning(true);
    setIsDone(false);
  }, [duration, difficulty, state]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const next = saveSession(null, state);
    onStateChange(next);
    setTimeLeft(duration * 60);
    setIsDone(false);
  }, [duration, state]);

  const handleConfirm = () => {
    onComplete(duration, difficulty);
    setIsDone(false);
    setTimeLeft(duration * 60);
  };

  const handleSkip = () => {
    setIsDone(false);
    setTimeLeft(duration * 60);
  };

  const total = duration * 60;
  const progress = total > 0 ? timeLeft / total : 1;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Map indicator */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{
        borderColor: 'var(--clr-sand)',
        background: 'var(--clr-parchment)',
        color: 'var(--clr-dust)'
      }}>
        <Icon name="Map" size={14} />
        <span className="text-xs font-body">{activeMap?.name}</span>
        <span className="text-xs opacity-50">· {activeMap?.fragments.length} фр.</span>
      </div>

      {/* Timer ring */}
      <TimerRing
        progress={isDone ? 1 : (isRunning || timeLeft < total ? progress : 1)}
        timeLeft={timeLeft}
        isRunning={isRunning}
      />

      {/* Done confirmation */}
      {isDone && (
        <div className="animate-fade-in flex flex-col items-center gap-4 text-center px-6">
          <p className="font-display text-xl" style={{ color: 'var(--clr-ink)' }}>
            Ты выполнял задуманное?
          </p>
          <p className="text-sm font-body" style={{ color: 'var(--clr-dust)' }}>
            Если да — получишь новый кусочек карты
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-full font-body text-sm transition-all hover:scale-105"
              style={{ background: 'var(--clr-moss)', color: '#fff' }}
            >
              Да, я шёл своим путём
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-2.5 rounded-full font-body text-sm transition-all"
              style={{ border: '1px solid var(--clr-sand)', color: 'var(--clr-dust)', background: 'transparent' }}
            >
              Не совсем
            </button>
          </div>
        </div>
      )}

      {/* Controls — when not running */}
      {!isRunning && !isDone && (
        <div className="animate-fade-in flex flex-col items-center gap-6 w-full max-w-xs">
          {/* Duration */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--clr-dust)' }}>Длительность</span>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => { setDuration(d); setTimeLeft(d * 60); }}
                  className="px-4 py-1.5 rounded-full text-sm font-body transition-all hover:scale-105"
                  style={{
                    background: duration === d ? 'var(--clr-slate)' : 'var(--clr-parchment)',
                    color: duration === d ? '#fff' : 'var(--clr-ink)',
                    border: `1px solid ${duration === d ? 'var(--clr-slate)' : 'var(--clr-sand)'}`,
                  }}
                >
                  {durationLabel[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--clr-dust)' }}>Сложность задачи</span>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="px-4 py-1.5 rounded-full text-sm font-body transition-all hover:scale-105"
                  style={{
                    background: difficulty === d ? 'var(--clr-terracotta)' : 'var(--clr-parchment)',
                    color: difficulty === d ? '#fff' : 'var(--clr-ink)',
                    border: `1px solid ${difficulty === d ? 'var(--clr-terracotta)' : 'var(--clr-sand)'}`,
                  }}
                >
                  {difficultyLabel[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-body text-base transition-all hover:scale-105 shadow-md"
            style={{ background: 'var(--clr-ink)', color: 'var(--clr-parchment)' }}
          >
            <Icon name="Play" size={16} />
            Начать путь
          </button>
        </div>
      )}

      {/* Stop button — when running */}
      {isRunning && (
        <button
          onClick={handleStop}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-body text-sm transition-all opacity-60 hover:opacity-100"
          style={{ border: '1px solid var(--clr-sand)', color: 'var(--clr-dust)', background: 'transparent' }}
        >
          <Icon name="Square" size={14} />
          Остановить
        </button>
      )}
    </div>
  );
}