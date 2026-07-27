import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAVIGATION_LINKS } from '../../interfaces/navigation';

/** Navigation layout that exposes the routed pages as a tab bar above the page content. */
@Component({
  selector: 'app-tabs-layout',
  imports: [MatTabsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './tabs-layout.html',
  styleUrl: './tabs-layout.scss',
})
export class TabsLayout {
  readonly links = NAVIGATION_LINKS;
}
