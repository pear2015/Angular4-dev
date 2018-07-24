import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wizard-step',
  template:
    `
    <div [hidden]="!isActive" style="width:100%;height:100%;">
      <ng-content></ng-content>
    </div>
  `
})
export class WizardStepComponent {
  @Input() title: string;
  @Input() hidden: boolean = false;
  @Input() isValid: boolean = true;
  @Input() showNext: boolean = true;
  @Input() showPrev: boolean = true;
  @Input() showComplete: boolean = false;
  @Input() showAnalysis: boolean = false;
  @Input() crimeList: boolean = false;

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  private _isActive: boolean = false;
  isDisabled: boolean = true;

  constructor() { }

  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
