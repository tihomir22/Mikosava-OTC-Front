import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import {
  catchError,
  combineLatest,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { State } from 'src/app/reducers';
import { getNetwork } from 'src/app/utils/chains';
import { ProviderService } from './provider.service';
import erc20Object from '../../../assets/ERC20.json';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  constructor(private store: Store<State>, private http: HttpClient) {}

  public getAllCoinsForCurrentNetwork() {
    return combineLatest([
      this.store.select((data) => data.coins),
      this.store.select((data) => data.account),
    ]).pipe(
      filter(([coins, account]) => {
        return !!account && Object.values(account).length > 0;
      }),
      map(([coins, account]) =>
        coins
          .filter((coin) => {
            let foundActiveNetwork = getNetwork(account.chainIdConnect);
            return foundActiveNetwork
              ? Object.keys(coin.platforms).includes(
                  foundActiveNetwork.platformName
                )
              : false;
          })
          .map((coin) => {
            let coinCloned = { ...coin };
            let foundActiveNetwork = getNetwork(account.chainIdConnect);
            coinCloned.imageSrc$ = this.getImage(coin.id);
            coinCloned.amountOfToken$ = this.getAmountOfToken(
              coin.platforms[foundActiveNetwork!.platformName]
            );
            return coinCloned;
          })
      )
    );
  }

  public getImage(coinId: string) {
    return this.http
      .get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
      )
      .pipe(
        catchError((err) => {
          return of({ image: { small: '/assets/icons/question-mark.png' } });
        }),
        map((res: any) => res['image']['small']),
        tap((entry) => console.log('Executed ', entry))
      );
  }

  public getAmountOfToken(tokenAddress: string) {
    return from(ProviderService.getWebProvider(false)).pipe(
      switchMap((provider) => {
        return of([
          provider,
          new ethers.Contract(tokenAddress, erc20Object.abi, provider),
        ]);
      }),
      switchMap(([provider, contract]) => {
        return from(
          (contract as any)['balanceOf'](provider.getSigner().getAddress())
        ).pipe(map((value: any) => value.toNumber()));
      }),
      catchError((err) => {
        return of(0);
      }),
      tap((entry) => console.log('Executed'))
    );
  }
}