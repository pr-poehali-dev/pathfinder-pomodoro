import { MapFragment } from '@/types';
import { difficultyLabel, durationLabel } from '@/lib/mapFragments';
import Icon from '@/components/ui/icon';

interface RewardModalProps {
  fragment: MapFragment;
  onClose: () => void;
}

export default function RewardModal({ fragment, onClose }: RewardModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(40,32,20,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-5 p-8 rounded-3xl max-w-sm w-full animate-scale-in"
        style={{
          background: 'var(--clr-paper)',
          border: '1px solid var(--clr-sand)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative corner marks */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l opacity-30" style={{ borderColor: 'var(--clr-dust)' }} />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r opacity-30" style={{ borderColor: 'var(--clr-dust)' }} />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l opacity-30" style={{ borderColor: 'var(--clr-dust)' }} />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r opacity-30" style={{ borderColor: 'var(--clr-dust)' }} />

        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--clr-dust)' }}>
          новый фрагмент карты
        </p>

        <p className="font-display text-2xl text-center" style={{ color: 'var(--clr-ink)' }}>
          Путь пройден
        </p>

        {/* Fragment image */}
        <div
          className="relative"
          style={{
            width: 200,
            height: 200,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <img
            src={fragment.imageUrl}
            alt="фрагмент карты"
            className="w-full h-full object-cover"
            style={{ filter: 'sepia(30%) contrast(0.95)' }}
          />
          {/* Torn edge overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(245,239,224,0.4) 100%)',
            }}
          />
          <div
            className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          >
            {fragment.size === 'small' ? 'малый' : fragment.size === 'medium' ? 'средний' : 'крупный'}
          </div>
        </div>

        <p className="text-sm font-body text-center" style={{ color: 'var(--clr-dust)' }}>
          {durationLabel[fragment.duration]} · {difficultyLabel[fragment.difficulty]}
        </p>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-body text-sm transition-all hover:scale-105 mt-1"
          style={{ background: 'var(--clr-ink)', color: 'var(--clr-parchment)' }}
        >
          <Icon name="Map" size={15} />
          Добавить на карту
        </button>
      </div>
    </div>
  );
}
