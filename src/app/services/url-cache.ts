import { Service, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Service()
export class UrlCache {
  private readonly domSanitizer = inject(DomSanitizer);

  cache: Record<string, SafeResourceUrl> = {};

  transform(url: string): SafeResourceUrl {
    if (this.cache[url]) {
      return this.cache[url];
    }
    const sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.cache[url] = sanitizedUrl;
    return sanitizedUrl;
  }
}
