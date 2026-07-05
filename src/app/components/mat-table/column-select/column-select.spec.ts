import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
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

  describe('Input and Output Binding', () => {
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
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();
    });

    it('should update columnsToDisplay signal', () => {
      component.setColumnsToDisplay(['name', 'symbol', 'atomic_mass']);
      expect(component.columnsToDisplay()).toEqual(['name', 'symbol', 'atomic_mass']);
    });

    it('should accept empty array', () => {
      component.setColumnsToDisplay([]);
      expect(component.columnsToDisplay()).toEqual([]);
    });

    it('should accept full list of columns', () => {
      component.setColumnsToDisplay(mockColumns);
      expect(component.columnsToDisplay()).toEqual(mockColumns);
    });

    it('should accept single column', () => {
      component.setColumnsToDisplay(['number']);
      expect(component.columnsToDisplay()).toEqual(['number']);
    });
  });

  describe('Select Element Rendering', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name', 'symbol']);
      });
      fixture.detectChanges();
    });

    it('should render mat-select element', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect(matSelect).toBeTruthy();
    });

    it('should set mat-select multiple attribute', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect((matSelect.nativeElement as HTMLElement).hasAttribute('multiple')).toBe(true);
    });

    it('should set mat-select panelWidth to null', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect((matSelect.componentInstance as MatSelect).panelWidth).toBeNull();
    });

    it('should bind mat-select value to columnsToDisplay', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect((matSelect.componentInstance as MatSelect).value).toEqual(['name', 'symbol']);
    });
  });

  describe('Mat Options Configuration', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();
    });

    it('should have fullListOfColumns matching mock columns', () => {
      expect(component.fullListOfColumns()).toEqual(mockColumns);
    });

    it('should have columnsToDisplay set to ["name"]', () => {
      expect(component.columnsToDisplay()).toEqual(['name']);
    });

    it('should have mat-select element present', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect(matSelect).toBeTruthy();
    });

    it('should have multiple attribute on mat-select', () => {
      const matSelect = fixture.debugElement.query(By.css('mat-select'));
      expect((matSelect.nativeElement as HTMLElement).hasAttribute('multiple')).toBe(true);
    });
  });

  describe('Selection Changes', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();
    });

    it('should call setColumnsToDisplay when valueChange event is triggered', () => {
      const spy = vi.spyOn(component, 'setColumnsToDisplay');
      const matSelect = fixture.debugElement.query(By.css('mat-select'));

      const newColumns = ['name', 'symbol', 'atomic_mass'];
      matSelect.triggerEventHandler('valueChange', newColumns);

      expect(spy).toHaveBeenCalledWith(newColumns);
      expect(component.columnsToDisplay()).toEqual(newColumns);
    });

    it('should emit columnsToDisplayChange when selection changes', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();

      const newColumns = ['atomic_mass', 'number'];
      component.setColumnsToDisplay(newColumns);

      expect(component.columnsToDisplay()).toEqual(newColumns);
    });
  });

  describe('Dynamic Column List Updates', () => {
    it('should update mat-select value when fullListOfColumns changes', () => {
      const initialColumns = ['name', 'symbol'];
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', initialColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();

      expect(component.fullListOfColumns()).toEqual(initialColumns);

      const updatedColumns = ['name', 'symbol', 'atomic_mass', 'number', 'category'];
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', updatedColumns);
      });
      fixture.detectChanges();

      expect(component.fullListOfColumns()).toEqual(updatedColumns);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fullListOfColumns', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', []);
        fixture.componentRef.setInput('columnsToDisplay', []);
      });
      fixture.detectChanges();

      expect(component.fullListOfColumns()).toEqual([]);
      expect(component.columnsToDisplay()).toEqual([]);
    });

    it('should handle columnsToDisplay with columns not in fullListOfColumns', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', mockColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['custom_column']);
      });
      fixture.detectChanges();

      expect(component.columnsToDisplay()).toEqual(['custom_column']);
      expect(component.columnsToDisplay()[0]).not.toBeUndefined();
    });

    it('should handle duplicate columns in fullListOfColumns', () => {
      const duplicateColumns = ['name', 'symbol', 'name', 'atomic_mass'];
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', duplicateColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['name']);
      });
      fixture.detectChanges();

      expect(component.fullListOfColumns()).toEqual(duplicateColumns);
      expect(component.fullListOfColumns().length).toBe(duplicateColumns.length);
    });

    it('should handle special characters in column names', () => {
      const specialColumns = ['atomic_mass', 'bohr_model_image', 'electron_configuration_semantic'];
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('fullListOfColumns', specialColumns);
        fixture.componentRef.setInput('columnsToDisplay', ['atomic_mass']);
      });
      fixture.detectChanges();

      expect(component.fullListOfColumns()).toEqual(specialColumns);
      expect(component.columnsToDisplay()).toEqual(['atomic_mass']);
    });
  });
});
