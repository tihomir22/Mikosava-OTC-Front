import { createAction, props } from '@ngrx/store';
import { Web3Provider } from 'node_modules/@ethersproject/providers';
import { Account } from '../reducers';

export const setAccount = createAction(
  '[Account] Set logged account',
  props<{ newAccount: Account }>()
);

export const setNewNetwork = createAction(
  '[Account] Set new network',
  props<{ networkId: number }>()
);
