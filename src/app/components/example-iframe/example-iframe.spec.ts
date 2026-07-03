import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { UrlCache } from '../../services/url-cache';
import { ExampleIframe } from './example-iframe';

describe('ExampleIframe', () => {
  let component: ExampleIframe;
  let fixture: ComponentFixture<ExampleIframe>;
  let urlCache: UrlCache;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleIframe],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleIframe);
    component = fixture.componentInstance;
    urlCache = TestBed.inject(UrlCache);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes the iframe url using UrlCache with the default source', () => {
    const transformSpy = vi.spyOn(urlCache, 'transform');

    component.url();

    expect(transformSpy).toHaveBeenCalledWith('https://iframetester.com/');
  });

  it('memoizes computed url value when source signal is unchanged', () => {
    const transformSpy = vi.spyOn(urlCache, 'transform');

    const first = component.url();
    const second = component.url();

    expect(first).toBe(second);
    expect(transformSpy).toHaveBeenCalledTimes(1);
  });

  it('renders iframe with expected safety and sizing attributes', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const iframe = host.querySelector<HTMLIFrameElement>('iframe');

    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('sandbox')).toContain('allow-scripts');
    expect(iframe?.getAttribute('allow')).toBe('microphone');
    expect(iframe?.getAttribute('width')).toBe('100%');
  });
});
