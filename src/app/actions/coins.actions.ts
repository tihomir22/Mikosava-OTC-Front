import { createAction, props } from '@ngrx/store';
import { Web3Provider } from 'node_modules/@ethersproject/providers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';

export const setAllCoins = createAction(
  '[Coins] Set all coins',
  props<{ newAllCoins: CoingeckoCoin[] }>()
);

export const addNewCoinExternally = createAction(
  '[Coins] Add new coin externally',
  props<{ newCoin: CoingeckoCoin }>()
);

export const selectCoinA = createAction(
  '[Coins] Set coin A',
  props<{ selectACoin: CoingeckoCoin }>()
);

export const selectCoinB = createAction(
  '[Coins] Set coin B',
  props<{ selectBCoin: CoingeckoCoin }>()
);
