import { Component, inject } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IFrameResizerDirective } from '../../directives';
import { UrlCacheService } from '../../services';

@Component({
  selector: 'app-example-iframe',
  imports: [IFrameResizerDirective],
  templateUrl: './example-iframe.component.html',
  styleUrl: './example-iframe.component.scss',
})
export class ExampleIframeComponent {
  private readonly urlCacheService = inject(UrlCacheService);

  url: SafeResourceUrl;

  constructor() {
    this.url = this.urlCacheService.transform('https://iframetester.com/');
  }
}
