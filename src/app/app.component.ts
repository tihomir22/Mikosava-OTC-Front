import { Component } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ProviderService } from './shared/services/provider.service';
import * as AccountActions from './actions/account.actions';
import * as CoinsActions from './actions/coins.actions';
import { Account } from './reducers';
import { HttpClient } from '@angular/common/http';
import { catchError, interval, map, of, switchMap } from 'rxjs';
import responseJson from '../assets/response_1670352296126.json';
import { TranslateService } from '@ngx-translate/core';
import { ethers } from 'ethers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MikosavaOTC';
  private globalListenersSet = false;
  constructor(
    private provider: ProviderService,
    private store: Store<any>,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.addProviderEvents();
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

  private async addProviderEvents() {
    let provider = await ProviderService.getWebProvider();
    let signer = await provider.getSigner();
    let address = await signer.getAddress();
    let chainId = await signer.getChainId();
    let balance = await provider.getBalance(address);

    provider.on('network', (newNetwork, oldNetwork) => {
      this.store.dispatch(
        AccountActions.setNewNetwork({ networkId: newNetwork.chainId })
      );
    });

    let account: Account = {
      address: address,
      chainIdConnect: chainId,
      balance: balance as any,
    };
    this.store.dispatch(AccountActions.setAccount({ newAccount: account }));

    if (!this.globalListenersSet) {
      (window as any).ethereum.addListener(
        'accountsChanged',
        async (accounts: any) => {
          provider.off('network');
          await this.addProviderEvents();
        }
      );
      this.globalListenersSet = true;
    }
  }
}
