import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import { firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { getNetwork } from 'src/app/utils/chains';
import { CoingeckoCoin } from '../models/CoinGeckoCoin';
import { CoinsService } from '../services/coins.service';
import { ProviderService } from '../services/provider.service';
import erc20Object from '../../../assets/ERC20.json';
@Pipe({
  name: 'fromAddressToCg',
})
export class FromAddressToCgPipe implements PipeTransform {
  constructor(
    private providerService: ProviderService,
    private coinsService: CoinsService
  ) {}

  transform(address: string, ...args: any[]): Promise<CoingeckoCoin> {
    return this.getCoinfGeckoCoinInfoHelper(address);
  }

  public async getCoinfGeckoCoinInfoHelper(
    coinAddress: string
  ): Promise<CoingeckoCoin> {
    let coinCKObservable: Observable<CoingeckoCoin> =
      await this.getCoinGeckoCoinInfo(coinAddress);
    return await firstValueFrom(coinCKObservable);
  }

  public async getCoinGeckoCoinInfo(coinAddress: string) {
    const [provider, signer, account, foundActiveNetwork] =
      await this.providerService.getTools();

    return this.coinsService.getAllCoinsForCurrentNetwork().pipe(
      switchMap((coinsFromCoinGecko) => {
        let foundCoin = coinsFromCoinGecko.find((coinCG) => {
          let foundActiveNetwork = getNetwork(account.chainIdConnect);
          return (
            coinCG.platforms[foundActiveNetwork!.platformName] == coinAddress
          );
        });
        if (foundCoin) {
          return foundCoin;
        } else {
          const erc20 = new ethers.Contract(
            coinAddress,
            erc20Object.abi,
            provider
          );
          return forkJoin([
            erc20['name'](),
            erc20['symbol'](),
            erc20['decimals'](),
            erc20['balanceOf'](provider.getSigner().getAddress()),
          ]).pipe(
            map((value) => {
              let [name, symbol, decimals, balanceOf] = value as any;
              let coin: CoingeckoCoin = {
                id: symbol.toLowerCase(),
                symbol: symbol,
                name: name,
                decimals,
                imageSrc$: '/assets/icons/question-mark.png',
                platforms: { [foundActiveNetwork!.platformName]: event },
                amountOfToken$: balanceOf,
              };
              return coin;
            })
          ) as any;
        }
      })
    ) as Observable<any>;
  }
}
