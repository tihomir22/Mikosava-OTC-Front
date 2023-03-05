import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent {
  @Input() toggled = false;
  @Output() toggledChange = new EventEmitter<boolean>();

  constructor() {}

  public checkboxChanged(event: any) {
    this.toggledChange.emit(event.currentTarget.checked);
  }
}
