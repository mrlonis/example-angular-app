import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTable } from './mat-table';

describe('MatTable', () => {
  let component: MatTable;
  let fixture: ComponentFixture<MatTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTable],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
