import { state } from '@angular/animations';
import { isDevMode } from '@angular/core';
import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { BigNumber } from 'ethers';

import * as AccountActions from '../actions/account.actions';
import * as CoinsActions from '../actions/coins.actions';
import * as NftActions from '../actions/nfts.actions';
import { MikosavaNft } from '../shared/components/list-nfts/list-nfts.component';
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
  selectNFTA: MikosavaNft;
  selectNFTB: MikosavaNft;
  nftCollectionsAdded: string[];
}

export const reducers: ActionReducerMap<State> = {
  nftCollectionsAdded: createReducer(
    [] as string[],
    on(NftActions.addNewNftCollectionAddress, (state, { addresses }) => {
      return [...new Set([...state, ...addresses])];
    })
  ),
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
  selectNFTA: createReducer(
    null as any,
    on(NftActions.selectNftA, (state, { selectANFT }) => {
      if (!selectANFT) {
        return null;
      }
      return { ...state, ...selectANFT };
    })
  ),
  selectNFTB: createReducer(
    null as any,
    on(NftActions.selectNftB, (state, { selectBNFT }) => {
      if (!selectBNFT) {
        return null;
      }
      return { ...state, ...selectBNFT };
    })
  ),
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
