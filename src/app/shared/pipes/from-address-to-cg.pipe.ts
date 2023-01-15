import { Pipe, PipeTransform } from '@angular/core';
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
@Pipe({
  name: 'fromAddressToCg',
})
export class FromAddressToCgPipe implements PipeTransform {
  constructor(
    private providerService: ProviderService,
    private coinsService: CoinsService
  ) {}

  transform(address: string, ...args: any[]): Observable<CoingeckoCoin> {
    return this.getCoinGeckoCoinInfo(address);
  }

  public getCoinGeckoCoinInfo(coinAddress: string) {
    return this.coinsService.getCoinInfoFromAddress(coinAddress);
  }
}
