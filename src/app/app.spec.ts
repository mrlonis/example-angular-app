import { TestBed } from '@angular/core/testing';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { Shell } from './layouts/shell/shell';

describe('App', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    });

    /* These specs only assert which component each route resolves to. Rendering the real shell
       boots MatTable and a live iframe, which is by far the slowest work in the suite and makes
       these tests flake against the default 5s timeout under parallel load. The shell and its
       layouts are covered by their own specs. */
    TestBed.overrideComponent(Shell, {
      set: { template: '<router-outlet />', imports: [RouterOutlet], styles: [] },
    });

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

  it('redirects the default route to the mat table page', async () => {
    const fixture = TestBed.createComponent(App);
    const host = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/mat-table');
    expect(host.querySelector('app-mat-table')).toBeTruthy();
  });

  it('renders the iframe resizer page', async () => {
    const fixture = TestBed.createComponent(App);
    const host = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/iframe-resizer');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.querySelector('app-iframe-resizer')).toBeTruthy();
  });

  it('sends unknown routes, including the retired toolbar route, to the mat table page', async () => {
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/toolbar');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/mat-table');
  });
});
