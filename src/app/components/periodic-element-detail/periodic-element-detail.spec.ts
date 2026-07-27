import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { PeriodicElementDetail } from './periodic-element-detail';

describe('PeriodicElementDetail', () => {
  let component: PeriodicElementDetail;
  let fixture: ComponentFixture<PeriodicElementDetail>;

  const mockPeriodicElement: PeriodicElement = {
    name: 'Hydrogen',
    appearance: 'colorless gas',
    atomic_mass: 1.008,
    boil: 20.271,
    category: 'nonmetal',
    density: 0.0708,
    discovered_by: 'Cavendish',
    melt: -259.16,
    molar_heat: 28.836,
    named_by: 'Lavoisier',
    number: 1,
    period: 1,
    group: 1,
    phase: 'Gas',
    source: 'cosmic origin',
    bohr_model_image: null,
    bohr_model_3d: null,
    spectral_img: null,
    summary: 'Hydrogen is a chemical element with atomic number 1.',
    symbol: 'H',
    xpos: 1,
    ypos: 1,
    wxpos: 1,
    wypos: 1,
    shells: [1],
    electron_configuration: '1s1',
    electron_configuration_semantic: '1s<sup>1</sup>',
    electron_affinity: 72.769,
    electronegativity_pauling: 2.1,
    ionization_energies: [1312.0],
    'cpk-hex': 'FFFFFF',
    image: {
      title: 'Hydrogen',
      url: 'https://images.unsplash.com/...',
      attribution: 'Unsplash',
    },
    block: 's',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodicElementDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodicElementDetail);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should require an element input', () => {
      expect(() => {
        fixture.detectChanges();
      }).toThrow();
    });
  });

  describe('Element Display', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', mockPeriodicElement);
      });
      fixture.detectChanges();
    });

    it('should display the element number', () => {
      const numberElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-position',
      );
      expect(numberElement).toBeTruthy();
      expect(numberElement?.textContent).toBe('1');
    });

    it('should display the element symbol', () => {
      const symbolElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-symbol',
      );
      expect(symbolElement).toBeTruthy();
      expect(symbolElement?.textContent).toBe('H');
    });

    it('should display the element name', () => {
      const nameElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-name',
      );
      expect(nameElement).toBeTruthy();
      expect(nameElement?.textContent).toBe('Hydrogen');
    });

    it('should display the element atomic mass', () => {
      const weightElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-weight',
      );
      expect(weightElement).toBeTruthy();
      expect(weightElement?.textContent).toBe('1.008');
    });

    it('should display the element summary', () => {
      const summaryElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-description',
      );
      expect(summaryElement).toBeTruthy();
      expect(summaryElement?.textContent).toContain(
        'Hydrogen is a chemical element with atomic number 1.',
      );
    });

    it('should display Wikipedia attribution', () => {
      const attributionElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-description-attribution',
      );
      expect(attributionElement).toBeTruthy();
      expect(attributionElement?.textContent).toBe(' -- Wikipedia ');
    });

    it('should render the element diagram container', () => {
      const diagramElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-diagram',
      );
      expect(diagramElement).toBeTruthy();
    });

    it('should render the description container', () => {
      const descriptionElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-description',
      );
      expect(descriptionElement).toBeTruthy();
    });

    it('should render the main container with correct class', () => {
      const mainContainer = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-detail',
      );
      expect(mainContainer).toBeTruthy();
    });
  });

  describe('Dynamic Input Updates', () => {
    it('should update element details when input changes', () => {
      const newElement: PeriodicElement = {
        ...mockPeriodicElement,
        name: 'Helium',
        symbol: 'He',
        number: 2,
        atomic_mass: 4.003,
        summary: 'Helium is the second element of the periodic table.',
      };

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', mockPeriodicElement);
      });
      fixture.detectChanges();

      let numberElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-position',
      );
      expect(numberElement).toBeTruthy();
      expect(numberElement?.textContent).toBe('1');

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', newElement);
      });
      fixture.detectChanges();

      numberElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-position',
      );
      expect(numberElement).toBeTruthy();
      expect(numberElement?.textContent).toBe('2');

      const symbolElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-symbol',
      );
      expect(symbolElement).toBeTruthy();
      expect(symbolElement?.textContent).toBe('He');

      const nameElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-name',
      );
      expect(nameElement).toBeTruthy();
      expect(nameElement?.textContent).toBe('Helium');

      const summaryElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-description',
      );
      expect(summaryElement).toBeTruthy();
      expect(summaryElement?.textContent).toContain(
        'Helium is the second element of the periodic table.',
      );
    });
  });

  describe('Element Signal', () => {
    it('should expose element as a signal', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', mockPeriodicElement);
      });
      expect(component.element()).toEqual(mockPeriodicElement);
    });

    it('should return the correct element value', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', mockPeriodicElement);
      });
      const element = component.element();
      expect(element.name).toBe('Hydrogen');
      expect(element.symbol).toBe('H');
      expect(element.number).toBe(1);
      expect(element.atomic_mass).toBe(1.008);
      expect(element.summary).toBe('Hydrogen is a chemical element with atomic number 1.');
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements with special characters in names', () => {
      const specialElement: PeriodicElement = {
        ...mockPeriodicElement,
        name: 'Molybdenum',
        symbol: 'Mo',
      };

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', specialElement);
      });
      fixture.detectChanges();

      const nameElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-name',
      );
      expect(nameElement).toBeTruthy();
      expect(nameElement?.textContent).toBe('Molybdenum');
    });

    it('should handle very long element summaries', () => {
      const longSummary = 'This is a very long summary ' + 'that spans multiple lines. '.repeat(10);
      const elementWithLongSummary: PeriodicElement = {
        ...mockPeriodicElement,
        summary: longSummary,
      };

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', elementWithLongSummary);
      });
      fixture.detectChanges();

      const summaryElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-description',
      );
      expect(summaryElement).toBeTruthy();
      expect(summaryElement?.textContent).toContain(longSummary);
    });

    it('should handle large atomic mass values', () => {
      const heavyElement: PeriodicElement = {
        ...mockPeriodicElement,
        atomic_mass: 294.214,
        name: 'Flerovium',
        symbol: 'Fl',
        number: 114,
      };

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', heavyElement);
      });
      fixture.detectChanges();

      const weightElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-weight',
      );
      expect(weightElement).toBeTruthy();
      expect(weightElement?.textContent).toBe('294.214');
    });

    it('should handle multi-character element symbols', () => {
      const multiCharElement: PeriodicElement = {
        ...mockPeriodicElement,
        symbol: 'Og',
        name: 'Oganesson',
        number: 118,
      };

      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', multiCharElement);
      });
      fixture.detectChanges();

      const symbolElement = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-symbol',
      );
      expect(symbolElement).toBeTruthy();
      expect(symbolElement?.textContent).toBe('Og');
    });
  });

  describe('Template Structure', () => {
    beforeEach(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('element', mockPeriodicElement);
      });
      fixture.detectChanges();
    });

    it('should have the correct DOM structure', () => {
      const mainContainer = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-detail',
      );
      const diagram = mainContainer?.querySelector('.example-element-diagram');
      const description = mainContainer?.querySelector('.example-element-description');

      expect(mainContainer).toBeTruthy();
      expect(mainContainer?.children.length).toBe(2);
      expect(diagram).toBeTruthy();
      expect(description).toBeTruthy();
    });

    it('should have the correct diagram structure', () => {
      const diagram = (fixture.nativeElement as HTMLDivElement).querySelector(
        '.example-element-diagram',
      );
      expect(diagram).toBeTruthy();
      expect(diagram?.children.length).toBe(4);
      expect(diagram?.querySelector('.example-element-position')).toBeTruthy();
      expect(diagram?.querySelector('.example-element-symbol')).toBeTruthy();
      expect(diagram?.querySelector('.example-element-name')).toBeTruthy();
      expect(diagram?.querySelector('.example-element-weight')).toBeTruthy();
    });
  });
});
