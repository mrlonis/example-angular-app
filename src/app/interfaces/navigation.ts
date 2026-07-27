/** Navigation chrome the user can pick between. Persisted, so the values are part of the API. */
export const NAVIGATION_LAYOUTS = ['tabs', 'toolbar'] as const;

export type NavigationLayout = (typeof NAVIGATION_LAYOUTS)[number];

export const DEFAULT_NAVIGATION_LAYOUT: NavigationLayout = 'tabs';

export interface NavigationLayoutOption {
  layout: NavigationLayout;
  label: string;
  icon: string;
}

/** Entries of the settings menu that switches the navigation chrome. */
export const NAVIGATION_LAYOUT_OPTIONS: readonly NavigationLayoutOption[] = [
  { layout: 'tabs', label: 'Tabs', icon: 'tab' },
  { layout: 'toolbar', label: 'Side navigation', icon: 'menu_open' },
];

export interface NavigationLink {
  path: string;
  label: string;
  icon: string;
}

/** The routed pages both navigation layouts link to, in display order. */
export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { path: 'mat-table', label: 'Mat Table', icon: 'filter_1' },
  { path: 'iframe-resizer', label: 'iframe-resizer', icon: 'filter_2' },
];

export function isNavigationLayout(value: unknown): value is NavigationLayout {
  return NAVIGATION_LAYOUTS.includes(value as NavigationLayout);
}
