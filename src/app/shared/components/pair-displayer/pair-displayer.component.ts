import { Component, Input } from '@angular/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { ListTradeItem } from '../list-trades/list-trades.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface PairDisplayerRendererParams extends ICellRendererParams {
  onViewNftDetailsClick: (tokenAddress: string, amount: BigInt) => void;
  lookOutKeyAddress: string;
  lookOutKeyAmount: string;
}

@Component({
  selector: 'app-pair-displayer',
  templateUrl: './pair-displayer.component.html',
  styleUrls: ['./pair-displayer.component.scss'],
})
export class PairDisplayerComponent implements ICellRendererAngularComp {
  public iconNames = IconNamesEnum;
  @Input() trade!: ListTradeItem | any;
  public params!: PairDisplayerRendererParams;

  agInit(params: PairDisplayerRendererParams): void {
    this.trade = params.data;
    this.params = params;
  }

  refresh(params: PairDisplayerRendererParams): boolean {
    this.trade = params.data;
    this.params = params;
    return true;
  }
}
