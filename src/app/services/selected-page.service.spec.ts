import { TestBed } from '@angular/core/testing';
import { SelectedPageService } from './selected-page.service';

describe('SelectedPageService', () => {
  let service: SelectedPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
