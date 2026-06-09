import { Duration, Difficulty, MapFragment } from '@/types';

export type FragmentSize = 'small' | 'medium' | 'large';

// Two real map images — we crop different regions via objectPosition
const MAP_A = 'https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/bucket/1a7653dc-c3c2-4d4f-bfa0-384dfe8cdfd2.jpg'; // fish/ships map
const MAP_B = 'https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/bucket/522a1de6-400a-4a73-a970-b965ce49cf2b.jpg'; // castle map

// Each fragment: { src, objectPosition, label }
// objectPosition controls which crop area is shown (CSS object-fit: cover)
export const FRAGMENTS: Array<{
  src: string;
  pos: string; // CSS object-position
  label: string;
}> = [
  // MAP_A (ships) — 4 quadrants + center zones
  { src: MAP_A, pos: '10% 15%',  label: 'Чайниковая гора' },
  { src: MAP_A, pos: '75% 10%',  label: 'Башня кофе' },
  { src: MAP_A, pos: '20% 55%',  label: 'Корабль-кружка' },
  { src: MAP_A, pos: '55% 55%',  label: 'Рыба-субмарина' },
  { src: MAP_A, pos: '85% 55%',  label: 'Воздушный галеон' },
  { src: MAP_A, pos: '40% 85%',  label: 'Постоялый двор' },
  // MAP_B (castle) — 4 quadrants + center zones
  { src: MAP_B, pos: '15% 10%',  label: 'Чайниковая скала' },
  { src: MAP_B, pos: '80% 8%',   label: 'Кофейная башня' },
  { src: MAP_B, pos: '50% 40%',  label: 'Замок в центре' },
  { src: MAP_B, pos: '15% 65%',  label: 'Деревня Брюстон' },
  { src: MAP_B, pos: '80% 50%',  label: 'Восточные поля' },
  { src: MAP_B, pos: '50% 85%',  label: 'Парусник' },
];

export const getFragmentSize = (duration: Duration, difficulty: Difficulty): FragmentSize => {
  const score =
    (duration === 10 ? 1 : duration === 15 ? 2 : 3) +
    (difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1 : 2);
  if (score <= 2) return 'small';
  if (score <= 4) return 'medium';
  return 'large';
};

export const generateFragment = (
  mapId: string,
  duration: Duration,
  difficulty: Difficulty,
  existingFragments: MapFragment[]
): MapFragment => {
  const size = getFragmentSize(duration, difficulty);

  // Pick fragment that hasn't been used yet, or random if all used
  const usedLabels = new Set(existingFragments.map(f => f.label));
  const available = FRAGMENTS.filter(f => !usedLabels.has(f.label));
  const pool = available.length > 0 ? available : FRAGMENTS;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  // Grid position: attach to existing or start at 0,0
  const usedPositions = new Set(existingFragments.map(f => `${f.gridX},${f.gridY}`));
  let gridX = 0;
  let gridY = 0;

  if (existingFragments.length > 0) {
    const last = existingFragments[existingFragments.length - 1];
    const neighbors = [
      [last.gridX + 1, last.gridY],
      [last.gridX - 1, last.gridY],
      [last.gridX, last.gridY + 1],
      [last.gridX, last.gridY - 1],
      [last.gridX + 1, last.gridY + 1],
      [last.gridX - 1, last.gridY - 1],
    ];
    const free = neighbors.filter(([x, y]) => !usedPositions.has(`${x},${y}`));
    const target = free.length > 0 ? free[Math.floor(Math.random() * free.length)] : [last.gridX + 1, last.gridY];
    gridX = target[0];
    gridY = target[1];
  }

  return {
    id: crypto.randomUUID(),
    mapId,
    imageUrl: pick.src,
    cropPos: pick.pos,
    label: pick.label,
    duration,
    difficulty,
    earnedAt: Date.now(),
    size,
    gridX,
    gridY,
  };
};

export const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Простая',
  medium: 'Средняя',
  hard: 'Сложная',
};

export const durationLabel: Record<Duration, string> = {
  10: '10 мин',
  15: '15 мин',
  25: '25 мин',
};
