import { Component, computed, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAVIGATION_LINKS } from '../../interfaces/navigation';

/** Navigation layout that exposes the routed pages in a drawer beside the page content. */
@Component({
  selector: 'app-toolbar-layout',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './toolbar-layout.html',
  styleUrl: './toolbar-layout.scss',
})
export class ToolbarLayout {
  private readonly drawer = viewChild.required(MatDrawer);

  readonly links = NAVIGATION_LINKS;
  // `MatDrawer.opened` is a getter over an internal signal, so this stays in sync with every
  // open/close, including backdrop clicks and Escape. The shell renders the toggle button, so it
  // reads this rather than tracking a copy of the state that could drift.
  readonly drawerOpened = computed(() => this.drawer().opened);

  toggleDrawer(): void {
    void this.drawer().toggle();
  }

  closeDrawer(): void {
    void this.drawer().close();
  }
}
