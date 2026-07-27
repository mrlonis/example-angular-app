import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NAVIGATION_LAYOUT_OPTIONS, NAVIGATION_LINKS } from '../../interfaces/navigation';
import { Settings } from '../../services/settings';
import { Shell } from './shell';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let host: HTMLElement;
  let settings: Settings;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function openSettingsMenu(): void {
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="settings-trigger"]');

    if (!trigger) {
      throw new Error('Expected the settings trigger to be rendered');
    }

    trigger.click();
    fixture.detectChanges();
  }

  function menuItem(layout: string): HTMLButtonElement {
    const item = overlayContainerElement.querySelector<HTMLButtonElement>(
      `[data-testid="navigation-layout-${layout}"]`,
    );

    if (!item) {
      throw new Error(`Expected a menu item for the ${layout} layout`);
    }

    return item;
  }

  function drawerToggle(): HTMLButtonElement {
    const toggle = host.querySelector<HTMLButtonElement>('button[aria-controls="app-drawer"]');

    if (!toggle) {
      throw new Error('Expected the drawer toggle to be rendered');
    }

    return toggle;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter(NAVIGATION_LINKS.map((link) => ({ path: link.path, children: [] }))),
      ],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    settings = TestBed.inject(Settings);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the tab layout by default', () => {
    expect(host.querySelector('app-tabs-layout')).toBeTruthy();
    expect(host.querySelector('app-toolbar-layout')).toBeNull();
  });

  it('hides the drawer toggle while the tab layout is active', () => {
    expect(host.querySelector('button[aria-controls="app-drawer"]')).toBeNull();
  });

  it('labels the icon-only app bar buttons and hides their icons', () => {
    const labels = Array.from(host.querySelectorAll('mat-toolbar button'), (button) =>
      button.getAttribute('aria-label'),
    );

    expect(labels).toEqual(['Favorite', 'Share', 'Settings']);

    for (const icon of host.querySelectorAll('mat-toolbar mat-icon')) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('offers every navigation layout as a checkable menu item', () => {
    openSettingsMenu();

    for (const option of NAVIGATION_LAYOUT_OPTIONS) {
      const item = menuItem(option.layout);

      expect(item.getAttribute('role')).toBe('menuitemradio');
      expect(item.textContent).toContain(option.label);
    }

    expect(menuItem('tabs').getAttribute('aria-checked')).toBe('true');
    expect(menuItem('toolbar').getAttribute('aria-checked')).toBe('false');
  });

  it('swaps to the toolbar layout when it is selected', () => {
    openSettingsMenu();
    menuItem('toolbar').click();
    fixture.detectChanges();

    expect(settings.navigationLayout()).toBe('toolbar');
    expect(host.querySelector('app-toolbar-layout')).toBeTruthy();
    expect(host.querySelector('app-tabs-layout')).toBeNull();
  });

  it('follows the layout the settings service reports', () => {
    settings.setNavigationLayout('toolbar');
    fixture.detectChanges();

    expect(host.querySelector('app-toolbar-layout')).toBeTruthy();

    settings.setNavigationLayout('tabs');
    fixture.detectChanges();

    expect(host.querySelector('app-tabs-layout')).toBeTruthy();
  });

  it('describes the drawer toggle by the current drawer state', () => {
    settings.setNavigationLayout('toolbar');
    fixture.detectChanges();

    const toggle = drawerToggle();

    expect(toggle.getAttribute('aria-label')).toBe('Open menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(true);
    expect(toggle.getAttribute('aria-label')).toBe('Close menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('tracks drawer closes the layout performs itself', () => {
    settings.setNavigationLayout('toolbar');
    fixture.detectChanges();

    component.toggleDrawer();
    fixture.detectChanges();
    expect(component.drawerOpened()).toBe(true);

    host.querySelector<HTMLAnchorElement>('mat-drawer nav a')?.click();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(false);
  });

  it('reports a closed drawer once the layout no longer has one', () => {
    settings.setNavigationLayout('toolbar');
    fixture.detectChanges();
    component.toggleDrawer();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(true);

    component.selectNavigationLayout('tabs');
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(false);
    expect(host.querySelector('app-tabs-layout')).toBeTruthy();
  });

  it('does nothing when the drawer is toggled without a drawer layout', () => {
    expect(() => {
      component.toggleDrawer();
    }).not.toThrow();
    expect(component.drawerOpened()).toBe(false);
  });

  it('ignores an unknown layout', () => {
    component.selectNavigationLayout('sidebar' as never);
    fixture.detectChanges();

    expect(host.querySelector('app-tabs-layout')).toBeTruthy();
  });
});
