import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TableComponent } from 'src/app/components';
import { ExampleIframeComponent } from '../example-iframe';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatTabsModule, TableComponent, ExampleIframeComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
