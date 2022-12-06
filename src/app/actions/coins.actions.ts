import { createAction, props } from '@ngrx/store';
import { Web3Provider } from 'node_modules/@ethersproject/providers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';

export const setAllCoins = createAction(
  '[Coins] Set all coins',
  props<{ newAllCoins: CoingeckoCoin[] }>()
);
