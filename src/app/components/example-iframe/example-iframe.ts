import { Component, inject } from '@angular/core';
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

  url: SafeResourceUrl;

  constructor() {
    this.url = this.urlCacheService.transform('https://iframetester.com/');
  }
}
