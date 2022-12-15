import { Observable } from 'rxjs';
import { CoingeckoCoin } from './CoinGeckoCoin';

export interface MikosavaTrade {
  amountPositionCounterpart: BigInt;
  amountPositionCreator: BigInt;
  cancelled: boolean;
  coinCounterpart: string;
  coinCreator: string;
  counterpart: string;
  creator: string;
  sold: boolean;
  tradeId: BigInt;
  validUntil: BigInt;
}
