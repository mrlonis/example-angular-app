import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleIframe } from './example-iframe';

describe('ExampleIframe', () => {
  let component: ExampleIframe;
  let fixture: ComponentFixture<ExampleIframe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleIframe],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleIframe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
