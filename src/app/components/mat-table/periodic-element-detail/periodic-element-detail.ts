import { Component, input } from '@angular/core';
import { PeriodicElement } from '../../../interfaces/periodic-element';

@Component({
  selector: 'app-periodic-element-detail',
  imports: [],
  templateUrl: './periodic-element-detail.html',
  styleUrl: './periodic-element-detail.scss',
})
export class PeriodicElementDetail {
  readonly element = input.required<PeriodicElement>();
}
