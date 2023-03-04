import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../reducers';
import {
  MikosavaNFTTRade,
  MikosavaTrade,
} from '../shared/models/MikosavaTrade';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';

@Injectable({
  providedIn: 'root',
})
export class CloseTradeNftResolver implements Resolve<MikosavaNFTTRade> {
  constructor(private store: Store<State>, private provider: ProviderService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MikosavaNFTTRade> {
    let tradeId = route.paramMap.get('idTradeNft');
    return of(this.provider.getTools()).pipe(
      switchMap((tools) => {
        return tools;
      }),
      switchMap((tools) => {
        const [provider, signer, account, foundActiveNetwork] = tools;
        const otcContract = new ethers.Contract(
          foundActiveNetwork.contracts.OTC_PROXY,
          MikosavaABI.abi,
          signer
        );
        return otcContract['fetchNftTradeById'](tradeId);
      })
    ) as any;
  }
}
