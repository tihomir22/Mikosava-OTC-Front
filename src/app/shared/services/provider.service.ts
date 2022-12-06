import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

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

    return new ethers.providers.Web3Provider(provider,"any");
  }
}
