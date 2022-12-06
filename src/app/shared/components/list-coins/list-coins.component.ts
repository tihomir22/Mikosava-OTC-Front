import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  filter,
  first,
  forkJoin,
  interval,
  map,
  of,
  take,
} from 'rxjs';
import { State } from 'src/app/reducers';
import { list } from 'src/app/utils/chains';
import { CoingeckoCoin } from '../../models/CoinGeckoCoin';

@Component({
  selector: 'app-list-coins',
  templateUrl: './list-coins.component.html',
  styleUrls: ['./list-coins.component.scss'],
})
export class ListCoinsComponent {
  public originalCoins: CoingeckoCoin[] = [];
  public filteredCoins: CoingeckoCoin[] = [];
  public networksAvalaible = list;
  public toUpperCase = this.toUpperCaseFn;
  public searchValue = '';

  constructor(private store: Store<State>, private http: HttpClient) {
    combineLatest([
      this.store.select((data) => data.coins),
      this.store.select((data) => data.account),
    ])
      .pipe(
        filter(([coins, account]) => {
          return !!account && Object.values(account).length > 0;
        }),
        map(([coins, account]) =>
          coins
            .filter((coin) => {
              let foundActiveNetwork = this.networksAvalaible.find(
                (network) => network.chainId == account.chainIdConnect
              );

              return foundActiveNetwork
                ? Object.keys(coin.platforms).includes(
                    foundActiveNetwork.platformName
                  )
                : false;
            })
            .map((coin) => {
              let coinCloned = { ...coin };
              coinCloned.imageSrc$ = this.getImage(coin.id);
              return coinCloned;
            })
        )
      )
      .subscribe((data) => {
        this.originalCoins = data;
        this.filteredCoins = [...this.originalCoins];
        this.searchValue = '';
      });
  }

  ngOnInit(): void {}
  public toUpperCaseFn(text: string) {
    return text.toUpperCase();
  }

  public searchChanged(event: string) {
    this.filteredCoins = this.originalCoins.filter((coin) =>
      coin.name.toLowerCase().includes(event.toLowerCase())
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
        map((res: any) => res['image']['small'])
      );
  }
}
