import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UrlCacheService {
  cache: Record<string, SafeResourceUrl> = {};

  constructor(private readonly domSanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (this.cache[url]) {
      return this.cache[url];
    }
    const sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.cache[url] = sanitizedUrl;
    return sanitizedUrl;
  }
}
