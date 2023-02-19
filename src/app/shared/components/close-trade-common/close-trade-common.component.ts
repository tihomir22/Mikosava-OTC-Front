import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { ProviderService } from '../../services/provider.service';
import { ListTradeItem } from '../list-trades/list-trades.component';

@Component({
  selector: 'app-close-trade-common',
  templateUrl: './close-trade-common.component.html',
  styleUrls: ['./close-trade-common.component.scss'],
})
export class CloseTradeCommonComponent {
  public iconNames = IconNamesEnum;
  @Input() viewedTrade!: ListTradeItem;

  @Input() displayExchangeButton = false;
  @Input() disableExchangeButton = true;

  @Input() displayApproveButton = false;
  @Input() disableApproveButton = true;

  @Input() displayCancelButton = false;
  @Input() disableCancelButton = true;
  @Input() labelCancel: string = 'Cancel';

  @Output() goBack = new EventEmitter<void>();
  @Output() exchange = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() cancell = new EventEmitter<void>();

  public getAccount = this.provider.getAccountStream();

  constructor(private provider: ProviderService) {}
}
