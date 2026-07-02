import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabs } from './mat-tabs';

describe('MatTabs', () => {
  let component: MatTabs;
  let fixture: ComponentFixture<MatTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
