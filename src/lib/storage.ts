import { AppState, MapData, MapFragment, TimerSession } from '@/types';

const KEY = 'only_the_path_v1';

export const defaultState = (): AppState => {
  const mapId = crypto.randomUUID();
  return {
    maps: [{ id: mapId, name: 'Первая карта', createdAt: Date.now(), fragments: [] }],
    activeMapId: mapId,
    session: null,
  };
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const saveSession = (session: TimerSession | null, state: AppState): AppState => {
  const next = { ...state, session };
  saveState(next);
  return next;
};

export const addFragment = (fragment: MapFragment, state: AppState): AppState => {
  const maps = state.maps.map(m =>
    m.id === fragment.mapId ? { ...m, fragments: [...m.fragments, fragment] } : m
  );
  const next = { ...state, maps, session: null };
  saveState(next);
  return next;
};

export const addMap = (name: string, state: AppState): AppState => {
  const id = crypto.randomUUID();
  const newMap: MapData = { id, name, createdAt: Date.now(), fragments: [] };
  const next = { ...state, maps: [...state.maps, newMap], activeMapId: id };
  saveState(next);
  return next;
};

export const setActiveMap = (mapId: string, state: AppState): AppState => {
  const next = { ...state, activeMapId: mapId };
  saveState(next);
  return next;
};
