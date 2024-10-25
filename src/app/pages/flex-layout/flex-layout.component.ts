import { Component } from '@angular/core';
import { TableComponent } from '../../components';

@Component({
  selector: 'app-flex-layout',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './flex-layout.component.html',
  styleUrl: './flex-layout.component.scss',
})
export class FlexLayoutComponent {}
