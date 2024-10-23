import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleIframeComponent } from './example-iframe.component';

describe('ExampleIframeComponent', () => {
  let component: ExampleIframeComponent;
  let fixture: ComponentFixture<ExampleIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleIframeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
