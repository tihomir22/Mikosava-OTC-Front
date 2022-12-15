import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import erc20Object from '../../../assets/ERC20.json';
import { ProviderService } from '../services/provider.service';

@Pipe({
  name: 'parseFromWeiToDecimalNumber',
})
export class ParseFromWeiToDecimalNumberPipe implements PipeTransform {
  constructor(private providerService: ProviderService) {}

  transform(amount: BigInt, ...args: string[]): Promise<number> {
    let [address] = args;
    return this.getParsedAmountFromAddress(address, amount);
  }

  private async getParsedAmountFromAddress(address: string, amount: BigInt) {
    const [provider, signer, account, foundActiveNetwork] =
      await this.providerService.getTools();

    const erc20 = new ethers.Contract(address, erc20Object.abi, provider);
    const decimals = await erc20['decimals']();
    return (amount as any) / 10 ** decimals;
  }
}
