import { Pipe, PipeTransform } from '@angular/core';

import { ListTradeItem } from '../components/list-trades/list-trades.component';
import { MikosavaNFTTRade, MikosavaTrade } from '../models/MikosavaTrade';
@Pipe({
  name: 'fromMNTtoLTI',
})
export class FromMikosavaNFTTradeToListTradeItem implements PipeTransform {
  constructor() {}

  transform(trades: Array<MikosavaNFTTRade>, ...args: any[]): any {
    let res = trades.map((entry) => {
      return {
        tradeId: entry.tradeId,
        amountA: entry.nftIdA,
        aTokenAddress: entry.nftAddressA,
        amountB: entry.nftIdB,
        bTokenAddress: entry.nftAddressB,
        validUntil: entry.validUntil,
        cancelled: entry.cancelled,
        creator: entry.creator,
        receiver: entry.counterpart,
        sold: entry.sold,
        type: 'erc721',
        sortNo: entry.sortNo,
        createdAt: new Date((+entry.createdAt) * 1000),
      } as ListTradeItem;
    });
    if (args.length == 0) {
      return res;
    } else {
      const [type] = args;
      return type == 'single' ? res[0] : res;
    }
  }
}
