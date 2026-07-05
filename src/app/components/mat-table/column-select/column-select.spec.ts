import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { ColumnSelect } from './column-select';

describe('ColumnSelect', () => {
  let component: ColumnSelect;
  let fixture: ComponentFixture<ColumnSelect>;

  const mockColumns = ['name', 'atomic_mass', 'symbol', 'number'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnSelect);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should require fullListOfColumns input', () => {
      expect(() => {
        fixture.detectChanges();
      }).toThrow();
    });

    it('should require columnsToDisplay model', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
      });
      expect(() => {
        fixture.detectChanges();
      }).toThrow();
    });
  });

  describe('Input and Model Binding', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name', 'symbol']);
      });
      fixture.detectChanges();
    });

    it('should expose fullListOfColumns as input signal', () => {
      expect(component.fullListOfColumns()).toEqual(mockColumns);
    });

    it('should expose columnsToDisplay as model signal', () => {
      expect(component.columnsToDisplay()).toEqual(['name', 'symbol']);
    });

    it('should update columnsToDisplay when model changes', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('columnsToDisplay', ['atomic_mass', 'number']);
      });
      fixture.detectChanges();

      expect(component.columnsToDisplay()).toEqual(['atomic_mass', 'number']);
    });
  });

  describe('setColumnsToDisplay Method', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name', 'symbol']);
      });
      fixture.detectChanges();
    });

    it('adds a checked column while preserving full list order', () => {
      component.setColumnsToDisplay({ checked: true } as MatCheckboxChange, 'atomic_mass');
      expect(component.columnsToDisplay()).toEqual(['name', 'atomic_mass', 'symbol']);
    });

    it('removes an unchecked column', () => {
      component.setColumnsToDisplay({ checked: false } as MatCheckboxChange, 'name');
      expect(component.columnsToDisplay()).toEqual(['symbol']);
    });

    it('preserves selected columns that are not in the full list when toggling', () => {
      component.columnsToDisplay.set(['name', 'source']);

      component.setColumnsToDisplay({ checked: true } as MatCheckboxChange, 'atomic_mass');

      expect(component.columnsToDisplay()).toEqual(['name', 'atomic_mass', 'source']);
    });
  });

  describe('Checkbox Rendering', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name', 'symbol']);
      });
      fixture.detectChanges();
    });

    it('renders one checkbox per available column', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
      expect(checkboxes).toHaveLength(mockColumns.length);
    });

    it('reflects selected columns in checkbox checked states', () => {
      const checkboxInstances = fixture.debugElement
        .queryAll(By.css('mat-checkbox'))
        .map((checkbox) => checkbox.componentInstance as MatCheckbox);

      expect(checkboxInstances.map((checkbox) => checkbox.checked)).toEqual([
        true,
        false,
        true,
        false,
      ]);
    });

    it('updates columnsToDisplay when a checkbox change event is emitted', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));

      checkboxes[2].triggerEventHandler('change', { checked: false });
      fixture.detectChanges();
      expect(component.columnsToDisplay()).toEqual(['name']);

      checkboxes[1].triggerEventHandler('change', { checked: true });
      fixture.detectChanges();
      expect(component.columnsToDisplay()).toEqual(['name', 'atomic_mass']);
    });
  });
});
