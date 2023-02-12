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
  publicTrade: boolean;
  validUntil: BigInt;
}

export interface MikosavaNFTTRade {
  tradeId: BigInt;
  creator: string;
  counterpart: string;
  nftAddressA: string;
  nftAddressB: string;
  nftIdA: BigInt;
  nftIdB: BigInt;
  validUntil: BigInt;
  sold: boolean;
  cancelled: boolean;
  publicTrade: boolean;
}
