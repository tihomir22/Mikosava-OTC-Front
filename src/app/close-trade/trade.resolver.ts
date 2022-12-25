import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../reducers';
import { getTools } from '../utils/utils';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { MikosavaTrade } from '../shared/models/MikosavaTrade';

@Injectable({
  providedIn: 'root',
})
export class TradeResolver implements Resolve<MikosavaTrade> {
  constructor(private store: Store<State>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MikosavaTrade> {
    let tradeId = route.paramMap.get('idTrade');
    return of(getTools(this.store)).pipe(
      switchMap((data) => {
        return data;
      }),
      switchMap((tools) => {
        let [provider, signer, account, foundActiveNetwork] = tools;
        const otcContract = new ethers.Contract(
          environment.MATIC_DEPLOYED_ADDRESS_OTC,
          MikosavaABI.abi,
          signer
        );
        return otcContract['fetchCoinTradeById'](tradeId);
      })
    ) as any;
  }
}
