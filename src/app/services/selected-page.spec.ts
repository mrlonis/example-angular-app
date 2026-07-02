import { TestBed } from '@angular/core/testing';
import { SelectedPage } from './selected-page';

describe('SelectedPage', () => {
  let service: SelectedPage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
