import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BigNumber } from 'ethers';
import { IdenticonOptions } from 'identicon.js';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { generateIdenticonB64 } from 'src/app/utils/utils';
import { MikosavaTrade } from '../../models/MikosavaTrade';

export interface ListTradeItem {
  tradeId: BigInt;
  amountA: BigInt;
  aTokenAddress: string;
  amountB: BigInt;
  bTokenAddress: string;
  validUntil: BigInt;
  cancelled: boolean;
  sold: boolean;
  type: 'erc20' | 'erc721';
}

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.component.html',
  styleUrls: ['./list-trades.component.scss'],
})
export class ListTradesComponent {
  @Input() trades: ListTradeItem[] = [];
  @Input() tradesLoaded: boolean = false;
  public iconNames = IconNamesEnum;
  public transformToIdenticoin = generateIdenticonB64;
  public options: IdenticonOptions = {
    size: 32,
    background: [255, 255, 255, 255],
    margin: 0.2,
  };

  @Output() clickTradeItem = new EventEmitter<ListTradeItem>();
  @Output() cancelTradeItem = new EventEmitter<ListTradeItem>();
  @Output() shareTradeItem = new EventEmitter<ListTradeItem>();
  //collection - tokenId
  @Output() viewNftDetails = new EventEmitter<[string, string]>();
}
