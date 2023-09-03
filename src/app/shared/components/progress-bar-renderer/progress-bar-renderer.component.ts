import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ListTradeItem } from '../list-trades/list-trades.component';
import { IconNamesEnum } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-progress-bar-renderer',
  templateUrl: './progress-bar-renderer.component.html',
  styleUrls: ['./progress-bar-renderer.component.scss'],
})
export class ProgressBarRendererComponent implements ICellRendererAngularComp {
  public iconNames = IconNamesEnum;
  @Input() trade!: ListTradeItem | any;

  agInit(params: ICellRendererParams): void {
    this.trade = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.trade = params.data;
    return true;
  }
}
