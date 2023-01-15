import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import {
  catchError,
  combineLatest,
  filter,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Account, State } from 'src/app/reducers';
import { getNetwork } from 'src/app/utils/chains';
import { ProviderService } from './provider.service';
import erc20Object from '../../../assets/ERC20.json';
import { ParseFromWeiToDecimalNumberPipe } from '../pipes/parse-from-wei-to-decimal-number.pipe';
import { CoingeckoCoin } from '../models/CoinGeckoCoin';
import { CookieService } from 'ngx-cookie-service';
import {
  AddressToCoin,
  CookieCoinStructure,
} from '../models/CookieCoinStructure';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  constructor(
    private store: Store<State>,
    private http: HttpClient,
    private fromWeiToUnit: ParseFromWeiToDecimalNumberPipe,
    private cookieService: CookieService,
    private providerService: ProviderService
  ) {}

  public getAllCoinsForCurrentNetwork() {
    return combineLatest([
      this.store.select((data) => data.coins),
      this.store.select((data) => data.account),
    ]).pipe(
      filter(([coins, account]) => {
        return !!account && Object.values(account).length > 0;
      }),
      map((data) => {
        let [coins, account] = data;
        coins = [
          ...coins,
          ...this.extractCoinsFromCookiesForCurrentNetwork(
            account.chainIdConnect
          ),
        ];
        return [coins, account] as [Array<CoingeckoCoin>, Account];
      }),
      map(([coins, account]) =>
        coins
          .filter((coin) => {
            let foundActiveNetwork = getNetwork(account.chainIdConnect);
            let coinAddress = coin.platforms[foundActiveNetwork!.platformName];
            return foundActiveNetwork
              ? Object.keys(coin.platforms).includes(
                  foundActiveNetwork.platformName
                ) && coinAddress != foundActiveNetwork.nativeCurrency.address
              : false;
          })
          .map((coin) => {
            let coinCloned = { ...coin };
            let foundActiveNetwork = getNetwork(account.chainIdConnect);
            coinCloned.image = coin.image ?? '/assets/icons/question-mark.png';
            coinCloned.amountOfToken$ = this.getAmountOfToken(
              coin.platforms[foundActiveNetwork!.platformName]
            );
            return coinCloned;
          })
      )
    );
  }

  public getCoinInfoFromAddress(tokenAddress: string) {
    let provider: any;
    let account: Account;
    let foundActiveNetwork: any;
    return from(this.providerService.getTools()).pipe(
      switchMap((tools) => {
        [provider, , account, foundActiveNetwork] = tools;
        return this.getAllCoinsForCurrentNetwork();
      }),
      switchMap((coinsFromCoinGecko) => {
        let foundCoin = coinsFromCoinGecko.find((coinCG) => {
          let foundActiveNetwork = getNetwork(account.chainIdConnect);
          return (
            coinCG.platforms[foundActiveNetwork!.platformName] == tokenAddress
          );
        });
        if (foundCoin) {
          return of(foundCoin);
        } else {
          return this.getERC20Info(tokenAddress, provider, account);
        }
      })
    );
  }

  public getERC20Info(tokenAddress: string, provider: any, account: Account) {
    let foundActiveNetwork = getNetwork(account.chainIdConnect);
    const erc20 = new ethers.Contract(tokenAddress, erc20Object.abi, provider);
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
          image: '/assets/icons/question-mark.png',
          platforms: { [foundActiveNetwork!.platformName]: tokenAddress },
          amountOfToken$: balanceOf,
        };
        this.addCustomCoinToCookiesBasedOnNetwork(
          foundActiveNetwork!.chainId,
          tokenAddress,
          coin
        );
        return coin;
      })
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
        return forkJoin([
          provider.getSigner().getAddress(),
          of(provider),
          of(contract),
        ]);
      }),
      switchMap((data) => {
        const [address, provider, contract] = data as any;
        return from((contract as any)['balanceOf'](address)).pipe(
          map((value: any) => this.fromWeiToUnit.transform(value, tokenAddress))
        );
      }),
      switchMap((value) => value),
      catchError((err) => {
        return of(0);
      })
    );
  }

  public addCustomCoinToCookiesBasedOnNetwork(
    chainId: number,
    tokenAddress: string,
    customCoin: CoingeckoCoin
  ) {
    let actualCookieState = this.cookieService.get(chainId.toString());
    let latestState: AddressToCoin = {};
    if (actualCookieState.length > 0) {
      latestState = JSON.parse(actualCookieState);
    }
    latestState[tokenAddress] = customCoin;

    this.cookieService.set(chainId.toString(), JSON.stringify(latestState));
  }

  private extractCoinsFromCookiesForCurrentNetwork(
    chainId: number
  ): Array<CoingeckoCoin> {
    let actualCookieState = this.cookieService.get(chainId.toString());
    if (actualCookieState.length == 0) return [];
    return Object.values(JSON.parse(actualCookieState));
  }
}
