import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { distinctUntilChanged, filter, firstValueFrom } from 'rxjs';
import { State } from 'src/app/reducers';
import { getNetwork, list } from 'src/app/utils/chains';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(private store: Store<State>) {}

  public static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider();
    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' });
    }

    return new ethers.providers.Web3Provider(provider, 'any');
  }

  public static async changeNetwork(newNetworkId: number) {
    let provider = await this.getWebProvider(false);
    let networksAvalaible = list;
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: ethers.utils.hexValue(newNetworkId) },
      ]);
    } catch (error: any) {
      if (error.code == 4902) {
        let network = networksAvalaible.find(
          (network) => network.chainId == newNetworkId
        );
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: ethers.utils.hexValue(newNetworkId),
            rpcUrls: network?.rpcs,
            chainName: network?.name,
            nativeCurrency: network?.nativeCurrency,
          },
        ]);
      }
    }
  }

  public async getTools() {
    const provider = await ProviderService.getWebProvider(false);
    const signer = await provider.getSigner();
    const account = await this.getAccount();
    let foundActiveNetwork = getNetwork(account.chainIdConnect);
    return [provider, signer, account, foundActiveNetwork as any];
  }

  public async getAccount() {
    const account = await firstValueFrom(this.getAccountStream());
    return account;
  }

  public async getSigner() {
    const provider = await ProviderService.getWebProvider(false);
    const signer = await provider.getSigner();
    return signer;
  }

  public getAccountStream() {
    return this.store
      .select((store) => store.account)
      .pipe(
        filter((account) => !!account && Object.values(account).length > 0),
        distinctUntilChanged()
      );
  }
}
