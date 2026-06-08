interface TimerRingProps {
  progress: number;
  timeLeft: number;
  isRunning: boolean;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function TimerRing({ progress, timeLeft, isRunning }: TimerRingProps) {
  const r = 110;
  const cx = 140;
  const cy = 140;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      <svg width="280" height="280" className="absolute top-0 left-0">
        <defs>
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        {/* Outer decorative dashed ring */}
        <circle
          cx={cx} cy={cy} r={r + 16}
          fill="none"
          stroke="var(--clr-sand)"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.5"
        />
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--clr-sand)"
          strokeWidth="12"
          opacity="0.3"
          filter="url(#roughen)"
        />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={isRunning ? 'var(--clr-moss)' : 'var(--clr-slate)'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          filter="url(#roughen)"
        />
        {/* Inner circle fill */}
        <circle cx={cx} cy={cy} r={r - 20} fill="var(--clr-parchment)" opacity="0.6" />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-1">
        <span
          className="font-display text-6xl tracking-tight"
          style={{ color: 'var(--clr-ink)', fontVariantNumeric: 'tabular-nums' }}
        >
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--clr-dust)' }}>
          {isRunning ? 'в пути...' : timeLeft === 0 ? 'готово' : 'пауза'}
        </span>
      </div>
    </div>
  );
}
