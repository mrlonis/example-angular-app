import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabs } from './mat-tabs';

describe('MatTabs', () => {
  let component: MatTabs;
  let fixture: ComponentFixture<MatTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders both tab labels', () => {
    const host = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(
      host.querySelectorAll('.mdc-tab .mdc-tab__text-label'),
      (label: Element) => label.textContent?.trim(),
    );

    expect(tabLabels).toContain('Mat Table');
    expect(tabLabels).toContain('iframe-resizer');
  });

  it('shows mat table content by default', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('app-mat-table')).toBeTruthy();
  });

  it('renders an interactive tablist', () => {
    const host = fixture.nativeElement as HTMLElement;
    const tabs = host.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);
  });
});
