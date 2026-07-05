import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { FilterState } from '../../../interfaces/filter-state';
import { Filter } from './filter';

describe('Filter', () => {
  let component: Filter;
  let fixture: ComponentFixture<Filter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filter],
    }).compileComponents();

    fixture = TestBed.createComponent(Filter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the filter input with expected placeholder', () => {
    const input = fixture.debugElement.query(By.css('input[matInput]'));
    expect(input).toBeTruthy();
    expect((input.nativeElement as HTMLInputElement).placeholder).toBe('Ex. ium');
  });

  it('sets trimmed name in filter state from emitValue', () => {
    const setSpy = vi.spyOn(component.value, 'set');
    const event = { target: { value: '  HeLIum  ' } } as unknown as Event;

    component.emitValue(event);

    expect(setSpy).toHaveBeenCalledWith({ name: 'HeLIum' });
  });

  it('sets empty name when only whitespace is entered', () => {
    const setSpy = vi.spyOn(component.value, 'set');
    const event = { target: { value: '   ' } } as unknown as Event;

    component.emitValue(event);

    expect(setSpy).toHaveBeenCalledWith({ name: '' });
  });

  it('updates value model on keyup from template input', () => {
    const setSpy = vi.spyOn(component.value, 'set');
    const input = fixture.debugElement.query(By.css('input[matInput]'))
      .nativeElement as HTMLInputElement;

    input.value = '  Au*  ';
    input.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(setSpy).toHaveBeenCalledWith({ name: 'Au*' });
  });

  it('keeps existing fields when updating the name', () => {
    component.value.set({ name: 'argon', includeArchived: true } as FilterState & {
      includeArchived: boolean;
    });

    component.emitValue({ target: { value: ' neon ' } } as unknown as Event);

    expect(component.value()).toEqual({ name: 'neon', includeArchived: true });
  });
});
