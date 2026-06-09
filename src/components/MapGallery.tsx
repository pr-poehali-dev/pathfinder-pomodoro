import { MapData } from '@/types';
import { difficultyLabel, durationLabel } from '@/lib/mapFragments';
import FragmentTile from './FragmentTile';
import Icon from '@/components/ui/icon';

interface MapGalleryProps {
  map: MapData;
}

const sizeMap = { small: 110, medium: 150, large: 190 };

export default function MapGallery({ map }: MapGalleryProps) {
  if (map.fragments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center px-6">
        <div
          className="w-24 h-24 rounded-2xl overflow-hidden opacity-25"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/bucket/522a1de6-400a-4a73-a970-b965ce49cf2b.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            filter: 'sepia(60%)',
          }}
        />
        <p className="font-display text-xl" style={{ color: 'var(--clr-ink)' }}>Карта пуста</p>
        <p className="text-sm font-body max-w-xs leading-relaxed" style={{ color: 'var(--clr-dust)' }}>
          Выполни первый сеанс — и первый кусочек этого мира появится на карте
        </p>
      </div>
    );
  }

  const xs = map.fragments.map(f => f.gridX);
  const ys = map.fragments.map(f => f.gridY);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const cellSize = 180;
  const padding = 40;
  const gridW = (maxX - minX + 1) * cellSize + padding * 2;
  const gridH = (maxY - minY + 1) * cellSize + padding * 2;

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <p className="font-display text-xl" style={{ color: 'var(--clr-ink)' }}>{map.name}</p>
          <p className="text-xs font-body mt-0.5" style={{ color: 'var(--clr-dust)' }}>
            {map.fragments.length} {map.fragments.length === 1 ? 'фрагмент' : map.fragments.length < 5 ? 'фрагмента' : 'фрагментов'}
          </p>
        </div>
      </div>

      {/* Map canvas */}
      <div
        className="mx-4 rounded-2xl overflow-auto"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(180,150,80,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 70%, rgba(120,100,60,0.06) 0%, transparent 50%),
            var(--clr-parchment)
          `,
          border: '1px solid var(--clr-sand)',
          boxShadow: 'inset 0 0 40px rgba(120,90,40,0.08)',
          minHeight: 300,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: Math.max(gridW, 320),
            height: Math.max(gridH, 300),
            minWidth: '100%',
          }}
        >
          {/* Subtle grid */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {Array.from({ length: maxX - minX + 2 }).map((_, i) => (
              <line key={`v${i}`}
                x1={i * cellSize + padding} y1={0}
                x2={i * cellSize + padding} y2={gridH}
                stroke="var(--clr-dust)" strokeWidth="0.5" strokeDasharray="3 10" opacity="0.2"
              />
            ))}
            {Array.from({ length: maxY - minY + 2 }).map((_, i) => (
              <line key={`h${i}`}
                x1={0} y1={i * cellSize + padding}
                x2={gridW} y2={i * cellSize + padding}
                stroke="var(--clr-dust)" strokeWidth="0.5" strokeDasharray="3 10" opacity="0.2"
              />
            ))}
          </svg>

          {/* Fragment pieces */}
          {map.fragments.map(f => {
            const sz = sizeMap[f.size];
            const x = (f.gridX - minX) * cellSize + padding + (cellSize - sz) / 2;
            const y = (f.gridY - minY) * cellSize + padding + (cellSize - sz) / 2;
            return (
              <div key={f.id} className="absolute" style={{ left: x, top: y }}>
                <FragmentTile
                  fragment={f}
                  size={sz}
                  showTooltip
                  tooltipText={f.label ?? `${durationLabel[f.duration]} · ${difficultyLabel[f.difficulty]}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Fragment history list */}
      <div className="px-4 flex flex-col gap-2">
        <p className="text-[10px] tracking-[0.15em] uppercase font-body px-1" style={{ color: 'var(--clr-dust)' }}>
          История находок
        </p>
        {[...map.fragments].reverse().map(f => (
          <div
            key={f.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'var(--clr-parchment)', border: '1px solid var(--clr-sand)' }}
          >
            {/* Mini crop preview */}
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden"
              style={{
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={f.imageUrl}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: f.cropPos ?? '50% 50%',
                  filter: 'sepia(20%)',
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium truncate" style={{ color: 'var(--clr-ink)' }}>
                {f.label ?? 'Фрагмент карты'}
              </p>
              <p className="text-xs" style={{ color: 'var(--clr-dust)' }}>
                {durationLabel[f.duration]} · {difficultyLabel[f.difficulty]} ·{' '}
                {new Date(f.earnedAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-body"
              style={{
                background: f.size === 'large' ? 'var(--clr-moss)' : f.size === 'medium' ? 'var(--clr-slate)' : 'var(--clr-sand)',
                color: f.size === 'small' ? 'var(--clr-dust)' : '#fff',
              }}
            >
              {f.size === 'small' ? 'малый' : f.size === 'medium' ? 'средний' : 'крупный'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
