import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ExampleIframeComponent, MatTableComponent } from 'src/app/components';
import { MatTabsComponent } from './mat-tabs.component';

describe('LayoutComponent', () => {
  let component: MatTabsComponent;
  let fixture: ComponentFixture<MatTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabsComponent, MatTableComponent, ExampleIframeComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
