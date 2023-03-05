import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { IconNamesEnum } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-timer-form',
  templateUrl: './timer-form.component.html',
  styleUrls: ['./timer-form.component.scss'],
})
export class TimerFormComponent {
  public iconNames = IconNamesEnum;
  public localForm: FormGroup;

  @Input() validUntil: number = 0;
  @Output() validUntilChange = new EventEmitter<number>();

  constructor(private fb: FormBuilder) {
    this.localForm = this.fb.group({
      availableUntil: [false, []],
      selectAvailableUntil: [null, []],
      selectCustomAvalaible: [null, []],
    });
    this.localForm.valueChanges.subscribe((data) => {
      this.validUntil = this.getValidUntil();
      this.validUntilChange.emit(this.validUntil);
    });
  }

  public toggleFormChange(newValue: boolean) {
    this.localForm.get('availableUntil')?.patchValue(newValue);
  }

  public onClickChipTimeFrameAvailableUntil(timeSelectedInMinutes: number) {
    if (timeSelectedInMinutes == -1) {
      //custom
      this.localForm.get('selectAvailableUntil')?.patchValue('custom');
    } else {
      this.localForm
        .get('selectAvailableUntil')
        ?.patchValue(timeSelectedInMinutes);
    }
  }

  public returnAvailableDetails(): string {
    if (
      !!this.localForm.get('availableUntil')?.value &&
      !!this.localForm.get('selectAvailableUntil')?.value
    ) {
      let isCustom =
        this.localForm.get('selectAvailableUntil')?.value == 'custom';

      if (!isCustom) {
        let parsedMinutes = Number(this.localForm.value.selectAvailableUntil);
        return moment(new Date())
          .add(parsedMinutes, 'minutes')
          .format('DD/MM/YYYY HH:mm')
          .toString();
      } else {
        return moment(this.localForm.value.selectCustomAvalaible ?? new Date())
          .format('DD/MM/YYYY HH:mm')
          .toString();
      }
    }
    return '';
  }

  public getValidUntil(): number {
    if (
      !this.localForm.get('availableUntil')?.value ||
      !this.localForm.get('selectAvailableUntil')
    )
      return 0;

    let isCustom =
      this.localForm.get('selectAvailableUntil')?.value == 'custom';

    if (!isCustom) {
      let parsedMinutes = Number(this.localForm.value.selectAvailableUntil);
      return +moment(new Date()).add(parsedMinutes, 'minutes').toDate();
    } else {
      return +moment(
        this.localForm.value.selectCustomAvalaible ?? new Date()
      ).toDate();
    }
  }
}
