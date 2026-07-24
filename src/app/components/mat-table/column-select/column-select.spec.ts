import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { ColumnDefinition } from '../../../interfaces/column-definition';
import { ColumnSelect } from './column-select';

describe('ColumnSelect', () => {
  let component: ColumnSelect;
  let fixture: ComponentFixture<ColumnSelect>;

  const mockColumns: ColumnDefinition[] = [
    { name: 'name', displayName: 'Name', isSortable: true, width: 150 },
    { name: 'atomic_mass', displayName: 'Atomic Mass', isSortable: true, width: 150 },
    { name: 'symbol', displayName: 'Symbol', isSortable: true, width: 150 },
    { name: 'number', displayName: 'Number', isSortable: true, width: 150 },
  ];
  const [nameColumn, atomicMassColumn, symbolColumn, numberColumn] = mockColumns;
  const sourceColumn: ColumnDefinition = {
    name: 'source',
    displayName: 'Source',
    isSortable: false,
    width: 150,
  };

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
        fixture.componentRef.setInput('columnsToDisplay', [nameColumn, symbolColumn]);
      });
      fixture.detectChanges();
    });

    it('should expose fullListOfColumns as input signal', () => {
      expect(component.fullListOfColumns()).toEqual(mockColumns);
    });

    it('should expose columnsToDisplay as model signal', () => {
      expect(component.columnsToDisplay()).toEqual([nameColumn, symbolColumn]);
    });

    it('should update columnsToDisplay when model changes', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('columnsToDisplay', [atomicMassColumn, numberColumn]);
      });
      fixture.detectChanges();

      expect(component.columnsToDisplay()).toEqual([atomicMassColumn, numberColumn]);
    });
  });

  describe('setColumnsToDisplay Method', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', [nameColumn, symbolColumn]);
      });
      fixture.detectChanges();
    });

    it('adds a checked column while preserving full list order', () => {
      component.setColumnsToDisplay({ checked: true } as MatCheckboxChange, atomicMassColumn);
      expect(component.columnsToDisplay()).toEqual([nameColumn, atomicMassColumn, symbolColumn]);
    });

    it('removes an unchecked column', () => {
      component.setColumnsToDisplay({ checked: false } as MatCheckboxChange, nameColumn);
      expect(component.columnsToDisplay()).toEqual([symbolColumn]);
    });

    it('preserves selected columns that are not in the full list when toggling', () => {
      component.columnsToDisplay.set([nameColumn, sourceColumn]);

      component.setColumnsToDisplay({ checked: true } as MatCheckboxChange, atomicMassColumn);

      expect(component.columnsToDisplay()).toEqual([nameColumn, atomicMassColumn, sourceColumn]);
    });
  });

  describe('Checkbox Rendering', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', [nameColumn, symbolColumn]);
      });
      fixture.detectChanges();
    });

    it('renders one checkbox per available column', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
      expect(checkboxes).toHaveLength(mockColumns.length);
    });

    it('renders the human-friendly display name for each column', () => {
      const labels = fixture.debugElement
        .queryAll(By.css('mat-checkbox'))
        .map((checkbox) => (checkbox.nativeElement as HTMLElement).textContent?.trim());

      expect(labels).toEqual(mockColumns.map((column) => column.displayName));
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
      expect(component.columnsToDisplay()).toEqual([nameColumn]);

      checkboxes[1].triggerEventHandler('change', { checked: true });
      fixture.detectChanges();
      expect(component.columnsToDisplay()).toEqual([nameColumn, atomicMassColumn]);
    });
  });
});
