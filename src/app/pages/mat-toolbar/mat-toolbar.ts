import { Component, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExampleIframe } from '../../components/example-iframe/example-iframe';
import { MatTable } from '../../components/mat-table/mat-table';

@Component({
  selector: 'app-mat-toolbar',
  imports: [
    ExampleIframe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatTable,
    MatToolbarModule,
  ],
  templateUrl: './mat-toolbar.html',
  styleUrl: './mat-toolbar.scss',
})
export class MatToolbar {
  readonly matTable = signal(true);
  readonly iframeResizer = signal(false);
  readonly drawer = viewChild.required(MatDrawer);

  toggleDrawer() {
    void this.drawer().toggle();
  }

  selectMatTable() {
    this.matTable.set(true);
    this.iframeResizer.set(false);
    this.toggleDrawer();
  }

  selectIframeResizer() {
    this.matTable.set(false);
    this.iframeResizer.set(true);
    this.toggleDrawer();
  }
}
