import { Component } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ProviderService } from './shared/services/provider.service';
import * as AccountActions from './actions/account.actions';
import * as CoinsActions from './actions/coins.actions';
import { Account } from './reducers';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ChainIds } from './utils/chains';
import PolygonCoins from '../assets/coins/polygon-coins-v3.json';
import PolygonTestnetCoins from '../assets/coins/polygon-testnet-coins.json';
import ShimmerEvmTestnetCoins from '../assets/coins/shimmer-coins.json';
import ShimmerEvmCoins from '../assets/coins/shimmer-coins-mainnet.json';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FeedbackDialogComponent } from './shared/components/feedback-dialog/feedback-dialog.component';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { ethers } from 'ethers';
import MikosavaABI from '../assets/MikosavaOTC.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MikosavaOTC';
  private globalListenersSet = false;
  public iconNames = IconNamesEnum;
  public version = '';

  constructor(
    private store: Store<any>,
    private translate: TranslateService,
    private router: Router,
    private provider: ProviderService,
    private modalService: BsModalService
  ) {
    this.translate.use('en');
    this.addProviderEvents();
    this.getVersion();
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
    this.provider.triggerBalanceUpdate.subscribe(async () => {
      let balanceUpdated = await provider.getBalance(address);
      let accountCloned = { ...account };
      accountCloned.balance = balanceUpdated as any;
      this.store.dispatch(
        AccountActions.setAccount({ newAccount: accountCloned })
      );
    });
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
        CoinsActions.setAllCoins({
          newAllCoins: PolygonCoins,
        })
      );
    } else if (chainId == ChainIds.TESTNET_POLYGON) {
      this.store.dispatch(
        CoinsActions.setAllCoins({
          newAllCoins: PolygonTestnetCoins,
        })
      );
    } else if (chainId == ChainIds.SMR_EVM_TESTNET) {
      this.store.dispatch(
        CoinsActions.setAllCoins({
          newAllCoins: ShimmerEvmTestnetCoins,
        })
      );
    } else if (chainId == ChainIds.SMR_EVN_MAINNET) {
      this.store.dispatch(
        CoinsActions.setAllCoins({
          newAllCoins: ShimmerEvmCoins,
        })
      );
    }
  }

  public openFeedbackDialog(): void {
    const ref = this.modalService.show(FeedbackDialogComponent, {
      ignoreBackdropClick: true,
    });
    ref.content?.closeDialog.subscribe(() => ref.hide());
  }

  public async getVersion() {
    const [provider, signer, account, foundActiveNetwork] =
      await this.provider.getTools();
    const otcContract = new ethers.Contract(
      foundActiveNetwork.contracts.OTC_PROXY,
      MikosavaABI.abi,
      signer
    );
    this.version = await otcContract['version']();
  }
}
