import { Component, computed, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NAVIGATION_LAYOUT_OPTIONS, NavigationLayout } from '../../interfaces/navigation';
import { Settings } from '../../services/settings';
import { TabsLayout } from '../tabs-layout/tabs-layout';
import { ToolbarLayout } from '../toolbar-layout/toolbar-layout';

/**
 * Application chrome shared by every route. It owns the app bar, including the settings menu that
 * picks the navigation layout, and renders the layout the user selected around the routed page.
 *
 * The drawer belongs to `ToolbarLayout` but its toggle button lives in the app bar, so the shell
 * drives the drawer through the layout instead of keeping a second copy of the open state.
 */
@Component({
  selector: 'app-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    TabsLayout,
    ToolbarLayout,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly settings = inject(Settings);
  // Only present while the toolbar layout is selected, hence the fallback.
  private readonly toolbarLayout = viewChild(ToolbarLayout);

  readonly layoutOptions = NAVIGATION_LAYOUT_OPTIONS;
  readonly navigationLayout = this.settings.navigationLayout;
  readonly drawerOpened = computed(() => this.toolbarLayout()?.drawerOpened() ?? false);

  toggleDrawer(): void {
    this.toolbarLayout()?.toggleDrawer();
  }

  selectNavigationLayout(layout: NavigationLayout): void {
    this.settings.setNavigationLayout(layout);
  }
}
