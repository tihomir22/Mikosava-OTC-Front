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
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { MikosavaTrade } from '../shared/models/MikosavaTrade';
import { ProviderService } from '../shared/services/provider.service';

@Injectable({
  providedIn: 'root',
})
export class TradeResolver implements Resolve<MikosavaTrade> {
  constructor(private store: Store<State>, private provider: ProviderService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MikosavaTrade> {
    let tradeId = route.paramMap.get('idTrade');
    return of(this.provider.getSigner()).pipe(
      switchMap((signer) => {
        return signer;
      }),
      switchMap((signer) => {
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
