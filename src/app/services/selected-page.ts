import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectedPage {
  readonly matTable = signal(false);
  readonly iframeResizer = signal(false);

  selectMatTable() {
    this.matTable.set(true);
    this.iframeResizer.set(false);
  }

  selectIframeResizer() {
    this.matTable.set(false);
    this.iframeResizer.set(true);
  }
}
