import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import {
  Observable,
  catchError,
  combineLatest,
  filter,
  firstValueFrom,
  forkJoin,
  from,
  map,
  of,
  retry,
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
import { returnERC20InstanceFromAddress } from 'src/app/utils/tokens';
import MikosavaABI from '../../../assets/MikosavaOTC.json';

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
      map(([coins, account]) => {
        const coinsFromCookies = this.extractCoinsFromCookiesForCurrentNetwork(
          account.chainIdConnect
        );
        coins = [...new Set([...coins, ...coinsFromCookies])];
        return coins.map((coin) => {
          let coinCloned = { ...coin };
          coinCloned.image = coin.image ?? '/assets/icons/question-mark.png';
          coinCloned.amountOfToken$ = this.getAmountOfToken(coin.address);
          return coinCloned;
        });
      })
    );
  }

  public getCoinInfoFromAddress(
    tokenAddress: string
  ): Observable<CoingeckoCoin> {
    let provider: any;
    let account: Account;
    return from(this.providerService.getTools()).pipe(
      switchMap((tools) => {
        [provider, , account] = tools;
        return this.getAllCoinsForCurrentNetwork();
      }),
      switchMap((coinsFromCoinGecko) => {
        let foundCoin = coinsFromCoinGecko.find((coinCG) => {
          return coinCG.address == tokenAddress;
        });
        if (foundCoin) {
          return of(foundCoin);
        } else {
          return this.getERC20Info(tokenAddress, provider, account);
        }
      })
    );
  }

  public getCoinDecimalsFromAddress(tokenAddress: string) {
    let provider: any;
    let account: Account;
    return from(this.providerService.getTools()).pipe(
      switchMap((tools) => {
        [provider, , account] = tools;
        const erc20 = new ethers.Contract(
          tokenAddress,
          erc20Object.abi,
          provider
        );
        return erc20['decimals']();
      })
    );
  }

  public getERC20Info(tokenAddress: string, provider: any, account: Account) {
    const erc20 = new ethers.Contract(tokenAddress, erc20Object.abi, provider);
    return forkJoin([
      erc20['name'](),
      erc20['symbol'](),
      erc20['decimals'](),
      erc20['balanceOf'](account.address),
    ]).pipe(
      map((value) => {
        let [name, symbol, decimals, balanceOf] = value as any;
        let coin: CoingeckoCoin = {
          id: symbol.toLowerCase(),
          symbol: symbol,
          name: name,
          decimals,
          image: '/assets/icons/question-mark.png',
          address: tokenAddress,
          amountOfToken$: of((balanceOf as any) / 10 ** decimals!),
        };
        this.addCustomCoinToCookiesBasedOnNetwork(account.chainIdConnect, coin);
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
          map((value: any) => {
            return this.fromWeiToUnit.transform(value, tokenAddress);
          })
        );
      }),
      switchMap((value) => value),
      retry(1),
      catchError((err) => {
        return of(0);
      })
    );
  }

  public addCustomCoinToCookiesBasedOnNetwork(
    chainId: number,
    customCoin: CoingeckoCoin
  ) {
    this.cookieService.set(
      'MIKOSAVA_' + chainId.toString() + '_' + customCoin.symbol,
      JSON.stringify(customCoin)
    );
  }

  public async getAllowanceERC20(address: string): Promise<BigInt> {
    const [, signer, , foundActiveNetwork] =
      await this.providerService.getTools();

    const coinAContract = returnERC20InstanceFromAddress(address, signer);

    const otcContract = new ethers.Contract(
      foundActiveNetwork.contracts.OTC_PROXY,
      MikosavaABI.abi,
      signer
    );

    let allowance = await coinAContract['allowance'](
      await signer.getAddress(),
      otcContract.address
    );
    return allowance;
  }

  private extractCoinsFromCookiesForCurrentNetwork(
    chainId: number
  ): Array<CoingeckoCoin> {
    const allCookies = this.cookieService.getAll();
    const keysAllCookies = Object.keys(allCookies);
    const coinsForThisNetwork = keysAllCookies.filter((entry) =>
      entry.includes(`MIKOSAVA_${chainId}`)
    );
    const coins = coinsForThisNetwork.map((entry) =>
      JSON.parse(allCookies[entry])
    );
    return coins;
  }
  public async isCoinANativeCoin(): Promise<boolean> {
    const [, , , foundActiveNetwork] = await this.providerService.getTools();
    const aCoin = await firstValueFrom(
      this.store.select((store) => store.selectCoinA)
    );
    if (
      !!aCoin &&
      aCoin.symbol.toLowerCase() ==
        foundActiveNetwork.nativeCurrency.symbol.toLowerCase()
    ) {
      return true;
    }
    return false;
  }
}
