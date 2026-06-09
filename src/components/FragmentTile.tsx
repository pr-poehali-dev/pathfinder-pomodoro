import { MapFragment } from '@/types';

interface FragmentTileProps {
  fragment: MapFragment;
  size: number;
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

// Each fragment gets a unique torn-paper clipPath shape based on its id
function getTornClipId(id: string) {
  return `torn-${id.slice(0, 8)}`;
}

function TornClipDef({ id, w, h }: { id: string; w: number; h: number }) {
  // Generate irregular polygon based on id hash for reproducibility
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (n: number) => (((seed * 9301 + n * 49297) % 233280) / 233280);

  const steps = 24;
  const points: string[] = [];

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const side = i % (steps / 4); // which edge
    const t = side / (steps / 4);

    // Base point on border rectangle
    let bx: number, by: number;
    const seg = Math.floor(i / (steps / 4));
    if (seg === 0) { bx = t * w; by = 0; }
    else if (seg === 1) { bx = w; by = t * h; }
    else if (seg === 2) { bx = (1 - t) * w; by = h; }
    else { bx = 0; by = (1 - t) * h; }

    // Inward jitter: torn paper — bigger tears on edges
    const jitter = rng(i * 7 + 3) * 0.12 + rng(i * 13) * 0.06;
    const inward = jitter * Math.min(w, h);

    // Push inward toward center
    const cx = w / 2, cy = h / 2;
    const dx = cx - bx, dy = cy - by;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const px = bx + (dx / len) * inward;
    const py = by + (dy / len) * inward;

    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return (
    <clipPath id={getTornClipId(id)} clipPathUnits="userSpaceOnUse">
      <polygon points={points.join(' ')} />
    </clipPath>
  );
}

export default function FragmentTile({ fragment, size, className = '', showTooltip, tooltipText }: FragmentTileProps) {
  const clipId = getTornClipId(fragment.id);

  return (
    <div
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <TornClipDef id={fragment.id} w={size} h={size} />
        </defs>
      </svg>

      {/* Shadow layer */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `url(#${clipId})`,
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))',
        }}
      >
        <img
          src={fragment.imageUrl}
          alt={fragment.label ?? 'фрагмент карты'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: fragment.cropPos ?? '50% 50%',
            filter: 'sepia(25%) contrast(0.92) brightness(1.04)',
            display: 'block',
          }}
        />
        {/* Parchment edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(165,128,72,0.35) 100%)',
          }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
          style={{ background: 'var(--clr-ink)', color: 'var(--clr-parchment)' }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
