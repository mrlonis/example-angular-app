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

  it('should update selected state with signal-backed methods', () => {
    service.selectMatTable();
    expect(service.matTable()).toBe(true);
    expect(service.iframeResizer()).toBe(false);

    service.selectIframeResizer();
    expect(service.matTable()).toBe(false);
    expect(service.iframeResizer()).toBe(true);
  });
});
