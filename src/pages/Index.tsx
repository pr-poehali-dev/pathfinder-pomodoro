import { useState } from 'react';
import { AppState, Duration, Difficulty, MapFragment } from '@/types';
import { loadState, addFragment } from '@/lib/storage';
import { generateFragment } from '@/lib/mapFragments';
import TimerScreen from '@/components/TimerScreen';
import MapGallery from '@/components/MapGallery';
import MapsManager from '@/components/MapsManager';
import RewardModal from '@/components/RewardModal';
import Icon from '@/components/ui/icon';

type Tab = 'timer' | 'map' | 'maps';

export default function Index() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [tab, setTab] = useState<Tab>('timer');
  const [reward, setReward] = useState<MapFragment | null>(null);

  const activeMap = state.maps.find(m => m.id === state.activeMapId);

  const handleComplete = (duration: Duration, difficulty: Difficulty) => {
    const fragment = generateFragment(
      state.activeMapId,
      duration,
      difficulty,
      activeMap?.fragments ?? []
    );
    const next = addFragment(fragment, state);
    setState(next);
    setReward(fragment);
  };

  const handleRewardClose = () => {
    setReward(null);
    setTab('map');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--clr-bg)', fontFamily: 'var(--font-body)' }}
    >
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--clr-sand)' }}
      >
        <div>
          <h1 className="font-display text-lg leading-tight" style={{ color: 'var(--clr-ink)' }}>
            есть только путь
          </h1>
          <p className="text-xs font-body" style={{ color: 'var(--clr-dust)' }}>
            {activeMap?.name}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'var(--clr-parchment)', border: '1px solid var(--clr-sand)' }}
        >
          <Icon name="Layers" size={12} />
          <span className="text-xs font-body" style={{ color: 'var(--clr-dust)' }}>
            {activeMap?.fragments.length ?? 0} фр.
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-24">
        {tab === 'timer' && (
          <TimerScreen
            state={state}
            onStateChange={setState}
            onComplete={handleComplete}
          />
        )}
        {tab === 'map' && activeMap && (
          <MapGallery map={activeMap} />
        )}
        {tab === 'maps' && (
          <MapsManager
            state={state}
            onStateChange={setState}
            onSelectMap={() => setTab('timer')}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-4 py-3"
        style={{
          background: 'var(--clr-paper)',
          borderTop: '1px solid var(--clr-sand)',
        }}
      >
        {([
          { id: 'timer', icon: 'Clock', label: 'Таймер' },
          { id: 'map', icon: 'Map', label: 'Карта' },
          { id: 'maps', icon: 'Layers', label: 'Все карты' },
        ] as { id: Tab; icon: string; label: string }[]).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all"
            style={{
              color: tab === id ? 'var(--clr-ink)' : 'var(--clr-dust)',
            }}
          >
            <Icon name={icon} size={20} />
            <span className="text-[10px] font-body tracking-wide">{label}</span>
            {tab === id && (
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--clr-moss)' }} />
            )}
          </button>
        ))}
      </nav>

      {/* Reward modal */}
      {reward && <RewardModal fragment={reward} onClose={handleRewardClose} />}
    </div>
  );
}
