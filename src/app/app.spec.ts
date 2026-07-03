import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
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
