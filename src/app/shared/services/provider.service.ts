import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { list } from 'src/app/utils/chains';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor() {}

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
}
