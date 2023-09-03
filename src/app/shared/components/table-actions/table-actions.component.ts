import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { ListTradeItem } from '../list-trades/list-trades.component';
import { ICellRendererParams } from 'ag-grid-community';
import { Account } from 'src/app/reducers';
import { ProviderService } from '../../services/provider.service';
export interface TableActionsParams extends ICellRendererParams {
  clickTradeItem: (trade: ListTradeItem) => void;
  shareTradeItem: (trade: ListTradeItem) => void;
  cancelTradeItem: (trade: ListTradeItem) => void;
}
@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
})
export class TableActionsComponent implements ICellRendererAngularComp {
  public iconNames = IconNamesEnum;
  public account?: Account;
  public params!: TableActionsParams;
  @Input() trade!: ListTradeItem | any;

  constructor(private provider: ProviderService) {
    this.provider.getAccountStream().subscribe((data) => {
      this.account = data;
    });
  }

  agInit(params: TableActionsParams): void {
    this.trade = params.data;
    this.params = params;
  }

  refresh(params: TableActionsParams): boolean {
    this.trade = params.data;
    this.params = params;
    return true;
  }
}
