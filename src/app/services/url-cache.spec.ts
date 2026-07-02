import { TestBed } from '@angular/core/testing';
import { UrlCache } from './url-cache';

describe('UrlCache', () => {
  let service: UrlCache;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlCache);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
