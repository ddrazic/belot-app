export type Theme = 'light' | 'dark';
export type Team = 'mi' | 'vi';

export type Round = {
  id: number;
  mi: number;
  vi: number;
};

export const THEMES = {
  light: {
    primary: '#B7D5AF',
    primaryTransparent: 'rgba(183,213,175,0.55)',
    dark: '#6F8F68',
    text: '#334030',
    background: '#F5F5F5',
    white: '#FFFFFF',
    border: 'rgba(111,143,104,0.25)',
  },

  dark: {
    primary: '#6F8F68',
    primaryTransparent: 'rgba(111,143,104,0.45)',
    dark: '#B7D5AF',
    text: '#F5F5F5',
    background: '#1F261D',
    white: '#2F3A2B',
    border: 'rgba(183,213,175,0.25)',
  },
};

export const ROUTES = {
  rezultat: '/rezultat',
  unos: '/unos',
  postavke: '/postavke',
} as const;

export const DEFAULT_TARGET_SCORE = 1001;
export const DEFAULT_THEME: Theme = 'light';

export const GAME_OPTIONS = [501, 701, 1001];
export const ZVANJA = [20, 50, 100, 150, 200];

export const INITIAL_GAME_STATE = {
  rounds: JSON.stringify([]),
  targetScore: String(DEFAULT_TARGET_SCORE),
  gamesMi: '0',
  gamesVi: '0',
  theme: DEFAULT_THEME,
};