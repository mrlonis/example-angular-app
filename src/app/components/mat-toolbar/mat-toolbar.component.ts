import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectedPageService } from '../../services';

@Component({
  selector: 'app-mat-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatDividerModule],
  templateUrl: './mat-toolbar.component.html',
  styleUrl: './mat-toolbar.component.scss',
})
export class MatToolbarComponent {
  private readonly selectedPageService = inject(SelectedPageService);

  selectMatTable() {
    this.selectedPageService.matTable = true;
    this.selectedPageService.iframeResizer = false;
  }
}
