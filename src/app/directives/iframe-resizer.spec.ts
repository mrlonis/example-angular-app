import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { iframeResizer } from 'iframe-resizer';
import { vi } from 'vitest';
import { IFrameResizer } from './iframe-resizer';

vi.mock('iframe-resizer', () => ({
  iframeResizer: vi.fn(),
}));

@Component({
  imports: [IFrameResizer],
  template:
    '<iframe appIframeResizer [heightCalculationMethod]="heightCalculationMethod" [scrolling]="scrolling"></iframe>',
})
class HostComponent {
  heightCalculationMethod = 'lowestElement' as const;
  scrolling = true;
}

describe('IFrameResizer', () => {
  const mockedIframeResizer = vi.mocked(iframeResizer);

  beforeEach(() => {
    mockedIframeResizer.mockReset();
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });
  });

  it('creates the directive instance through host component', () => {
    mockedIframeResizer.mockReturnValue([
      { iFrameResizer: { resize: vi.fn(), close: vi.fn() } },
    ] as never);

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement.children[0].injector.get(IFrameResizer);
    expect(directive).toBeTruthy();
  });

  it('calls iframeResizer with expected options and resizes after view init', () => {
    const resize = vi.fn();
    mockedIframeResizer.mockReturnValue([{ iFrameResizer: { resize, close: vi.fn() } }] as never);

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(mockedIframeResizer).toHaveBeenCalledWith(
      expect.objectContaining({
        checkOrigin: false,
        heightCalculationMethod: 'lowestElement',
        scrolling: 'auto',
        log: false,
        autoResize: true,
      }),
      expect.any(HTMLElement),
    );
    expect(resize).toHaveBeenCalledTimes(1);
  });

  it('passes scrolling=false and skips resize/close when iFrameResizer API is missing', () => {
    mockedIframeResizer.mockReturnValue([{}] as never);

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.scrolling = false;
    fixture.detectChanges();

    expect(mockedIframeResizer).toHaveBeenCalledWith(
      expect.objectContaining({ scrolling: false }),
      expect.any(HTMLElement),
    );

    expect(() => fixture.destroy()).not.toThrow();
  });

  it('handles empty iframeResizer return values on init and destroy', () => {
    mockedIframeResizer.mockReturnValue([] as never);

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(() => fixture.destroy()).not.toThrow();
  });
});
