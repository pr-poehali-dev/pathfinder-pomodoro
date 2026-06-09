export type Duration = 10 | 15 | 25;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TimerSession {
  duration: Duration;
  difficulty: Difficulty;
  endTime: number | null;
  startTime: number | null;
  isRunning: boolean;
  mapId: string;
}

export interface MapFragment {
  id: string;
  mapId: string;
  imageUrl: string;
  cropPos?: string;
  label?: string;
  duration: Duration;
  difficulty: Difficulty;
  earnedAt: number;
  size: 'small' | 'medium' | 'large';
  gridX: number;
  gridY: number;
}

export interface MapData {
  id: string;
  name: string;
  createdAt: number;
  fragments: MapFragment[];
}

export interface AppState {
  maps: MapData[];
  activeMapId: string;
  session: TimerSession | null;
}