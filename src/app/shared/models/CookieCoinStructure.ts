import { CoingeckoCoin } from './CoinGeckoCoin';

export interface CookieCoinStructure {
  [networkId: string]: AddressToCoin;
}

export interface AddressToCoin {
  [address: string]: CoingeckoCoin;
}
