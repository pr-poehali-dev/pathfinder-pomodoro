import { Duration, Difficulty, MapFragment } from '@/types';

const FRAGMENT_IMAGES = [
  'https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/files/44530597-10ea-4f48-8c91-ea2e0797af30.jpg',
  'https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/files/3700719d-e8bf-4781-a293-3acb1c880995.jpg',
  'https://cdn.poehali.dev/projects/b2e1cb16-a83f-43b7-9420-18a63712eaf8/files/37b844e5-2b0c-4933-9b02-42c0a9e794f4.jpg',
];

export type FragmentSize = 'small' | 'medium' | 'large';

export const getFragmentSize = (duration: Duration, difficulty: Difficulty): FragmentSize => {
  const score = (duration === 10 ? 1 : duration === 15 ? 2 : 3) +
    (difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1 : 2);
  if (score <= 2) return 'small';
  if (score <= 4) return 'medium';
  return 'large';
};

const usedPositions = new Set<string>();

export const generateFragment = (
  mapId: string,
  duration: Duration,
  difficulty: Difficulty,
  existingFragments: MapFragment[]
): MapFragment => {
  const size = getFragmentSize(duration, difficulty);
  const imageUrl = FRAGMENT_IMAGES[Math.floor(Math.random() * FRAGMENT_IMAGES.length)];

  usedPositions.clear();
  existingFragments.forEach(f => usedPositions.add(`${f.gridX},${f.gridY}`));

  let gridX = 0;
  let gridY = 0;

  if (existingFragments.length === 0) {
    gridX = 0;
    gridY = 0;
  } else {
    const last = existingFragments[existingFragments.length - 1];
    const neighbors = [
      [last.gridX + 1, last.gridY],
      [last.gridX - 1, last.gridY],
      [last.gridX, last.gridY + 1],
      [last.gridX, last.gridY - 1],
      [last.gridX + 1, last.gridY + 1],
      [last.gridX - 1, last.gridY + 1],
    ];
    const free = neighbors.filter(([x, y]) => !usedPositions.has(`${x},${y}`));
    if (free.length > 0) {
      const pick = free[Math.floor(Math.random() * free.length)];
      gridX = pick[0];
      gridY = pick[1];
    } else {
      gridX = last.gridX + 1;
      gridY = last.gridY;
    }
  }

  return {
    id: crypto.randomUUID(),
    mapId,
    imageUrl,
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
