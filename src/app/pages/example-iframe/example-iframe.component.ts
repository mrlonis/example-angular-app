import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IFrameResizerDirective } from 'src/app/directives/iframe-resizer.directive';
import { UrlCacheService } from 'src/app/services/url-cache.service';

@Component({
  selector: 'app-example-iframe',
  standalone: true,
  imports: [IFrameResizerDirective],
  templateUrl: './example-iframe.component.html',
  styleUrl: './example-iframe.component.scss',
})
export class ExampleIframeComponent {
  url: SafeResourceUrl;

  constructor(private readonly urlCacheService: UrlCacheService) {
    this.url = this.urlCacheService.transform('https://iframetester.com/');
  }
}
