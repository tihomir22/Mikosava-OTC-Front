import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import erc20Object from '../../../assets/ERC20.json';
import { ProviderService } from '../services/provider.service';

@Injectable({
  providedIn: 'root',
})
export class parseFromWeiToDecimalNumberCache {
  public mapping: { [address: string]: number } = {};
}

@Pipe({
  name: 'parseFromWeiToDecimalNumber',
})
export class ParseFromWeiToDecimalNumberPipe implements PipeTransform {
  constructor(
    private providerService: ProviderService,
    private cache: parseFromWeiToDecimalNumberCache
  ) {}

  transform(amount: BigInt, ...args: string[]): Promise<number> {
    let [address, type] = args;
    if (type == 'native') {
      return this.getParsedNativeCurrency(amount);
    } else {
      return this.getParsedAmountFromAddress(address, amount);
    }
  }

  private async getParsedNativeCurrency(amount: BigInt) {
    const [provider, signer, account, foundActiveNetwork] =
      await this.providerService.getTools();
    let decimals = foundActiveNetwork.nativeCurrency.decimals;
    return this.parse(decimals, amount);
  }

  private async getParsedAmountFromAddress(address: string, amount: BigInt) {
    const [provider, signer, account, foundActiveNetwork] =
      await this.providerService.getTools();

    const erc20 = new ethers.Contract(address, erc20Object.abi, provider);
    let decimals = 0;
    if (!!this.cache.mapping[address]) {
      decimals = this.cache.mapping[address];
    } else {
      decimals = await erc20['decimals']();
      this.cache.mapping[address] = decimals;
    }
    return this.parse(decimals, amount);
  }

  private parse(decimals: number, amount: BigInt) {
    return (amount as any) / 10 ** decimals;
  }
}
