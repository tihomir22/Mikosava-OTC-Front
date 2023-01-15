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
import { Router } from '@angular/router';
import { ChainIds } from './utils/chains';
import PolygonCoins from '../assets/coins/polygon-coins.json';
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
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use('en');
    this.addProviderEvents();
    // this.http
    //   .get('https://api.coingecko.com/api/v3/coins/list?include_platform=true')
    //   .pipe(
    //     catchError((error) => {
    //       return of(responseJson);
    //     }),
    //     map((data: any) => {
    //       let allCoinsWithMoreThan2Platforms = data.filter((entry: any) => {
    //         return Object.values(entry.platforms).length > 2;
    //       });
    //       return allCoinsWithMoreThan2Platforms;
    //     }),
    //     switchMap((data) => {
    //       this.store.dispatch(CoinsActions.setAllCoins({ newAllCoins: data }));
    //       return data;
    //     })
    //   )
    //   .subscribe();
  }

  private async addProviderEvents() {
    let provider = await ProviderService.getWebProvider();
    let signer = await provider.getSigner();
    let address = await signer.getAddress();
    let chainId = await signer.getChainId();
    let balance = await provider.getBalance(address);

    let account: Account = {
      address: address,
      chainIdConnect: chainId,
      balance: balance as any,
    };
    this.setCoinsDependingOnNetwork(chainId);
    provider.on('network', async (newNetwork, oldNetwork) => {
      this.store.dispatch(
        AccountActions.setNewNetwork({ networkId: newNetwork.chainId })
      );
      let balanceUpdated = await provider.getBalance(address);
      let accountCloned = { ...account };
      accountCloned.balance = balanceUpdated as any;
      accountCloned.chainIdConnect = newNetwork.chainId;
      this.store.dispatch(
        AccountActions.setAccount({ newAccount: accountCloned })
      );
      this.setCoinsDependingOnNetwork(newNetwork.chainId);
    });

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

  public isNotMainPage() {
    return this.router.url != '/';
  }

  private setCoinsDependingOnNetwork(chainId: number) {
    if (chainId == ChainIds.MAINNET_POLYGON) {
      this.store.dispatch(
        CoinsActions.setAllCoins({ newAllCoins: PolygonCoins })
      );
    } else if (chainId == ChainIds.TESTNET_POLYGON) {
      this.store.dispatch(
        CoinsActions.setAllCoins({
          newAllCoins: [
            // {
            //   id: 'TokenA01',
            //   symbol: 'TKA001',
            //   name: 'TokenA01',
            //   platforms: {
            //     'polygon-pos': '0x8460719c22DDD92D7F2632bA3C8baF2C8a5dE8cC',
            //   },
            // },
            // {
            //   id: 'TokenB01',
            //   symbol: 'TKB001',
            //   name: 'TokenB01',
            //   platforms: {
            //     'polygon-pos': '0xa217838eaFcCe6184659BDc593FcEb25f9DAf4C4',
            //   },
            // },
            {
              id: 'TokenA02',
              symbol: 'TKA002',
              name: 'TokenA02',
              platforms: {
                'polygon-pos': '0x064604F2815c6615435Acc62217b50A6d80262FB',
              },
            },
            {
              id: 'TokenB02',
              symbol: 'TKB002',
              name: 'TokenB02',
              platforms: {
                'polygon-pos': '0x3887b308be2Fe0691a13eCF5504AA0cD02D08168',
              },
            },
          ],
        })
      );
    }
  }
}
