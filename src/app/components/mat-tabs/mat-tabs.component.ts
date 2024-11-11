import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExampleIframeComponent } from '../example-iframe';
import { MatTableComponent } from '../mat-table';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatTabsModule, MatTableComponent, ExampleIframeComponent],
  templateUrl: './mat-tabs.component.html',
  styleUrl: './mat-tabs.component.scss',
})
export class MatTabsComponent {}
