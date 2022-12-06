import { Component } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ProviderService } from './shared/services/provider.service';
import * as AccountActions from './actions/account.actions';
import * as CoinsActions from './actions/coins.actions';
import { Account } from './reducers';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';
import responseJson from '../assets/response_1670352296126.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MikosavaOTC';
  constructor(
    private provider: ProviderService,
    private store: Store<any>,
    private http: HttpClient
  ) {
    ProviderService.getWebProvider().then(async (data) => {
      let signer = await data.getSigner();
      let address = await signer.getAddress();
      let chainId = await signer.getChainId();
      data.on('network', (newNetwork, oldNetwork) => {
        this.store.dispatch(
          AccountActions.setNewNetwork({ networkId: newNetwork.chainId })
        );
      });
      let account: Account = {
        address: address,
        chainIdConnect: chainId,
      };
      this.store.dispatch(AccountActions.setAccount({ newAccount: account }));
    });
    this.http
      .get('https://api.coingecko.com/api/v3/coins/list?include_platform=true')
      .pipe(
        catchError((error) => {
          return of(responseJson);
        }),
        map((data: any) => {
          let allCoinsWithMoreThan2Platforms = data.filter((entry: any) => {
            return Object.values(entry.platforms).length > 2;
          });
          return allCoinsWithMoreThan2Platforms;
        }),
        switchMap((data) => {
          this.store.dispatch(CoinsActions.setAllCoins({ newAllCoins: data }));
          return data;
        })
      )
      .subscribe();
  }
}
