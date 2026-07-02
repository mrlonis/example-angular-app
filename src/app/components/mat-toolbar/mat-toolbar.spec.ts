import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbar } from './mat-toolbar';

describe('MatToolbar', () => {
  let component: MatToolbar;
  let fixture: ComponentFixture<MatToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(MatToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
