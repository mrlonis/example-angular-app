import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatTableComponent } from './mat-table.component';

describe('TableComponent', () => {
  let component: MatTableComponent;
  let fixture: ComponentFixture<MatTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
