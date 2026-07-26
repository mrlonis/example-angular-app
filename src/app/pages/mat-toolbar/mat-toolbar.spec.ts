import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MatToolbar } from './mat-toolbar';

describe('MatToolbar', () => {
  let component: MatToolbar;
  let fixture: ComponentFixture<MatToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(MatToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.matTable()).toBe(true);
    expect(component.iframeResizer()).toBe(false);
  });

  it('toggles the drawer when available', () => {
    const drawer = component.drawer();
    if (!drawer) {
      throw new Error('Expected drawer to be available');
    }
    const toggleSpy = vi.spyOn(drawer, 'toggle');
    component.toggleDrawer();

    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });

  it('tracks drawer state changes that bypass the toolbar button', () => {
    const drawer = component.drawer();

    expect(component.drawerOpened()).toBe(false);

    void drawer.open();
    expect(component.drawerOpened()).toBe(true);

    void drawer.close();
    expect(component.drawerOpened()).toBe(false);
  });

  it('describes the menu button by the current drawer state', () => {
    const host = fixture.nativeElement as HTMLElement;
    const menuButton = host.querySelector<HTMLButtonElement>('mat-toolbar button');
    if (!menuButton) {
      throw new Error('Expected the menu button to be rendered');
    }

    expect(menuButton.getAttribute('aria-label')).toBe('Open menu');
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton.getAttribute('aria-controls')).toBe('app-drawer');

    component.toggleDrawer();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(true);
    expect(menuButton.getAttribute('aria-label')).toBe('Close menu');
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');

    component.toggleDrawer();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(false);
    expect(menuButton.getAttribute('aria-label')).toBe('Open menu');
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('can toggle drawer on a fresh component instance', () => {
    const freshFixture = TestBed.createComponent(MatToolbar);
    freshFixture.detectChanges();

    expect(() => freshFixture.componentInstance.toggleDrawer()).not.toThrow();
  });

  it('updates signals when selecting mat table', () => {
    const toggleSpy = vi.spyOn(component, 'toggleDrawer');

    component.selectMatTable();

    expect(component.matTable()).toBe(true);
    expect(component.iframeResizer()).toBe(false);
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });

  it('updates signals when selecting iframe resizer', () => {
    const toggleSpy = vi.spyOn(component, 'toggleDrawer');

    component.selectIframeResizer();

    expect(component.matTable()).toBe(false);
    expect(component.iframeResizer()).toBe(true);
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });

  it('wires toolbar and drawer button clicks to component behavior', () => {
    const toggleSpy = vi.spyOn(component, 'toggleDrawer');
    const selectMatTableSpy = vi.spyOn(component, 'selectMatTable');
    const selectIframeResizerSpy = vi.spyOn(component, 'selectIframeResizer');
    const host = fixture.nativeElement as HTMLElement;
    const toolbarToggleButton = host.querySelector<HTMLButtonElement>('mat-toolbar button');
    const drawerButtons = host.querySelectorAll<HTMLButtonElement>('mat-drawer button');
    const [matTableButton, iframeButton] = Array.from(drawerButtons);
    if (!toolbarToggleButton || !matTableButton || !iframeButton) {
      throw new Error('Expected toolbar and drawer buttons to be rendered');
    }

    toolbarToggleButton.click();
    matTableButton.click();
    iframeButton.click();

    expect(toggleSpy).toHaveBeenCalledTimes(3);
    expect(selectMatTableSpy).toHaveBeenCalledTimes(1);
    expect(selectIframeResizerSpy).toHaveBeenCalledTimes(1);
  });
});
