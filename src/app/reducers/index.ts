import { state } from '@angular/animations';
import { isDevMode } from '@angular/core';
import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { BigNumber } from 'ethers';

import * as AccountActions from '../actions/account.actions';
import * as CoinsActions from '../actions/coins.actions';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';

export interface Account {
  address: string;
  chainIdConnect: number;
  balance: BigInt;
}

export interface State {
  account: Account;
  coins: Array<CoingeckoCoin>;
  selectCoinA: CoingeckoCoin;
  selectCoinB: CoingeckoCoin;
}

export const reducers: ActionReducerMap<State> = {
  account: createReducer(
    {} as any,
    on(AccountActions.setAccount, (state, { newAccount }) => {
      return { ...state, ...newAccount };
    }),
    on(AccountActions.setNewNetwork, (state, { networkId }) => {
      return { ...state, ...{ chainIdConnect: networkId } };
    })
  ),
  coins: createReducer(
    [] as any,
    on(CoinsActions.setAllCoins, (state, { newAllCoins }) => {
      return newAllCoins;
    }),
    on(CoinsActions.addNewCoinExternally, (state, { newCoin }) => {
      return [...new Set([...state, newCoin])];
    })
  ),
  selectCoinA: createReducer(
    null as any,
    on(CoinsActions.selectCoinA, (state, { selectACoin }) => {
      if (!selectACoin) {
        return null;
      }
      return { ...state, ...selectACoin };
    })
  ),
  selectCoinB: createReducer(
    null as any,
    on(CoinsActions.selectCoinB, (state, { selectBCoin }) => {
      if (!selectBCoin) {
        return null;
      }
      return { ...state, ...selectBCoin };
    })
  ),
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
