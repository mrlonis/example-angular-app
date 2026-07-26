import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { MatTabs } from './pages/mat-tabs/mat-tabs';
import { MatToolbar } from './pages/mat-toolbar/mat-toolbar';

describe('App', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    });

    /* These specs only assert which component each route resolves to. Rendering the real page
       templates boots MatTable and a live iframe, which is by far the slowest work in the suite
       and makes these tests flake against the default 5s timeout under parallel load. The page
       templates are covered by mat-tabs.spec.ts and mat-toolbar.spec.ts. */
    TestBed.overrideTemplate(MatTabs, '');
    TestBed.overrideTemplate(MatToolbar, '');

    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it(`should have as title 'example-angular-app'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.title()).toEqual('example-angular-app');
  });

  it('renders the default route component', async () => {
    const fixture = TestBed.createComponent(App);
    const host = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.querySelector('app-layout')).toBeTruthy();
  });

  it('renders the toolbar route component', async () => {
    const fixture = TestBed.createComponent(App);
    const host = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/toolbar');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.querySelector('app-mat-toolbar')).toBeTruthy();
  });
});
