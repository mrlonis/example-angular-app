import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NAVIGATION_LINKS } from '../../interfaces/navigation';
import { TabsLayout } from './tabs-layout';

describe('TabsLayout', () => {
  let component: TabsLayout;
  let fixture: ComponentFixture<TabsLayout>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsLayout],
      providers: [
        provideRouter(NAVIGATION_LINKS.map((link) => ({ path: link.path, children: [] }))),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsLayout);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a tab link per navigation entry', () => {
    const tabLabels = Array.from(host.querySelectorAll('[role="tab"]'), (tab) =>
      tab.textContent?.trim(),
    );

    expect(tabLabels).toEqual(NAVIGATION_LINKS.map((link) => link.label));
  });

  it('points every tab at its route', () => {
    const hrefs = Array.from(host.querySelectorAll<HTMLAnchorElement>('a[mat-tab-link]'), (link) =>
      link.getAttribute('href'),
    );

    expect(hrefs).toEqual(NAVIGATION_LINKS.map((link) => `/${link.path}`));
  });

  it('exposes the tab list and its panel to assistive technology', () => {
    const tabPanel = host.querySelector('mat-tab-nav-panel');

    expect(host.querySelector('[role="tablist"]')).toBeTruthy();
    expect(tabPanel?.getAttribute('role')).toBe('tabpanel');
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Pages');
  });

  it('hosts the routed page inside the tab panel', () => {
    expect(host.querySelector('mat-tab-nav-panel router-outlet')).toBeTruthy();
  });
});
