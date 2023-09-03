import { CoingeckoCoin } from './CoinGeckoCoin';

export interface CookieCoinStructure {
  [networkIdAndSymbol: string]: AddressToCoin;
}

export interface AddressToCoin {
  [address: string]: CoingeckoCoin;
}
