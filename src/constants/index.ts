export const LTCG_RATE = 0.125;
export const LTCG_EXEMPTION = 125000;

export const PRESET_RATES = [
  { label: 'Moderate', value: 12 },
  { label: 'Aggressive', value: 15 },
  { label: 'Conservative', value: 8 },
  { label: 'Safe', value: 6 },
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'SIP Calculator', path: '/sip', icon: 'Wallet' },
  { label: 'SWP Calculator', path: '/swp', icon: 'ArrowDownLeft' },
  { label: 'Lumpsum', path: '/lumpsum', icon: 'PieChart' },
  { label: 'Goal Planner', path: '/goal', icon: 'Target' },
  { label: 'Retirement', path: '/retirement', icon: 'Palmtree' },
  { label: 'CAGR Calculator', path: '/cagr', icon: 'BarChart2' },
  { label: 'Inflation Adjuster', path: '/inflation', icon: 'TrendingDown' },
  { label: 'My Policies', path: '/policies', icon: 'BookMarked' },
] as const;

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/sip': 'SIP Calculator',
  '/swp': 'SWP Calculator',
  '/goal': 'Goal Planner',
  '/retirement': 'Retirement Planning',
  '/cagr': 'CAGR Calculator',
  '/inflation': 'Inflation Calculator',
};
