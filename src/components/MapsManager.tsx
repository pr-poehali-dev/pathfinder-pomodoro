import { useState } from 'react';
import { AppState } from '@/types';
import { addMap, setActiveMap } from '@/lib/storage';
import Icon from '@/components/ui/icon';

interface MapsManagerProps {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onSelectMap: (mapId: string) => void;
}

export default function MapsManager({ state, onStateChange, onSelectMap }: MapsManagerProps) {
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const next = addMap(newName.trim(), state);
    onStateChange(next);
    setNewName('');
    setCreating(false);
  };

  const handleSelect = (id: string) => {
    const next = setActiveMap(id, state);
    onStateChange(next);
    onSelectMap(id);
  };

  return (
    <div className="flex flex-col gap-4 py-4 px-4">
      <p className="font-display text-lg" style={{ color: 'var(--clr-ink)' }}>Мои карты</p>
      <p className="text-sm font-body -mt-2" style={{ color: 'var(--clr-dust)' }}>
        Каждая карта собирается независимо. Выбери карту, в которую добавляются фрагменты.
      </p>

      <div className="flex flex-col gap-2">
        {state.maps.map(m => {
          const isActive = m.id === state.activeMapId;
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer hover:scale-[1.01]"
              style={{
                background: isActive ? 'var(--clr-slate)' : 'var(--clr-parchment)',
                border: `1px solid ${isActive ? 'var(--clr-slate)' : 'var(--clr-sand)'}`,
                color: isActive ? '#fff' : 'var(--clr-ink)',
              }}
              onClick={() => handleSelect(m.id)}
            >
              <Icon name="Map" size={18} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium truncate">{m.name}</p>
                <p className="text-xs opacity-60">
                  {m.fragments.length} {m.fragments.length === 1 ? 'фрагмент' : 'фрагментов'} ·{' '}
                  {new Date(m.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              {isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  активна
                </span>
              )}
            </div>
          );
        })}
      </div>

      {creating ? (
        <div className="flex gap-2 mt-1">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="Название карты..."
            className="flex-1 px-4 py-2 rounded-xl text-sm font-body outline-none"
            style={{
              background: 'var(--clr-parchment)',
              border: '1px solid var(--clr-sand)',
              color: 'var(--clr-ink)',
            }}
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl text-sm font-body transition-all hover:scale-105"
            style={{ background: 'var(--clr-moss)', color: '#fff' }}
          >
            Создать
          </button>
          <button
            onClick={() => setCreating(false)}
            className="px-3 py-2 rounded-xl text-sm font-body"
            style={{ border: '1px solid var(--clr-sand)', color: 'var(--clr-dust)', background: 'transparent' }}
          >
            <Icon name="X" size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body transition-all hover:scale-[1.02]"
          style={{
            border: '1px dashed var(--clr-sand)',
            color: 'var(--clr-dust)',
            background: 'transparent',
          }}
        >
          <Icon name="Plus" size={15} />
          Начать новую карту
        </button>
      )}
    </div>
  );
}
