import { Pipe, PipeTransform } from '@angular/core';

import { ListTradeItem } from '../components/list-trades/list-trades.component';
import { MikosavaTrade } from '../models/MikosavaTrade';
@Pipe({
  name: 'fromMTtoLTI',
})
export class FromMikosavaTradeToListTradeItem implements PipeTransform {
  constructor() {}

  transform(trades: Array<MikosavaTrade>, ...args: any[]): any {
    let res = trades.map((entry) => {
      return {
        tradeId: entry.tradeId,
        amountA: entry.amountPositionCreator,
        aTokenAddress: entry.coinCreator,
        amountB: entry.amountPositionCounterpart,
        bTokenAddress: entry.coinCounterpart,
        validUntil: entry.validUntil,
        cancelled: entry.cancelled,
        sold: entry.sold,
        creator: entry.creator,
        receiver: entry.counterpart,
        type: 'erc20',
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
