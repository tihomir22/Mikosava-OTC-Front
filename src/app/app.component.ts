import { Component } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ProviderService } from './shared/services/provider.service';
import * as AccountActions from './actions/account.actions';
import * as CoinsActions from './actions/coins.actions';
import { Account } from './reducers';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ChainIds } from './utils/chains';
import PolygonCoins from '../assets/coins/polygon-coins.json';
import { AlchemyService } from './shared/services/alchemy.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MikosavaOTC';
  private globalListenersSet = false;
  constructor(
    private store: Store<any>,
    private translate: TranslateService,
    private router: Router,
    private alchemy: AlchemyService
  ) {
    this.translate.use('en');
    this.addProviderEvents();
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
      this.alchemy.switchNetwork(newNetwork.chainId);
      this.setCoinsDependingOnNetwork(newNetwork.chainId);
    });
    this.store.dispatch(AccountActions.setAccount({ newAccount: account }));

    if (!this.globalListenersSet) {
      (window as any).ethereum.addListener(
        'accountsChanged',
        async (accounts: any) => {
          console.log('accountsChanged', accounts);
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
