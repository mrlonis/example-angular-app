import { TestBed } from '@angular/core/testing';
import { UrlCacheService } from './url-cache.service';

describe('UrlCacheService', () => {
  let service: UrlCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
