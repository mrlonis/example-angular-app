import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExampleIframe } from '../../components/example-iframe/example-iframe';
import { MatTable } from '../../components/mat-table/mat-table';

@Component({
  selector: 'app-layout',
  imports: [MatTabsModule, MatTable, ExampleIframe],
  templateUrl: './mat-tabs.html',
  styleUrl: './mat-tabs.scss',
})
export class MatTabs {}
