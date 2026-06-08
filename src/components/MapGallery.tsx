import { MapData, MapFragment } from '@/types';
import { difficultyLabel, durationLabel } from '@/lib/mapFragments';
import Icon from '@/components/ui/icon';

interface MapGalleryProps {
  map: MapData;
}

const sizeMap = {
  small: 100,
  medium: 140,
  large: 180,
};

export default function MapGallery({ map }: MapGalleryProps) {
  if (map.fragments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
        <div className="text-5xl opacity-30">🗺️</div>
        <p className="font-display text-lg" style={{ color: 'var(--clr-ink)' }}>Карта пуста</p>
        <p className="text-sm font-body" style={{ color: 'var(--clr-dust)' }}>
          Выполни первый pomodoro-сеанс и получи первый кусочек
        </p>
      </div>
    );
  }

  // Calculate grid bounds
  const xs = map.fragments.map(f => f.gridX);
  const ys = map.fragments.map(f => f.gridY);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const cellSize = 160;
  const padding = 32;
  const gridW = (maxX - minX + 1) * cellSize + padding * 2;
  const gridH = (maxY - minY + 1) * cellSize + padding * 2;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(gridW, 400);
    canvas.height = Math.max(gridH, 400);
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#f5efe0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
      });

    Promise.all(map.fragments.map(f => loadImage(f.imageUrl))).then(images => {
      images.forEach((img, i) => {
        const f = map.fragments[i];
        const sz = sizeMap[f.size];
        const x = (f.gridX - minX) * cellSize + padding + (cellSize - sz) / 2;
        const y = (f.gridY - minY) * cellSize + padding + (cellSize - sz) / 2;
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.drawImage(img, x, y, sz, sz);
        ctx.restore();
      });
      const link = document.createElement('a');
      link.download = `${map.name.replace(/\s/g, '_')}_карта.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div>
          <p className="font-display text-lg" style={{ color: 'var(--clr-ink)' }}>{map.name}</p>
          <p className="text-xs font-body" style={{ color: 'var(--clr-dust)' }}>
            {map.fragments.length} {map.fragments.length === 1 ? 'фрагмент' : 'фрагментов'}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-body transition-all hover:scale-105"
          style={{ border: '1px solid var(--clr-sand)', color: 'var(--clr-dust)', background: 'var(--clr-parchment)' }}
        >
          <Icon name="Download" size={13} />
          Скачать
        </button>
      </div>

      {/* Map canvas */}
      <div
        className="relative overflow-auto rounded-2xl mx-4"
        style={{
          background: 'var(--clr-parchment)',
          border: '1px solid var(--clr-sand)',
          minHeight: 300,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: Math.max(gridW, 300),
            height: Math.max(gridH, 300),
            minWidth: '100%',
          }}
        >
          {/* Grid lines */}
          <svg
            className="absolute inset-0 pointer-events-none opacity-10"
            width="100%"
            height="100%"
          >
            {Array.from({ length: maxX - minX + 2 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * cellSize + padding}
                y1={0}
                x2={i * cellSize + padding}
                y2={gridH}
                stroke="var(--clr-dust)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}
            {Array.from({ length: maxY - minY + 2 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * cellSize + padding}
                x2={gridW}
                y2={i * cellSize + padding}
                stroke="var(--clr-dust)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}
          </svg>

          {/* Fragments */}
          {map.fragments.map(f => {
            const sz = sizeMap[f.size];
            const x = (f.gridX - minX) * cellSize + padding + (cellSize - sz) / 2;
            const y = (f.gridY - minY) * cellSize + padding + (cellSize - sz) / 2;
            return (
              <div
                key={f.id}
                className="absolute group"
                style={{ left: x, top: y, width: sz, height: sz }}
              >
                <img
                  src={f.imageUrl}
                  alt="фрагмент карты"
                  className="w-full h-full object-cover rounded-sm transition-all group-hover:scale-105"
                  style={{
                    filter: 'sepia(40%) contrast(0.9)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                />
                {/* Tooltip */}
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  style={{ background: 'var(--clr-ink)', color: 'var(--clr-parchment)' }}
                >
                  {durationLabel[f.duration]} · {difficultyLabel[f.difficulty]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fragment list */}
      <div className="px-4 flex flex-col gap-2">
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--clr-dust)' }}>История</p>
        {[...map.fragments].reverse().map(f => (
          <div
            key={f.id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: 'var(--clr-parchment)', border: '1px solid var(--clr-sand)' }}
          >
            <img
              src={f.imageUrl}
              alt=""
              className="w-10 h-10 rounded object-cover flex-shrink-0"
              style={{ filter: 'sepia(30%)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body" style={{ color: 'var(--clr-ink)' }}>
                {durationLabel[f.duration]} · {difficultyLabel[f.difficulty]}
              </p>
              <p className="text-xs" style={{ color: 'var(--clr-dust)' }}>
                {new Date(f.earnedAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
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
