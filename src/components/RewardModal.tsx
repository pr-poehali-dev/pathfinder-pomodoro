import { MapFragment } from '@/types';
import { difficultyLabel, durationLabel } from '@/lib/mapFragments';
import FragmentTile from './FragmentTile';
import Icon from '@/components/ui/icon';

interface RewardModalProps {
  fragment: MapFragment;
  onClose: () => void;
}

export default function RewardModal({ fragment, onClose }: RewardModalProps) {
  const sizeLabel = fragment.size === 'small' ? 'малый' : fragment.size === 'medium' ? 'средний' : 'крупный';
  const sz = fragment.size === 'small' ? 180 : fragment.size === 'medium' ? 220 : 260;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(28,20,10,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-4 pt-8 pb-8 px-8 w-full max-w-sm animate-scale-in rounded-t-3xl sm:rounded-3xl"
        style={{
          background: `
            radial-gradient(ellipse at 40% 20%, rgba(200,170,100,0.12) 0%, transparent 60%),
            var(--clr-paper)
          `,
          border: '1px solid var(--clr-sand)',
          boxShadow: '0 -8px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(180,150,80,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Pull handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full sm:hidden" style={{ background: 'var(--clr-sand)' }} />

        {/* Corner ornaments */}
        {[['top-5 left-5', 'border-t border-l'], ['top-5 right-5', 'border-t border-r'],
          ['bottom-5 left-5', 'border-b border-l'], ['bottom-5 right-5', 'border-b border-r']].map(([pos, brd], i) => (
          <div key={i} className={`absolute ${pos} w-4 h-4 ${brd} opacity-25`} style={{ borderColor: 'var(--clr-dust)' }} />
        ))}

        {/* Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: 'var(--clr-parchment)', border: '1px solid var(--clr-sand)' }}
        >
          <span className="text-[10px] tracking-[0.15em] uppercase font-body" style={{ color: 'var(--clr-dust)' }}>
            новый фрагмент · {sizeLabel}
          </span>
        </div>

        {/* Title */}
        <p className="font-display text-3xl text-center leading-tight" style={{ color: 'var(--clr-ink)' }}>
          {fragment.label ?? 'Кусочек мира'}
        </p>

        {/* The fragment itself — torn paper effect */}
        <div className="my-1">
          <FragmentTile fragment={fragment} size={sz} />
        </div>

        {/* Meta */}
        <p className="text-xs font-body text-center" style={{ color: 'var(--clr-dust)' }}>
          {durationLabel[fragment.duration]} · {difficultyLabel[fragment.difficulty]}
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full font-body text-sm transition-all hover:scale-105 w-full justify-center mt-1"
          style={{ background: 'var(--clr-ink)', color: 'var(--clr-parchment)' }}
        >
          <Icon name="Map" size={15} />
          Разместить на карте
        </button>
      </div>
    </div>
  );
}
