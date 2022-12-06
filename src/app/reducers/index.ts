import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on,
} from '@ngrx/store';

import * as AccountActions from '../actions/account.actions';
import * as CoinsActions from '../actions/coins.actions';
import { Web3Provider } from 'node_modules/@ethersproject/providers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';

export interface Account {
  address: string;
  chainIdConnect: number;
}

export interface State {
  account: Account;
  coins: Array<CoingeckoCoin>;
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
    })
  ),
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
