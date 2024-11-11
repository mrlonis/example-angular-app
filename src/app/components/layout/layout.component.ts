import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExampleIframeComponent } from '../example-iframe';
import { MatTableComponent } from '../mat-table';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatTabsModule, MatTableComponent, ExampleIframeComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
