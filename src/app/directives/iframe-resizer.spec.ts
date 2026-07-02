import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IFrameResizer } from './iframe-resizer';

describe('IFrameResizer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(document.createElement('iframe')) },
      ],
    });
  });

  it('should create an instance', () => {
    const directive = TestBed.runInInjectionContext(() => new IFrameResizer());
    expect(directive).toBeTruthy();
  });
});
