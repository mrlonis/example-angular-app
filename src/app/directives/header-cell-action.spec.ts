import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { HeaderCellAction } from './header-cell-action';

@Component({
  selector: 'app-host',
  imports: [HeaderCellAction],
  template: `<table>
    <thead>
      <tr>
        <th (click)="onCellEvent()" (keydown)="onCellEvent()">
          <div class="sort-container">
            Header
            <button appHeaderCellAction type="button" (click)="onActionClick()">Action</button>
          </div>
        </th>
      </tr>
    </thead>
  </table>`,
})
class HostComponent {
  cellEvents = 0;
  actionClicks = 0;

  onCellEvent(): void {
    this.cellEvents += 1;
  }

  onActionClick(): void {
    this.actionClicks += 1;
  }
}

@Component({
  selector: 'app-detached-host',
  imports: [HeaderCellAction],
  template: `<div class="sort-container">
    <button appHeaderCellAction type="button">Action</button>
  </div>`,
})
class DetachedHostComponent {}

describe('HeaderCellAction', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let headerCell: HTMLElement;
  let action: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, DetachedHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    headerCell = fixture.debugElement.query(By.css('th')).nativeElement as HTMLElement;
    action = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  });

  it('moves the control out of the sort container and into the header cell', () => {
    expect(action.parentElement).toBe(headerCell);
    expect(headerCell.querySelector('.sort-container')?.contains(action)).toBeFalsy();
  });

  it('keeps the control bound to its component after being moved', () => {
    action.click();

    expect(host.actionClicks).toBe(1);
  });

  it('stops clicks from reaching the sort header on the cell', () => {
    action.click();

    expect(host.cellEvents).toBe(0);
  });

  it('stops keyboard events from reaching the sort header on the cell', () => {
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(host.cellEvents).toBe(0);
  });

  it('leaves the cell reachable for events that do not come from the control', () => {
    headerCell.click();

    expect(host.cellEvents).toBe(1);
  });

  it('leaves the control where it is when there is no header cell to move it to', () => {
    const detachedFixture = TestBed.createComponent(DetachedHostComponent);
    detachedFixture.detectChanges();

    const detachedAction = detachedFixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLElement;

    expect(detachedAction.parentElement?.classList).toContain('sort-container');
  });

  it('does not move a control that already sits in the header cell', () => {
    const alreadyPlaced = fixture.debugElement.query(By.directive(HeaderCellAction));
    const appendSpy = vi.spyOn(headerCell, 'appendChild');

    alreadyPlaced.injector.get(HeaderCellAction).ngAfterViewInit();

    expect(appendSpy).not.toHaveBeenCalled();
    expect(action.parentElement).toBe(headerCell);
  });
});
