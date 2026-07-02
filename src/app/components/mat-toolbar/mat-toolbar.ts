import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectedPage } from '../../services/selected-page';

@Component({
  selector: 'app-mat-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatDividerModule],
  templateUrl: './mat-toolbar.html',
  styleUrl: './mat-toolbar.scss',
})
export class MatToolbar {
  private readonly selectedPageService = inject(SelectedPage);

  selectMatTable() {
    this.selectedPageService.matTable = true;
    this.selectedPageService.iframeResizer = false;
  }
}
