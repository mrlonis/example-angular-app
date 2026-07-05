import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
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

  it('emits normalized value from emitValue', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const event = { target: { value: '  HeLIum  ' } } as unknown as Event;

    component.emitValue(event);

    expect(emitSpy).toHaveBeenCalledWith('helium');
  });

  it('emits empty string when only whitespace is entered', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const event = { target: { value: '   ' } } as unknown as Event;

    component.emitValue(event);

    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('emits normalized value on keyup from template input', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const input = fixture.debugElement.query(By.css('input[matInput]'))
      .nativeElement as HTMLInputElement;

    input.value = '  Au*  ';
    input.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('au*');
  });
});
