import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { vi } from 'vitest';
import { UrlCache } from './url-cache';

describe('UrlCache', () => {
  let service: UrlCache;
  const bypassSecurityTrustResourceUrl = vi.fn((url: string) => ({ trusted: url }));

  beforeEach(() => {
    bypassSecurityTrustResourceUrl.mockClear();
    TestBed.configureTestingModule({
      providers: [
        UrlCache,
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustResourceUrl },
        },
      ],
    });
    service = TestBed.inject(UrlCache);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sanitizes and caches a new URL', () => {
    const transformed = service.transform('https://example.com');

    expect(transformed).toEqual({ trusted: 'https://example.com' });
    expect(service.cache['https://example.com']).toEqual({ trusted: 'https://example.com' });
    expect(bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(1);
  });

  it('returns cached value without re-sanitizing for repeated URLs', () => {
    const first = service.transform('https://example.com');
    const second = service.transform('https://example.com');

    expect(first).toBe(second);
    expect(bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(1);
  });

  it('sanitizes different URLs independently', () => {
    service.transform('https://example.com/one');
    service.transform('https://example.com/two');

    expect(bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(2);
  });
});
