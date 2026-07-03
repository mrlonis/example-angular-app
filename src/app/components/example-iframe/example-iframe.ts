import { Component, computed, inject, signal } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IFrameResizer } from '../../directives/iframe-resizer';
import { UrlCache } from '../../services/url-cache';

@Component({
  selector: 'app-example-iframe',
  imports: [IFrameResizer],
  templateUrl: './example-iframe.html',
  styleUrl: './example-iframe.scss',
})
export class ExampleIframe {
  private readonly urlCacheService = inject(UrlCache);
  private readonly iframeUrl = signal('https://iframetester.com/');

  readonly url = computed<SafeResourceUrl>(() => this.urlCacheService.transform(this.iframeUrl()));
}
