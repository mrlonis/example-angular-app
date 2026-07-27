import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NAVIGATION_LINKS } from '../../interfaces/navigation';
import { ToolbarLayout } from './toolbar-layout';

describe('ToolbarLayout', () => {
  let component: ToolbarLayout;
  let fixture: ComponentFixture<ToolbarLayout>;
  let host: HTMLElement;

  function drawerLinks(): HTMLAnchorElement[] {
    return Array.from(host.querySelectorAll<HTMLAnchorElement>('mat-drawer nav a'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarLayout],
      providers: [
        provideRouter(NAVIGATION_LINKS.map((link) => ({ path: link.path, children: [] }))),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarLayout);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create with a closed drawer', () => {
    expect(component).toBeTruthy();
    expect(component.drawerOpened()).toBe(false);
  });

  it('renders a drawer link per navigation entry', () => {
    expect(drawerLinks().map((link) => link.textContent?.trim())).toEqual(
      NAVIGATION_LINKS.map((link) => link.label),
    );
    expect(drawerLinks().map((link) => link.getAttribute('href'))).toEqual(
      NAVIGATION_LINKS.map((link) => `/${link.path}`),
    );
  });

  it('toggles the drawer open and closed', () => {
    component.toggleDrawer();
    expect(component.drawerOpened()).toBe(true);

    component.toggleDrawer();
    expect(component.drawerOpened()).toBe(false);
  });

  it('tracks a close the drawer performs itself', () => {
    component.toggleDrawer();
    expect(component.drawerOpened()).toBe(true);

    component.closeDrawer();

    expect(component.drawerOpened()).toBe(false);
  });

  it('closes the drawer when a link is followed', () => {
    component.toggleDrawer();
    fixture.detectChanges();

    drawerLinks()[1].click();
    fixture.detectChanges();

    expect(component.drawerOpened()).toBe(false);
  });

  it('marks the active link for assistive technology', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('mat-drawer nav')?.getAttribute('aria-label')).toBe('Pages');
    expect(drawerLinks().every((link) => link.getAttribute('aria-current') === null)).toBe(true);
  });

  it('hosts the routed page beside the drawer', () => {
    expect(host.querySelector('mat-drawer-container router-outlet')).toBeTruthy();
    expect(host.querySelector('mat-drawer')?.getAttribute('id')).toBe('app-drawer');
  });
});
