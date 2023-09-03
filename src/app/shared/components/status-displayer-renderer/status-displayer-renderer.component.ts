import { Component, Input } from '@angular/core';
import { MikosavaTrade } from '../../models/MikosavaTrade';
import { ListTradeItem } from '../list-trades/list-trades.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-displayer-renderer',
  templateUrl: './status-displayer-renderer.component.html',
  styleUrls: ['./status-displayer-renderer.component.scss'],
})
export class StatusDisplayerRendererComponent
  implements ICellRendererAngularComp
{
  @Input() trade!: MikosavaTrade | ListTradeItem;

  agInit(params: ICellRendererParams): void {
    this.trade = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.trade = params.data;
    return true;
  }
}
