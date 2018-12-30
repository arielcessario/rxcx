import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'rxc-switcher',
  styleUrls: ['./switcher.component.scss'],
  template: `
    <label class="switch-label" [class.vertical]="vertical">
      <span class="first" [class.active]="vertical || isFirstValue()">
        {{ vertical ? currentValueLabel() : firstValueLabel }}
      </span>
      <div class="switch">
        <input
          type="checkbox"
          [checked]="isSecondValue()"
          (change)="changeValue()"
        />
        <span class="slider"></span>
      </div>
      <span *ngIf="!vertical" class="second" [class.active]="isSecondValue()">
        {{ secondValueLabel }}
      </span>
    </label>
  `
})
export class SwitcherComponent implements OnInit {
  @Input() firstValue: any;
  @Input() secondValue: any;

  @Input() firstValueLabel: string;
  @Input() secondValueLabel: string;

  @Input() vertical: boolean;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  ngOnInit() {
    // console.log(this.value);
  }

  isFirstValue() {
    return this.value === this.firstValue;
  }

  isSecondValue() {
    return this.value === this.secondValue;
  }

  currentValueLabel() {
    return this.isFirstValue() ? this.firstValueLabel : this.secondValueLabel;
  }

  changeValue() {
    this.value = this.isFirstValue() ? this.secondValue : this.firstValue;

    this.valueChange.emit(this.value);
  }
}
