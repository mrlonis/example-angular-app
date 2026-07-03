import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SelectedPage } from '../../services/selected-page';
import { MatToolbar } from './mat-toolbar';

describe('MatToolbar', () => {
  let component: MatToolbar;
  let fixture: ComponentFixture<MatToolbar>;
  const selectedPage = {
    selectMatTable: vi.fn(),
    selectIframeResizer: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbar],
      providers: [{ provide: SelectedPage, useValue: selectedPage }],
    }).compileComponents();

    fixture = TestBed.createComponent(MatToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    selectedPage.selectMatTable.mockClear();
    selectedPage.selectIframeResizer.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('does not throw when toggling before view child is initialized', () => {
    const freshFixture = TestBed.createComponent(MatToolbar);

    expect(() => freshFixture.componentInstance.toggleDrawer()).not.toThrow();
  });

  it('calls SelectedPage methods from component API', () => {
    component.selectMatTable();
    component.selectIframeResizer();

    expect(selectedPage.selectMatTable).toHaveBeenCalledTimes(1);
    expect(selectedPage.selectIframeResizer).toHaveBeenCalledTimes(1);
  });

  it('wires toolbar and drawer button clicks to component behavior', () => {
    const toggleSpy = vi.spyOn(component, 'toggleDrawer');
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

    expect(toggleSpy).toHaveBeenCalledTimes(1);
    expect(selectedPage.selectMatTable).toHaveBeenCalledTimes(1);
    expect(selectedPage.selectIframeResizer).toHaveBeenCalledTimes(1);
  });
});
