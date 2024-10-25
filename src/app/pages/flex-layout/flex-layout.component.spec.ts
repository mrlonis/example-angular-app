import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FlexLayoutComponent } from './flex-layout.component';

describe('FlexLayoutComponent', () => {
  let component: FlexLayoutComponent;
  let fixture: ComponentFixture<FlexLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexLayoutComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlexLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
