import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IdenticonOptions } from 'identicon.js';
import { generateIdenticonB64, isEmptyAddress } from 'src/app/utils/utils';
const DEFAULT_VALUE = 'assets/icons/question-mark.png';
@Component({
  selector: 'app-identicoin',
  templateUrl: './identicoin.component.html',
  styleUrls: ['./identicoin.component.scss'],
})
export class IdenticoinComponent implements ICellRendererAngularComp {
  @Input() text: string = DEFAULT_VALUE;
  @Input() options: IdenticonOptions = {
    size: 32,
    background: [255, 255, 255, 255],
    margin: 0.2,
  };
  public transformToIdenticoin = generateIdenticonB64;
  public isEmptyAddress = isEmptyAddress;
  agInit(params: ICellRendererParams): void {
    if (params.value && !this.isEmptyAddress(params.value))
      this.text = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    if (params.value && !this.isEmptyAddress(params.value))
      this.text = params.value;
    return true;
  }

  public isDefaultValue() {
    return this.text == DEFAULT_VALUE;
  }
}
