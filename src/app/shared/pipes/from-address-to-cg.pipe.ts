import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import {
  firstValueFrom,
  forkJoin,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { getNetwork } from 'src/app/utils/chains';
import { CoingeckoCoin } from '../models/CoinGeckoCoin';
import { CoinsService } from '../services/coins.service';
import { ProviderService } from '../services/provider.service';
@Injectable({
  providedIn: 'root',
})
export class parseFromAddressToCgCache {
  public mapping: { [address: string]: CoingeckoCoin } = {};
}
@Pipe({
  name: 'fromAddressToCg',
})
export class FromAddressToCgPipe implements PipeTransform {
  constructor(
    private providerService: ProviderService,
    private coinsService: CoinsService,
    private cache: parseFromAddressToCgCache
  ) {}

  transform(address: string, ...args: any[]): Observable<CoingeckoCoin> {
    return from(this.getCoinGeckoCoinInfo(address));
  }

  public async getCoinGeckoCoinInfo(coinAddress: string) {
    if (!!this.cache.mapping[coinAddress]) {
      return this.cache.mapping[coinAddress];
    } else {
      const coinInfo = await firstValueFrom(
        this.coinsService.getCoinInfoFromAddress(coinAddress)
      );
      this.cache.mapping[coinAddress] = coinInfo;
      return coinInfo;
    }
  }
}
