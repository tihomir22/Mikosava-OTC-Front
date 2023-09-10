import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BigNumber, ethers } from 'ethers';
import {
  combineLatest,
  firstValueFrom,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Account, State } from 'src/app/reducers';
import { getNetwork, list } from 'src/app/utils/chains';
import { CoingeckoCoin } from '../../models/CoinGeckoCoin';
import { ProviderService } from '../../services/provider.service';
import * as CoinsActions from '../../../actions/coins.actions';
import { CoinsService } from '../../services/coins.service';
import { AlchemyService } from '../../services/alchemy.service';

@Component({
  selector: 'app-list-coins',
  templateUrl: './list-coins.component.html',
  styleUrls: ['./list-coins.component.scss'],
})
export class ListCoinsComponent {
  public originalCoins: CoingeckoCoin[] = [];
  public filteredCoins: CoingeckoCoin[] = [];
  public activeCoins: CoingeckoCoin[] = [];
  public quickAccessCoins$: Observable<CoingeckoCoin[]> = of([]);
  public networksAvalaible = list;
  public tokensToAvoidSymbol: string[] = [];
  public toUpperCase = this.toUpperCaseFn;
  public searchValue = '';
  @Input() widthList: number = 400;
  @Input() heightList: number = 200;
  @Output() selectCoin = new EventEmitter<CoingeckoCoin>();

  constructor(private store: Store<State>, private coins: CoinsService) {}

  ngOnInit(): void {
    this.loadCoins();
  }

  private async loadCoins(resetSearchValue = true) {
    const coins = await firstValueFrom(
      this.coins.getAllCoinsForCurrentNetwork()
    );
    this.originalCoins = [
      ...coins.filter(
        (coin) =>
          !this.tokensToAvoidSymbol
            .map((entry) => entry.toUpperCase())
            .includes(coin.symbol.toUpperCase())
      ),
    ];

    this.quickAccessCoins$ = this.generateActiveCoins();
    this.filteredCoins = [...this.originalCoins];
    if (resetSearchValue) this.searchValue = '';
  }

  public toUpperCaseFn(text: string) {
    return text.toUpperCase();
  }

  public generateActiveCoins(): Observable<any> {
    return combineLatest([
      this.store.select((data) => data.account),
      from(ProviderService.getWebProvider(false)),
    ]).pipe(
      map((data) => {
        const [account, provider] = data;
        let foundActiveNetwork = getNetwork(account.chainIdConnect);
        let activeCoins = this.originalCoins.filter((originalCoin) =>
          foundActiveNetwork?.easyAccessCoins.includes(originalCoin.address)
        );
        return [activeCoins, account, provider];
      }),
      switchMap((data) => {
        const [entries, account, provider] = data as [
          CoingeckoCoin[],
          Account,
          any
        ];
        if (entries.length > 0) {
          return of(entries);
        } else {
          let foundActiveNetwork = getNetwork(account.chainIdConnect);
          const addressesEasyCoins = foundActiveNetwork?.easyAccessCoins;
          return forkJoin(
            addressesEasyCoins!.map((entry) =>
              this.coins.getERC20Info(entry, provider, account)
            )
          );
        }
      })
    );
  }

  public async searchChanged(event: string) {
    let isAddress = ethers.utils.isAddress(event);
    if (isAddress) {
      firstValueFrom(
        this.store
          .select((data) => data.account)
          .pipe(
            switchMap(async (account: Account) => {
              let foundCoins = this.originalCoins.filter(
                (coin) =>
                  coin.address.toLowerCase() == event.toString().toLowerCase()
              );
              if (foundCoins.length > 0) {
                this.filteredCoins = foundCoins;
              } else {
                const provider = await ProviderService.getWebProvider(false);
                const coin = await firstValueFrom(
                  this.coins.getERC20Info(event, provider, account)
                );
                this.store.dispatch(
                  CoinsActions.addNewCoinExternally({ newCoin: coin })
                );
                await this.loadCoins(false);
                this.searchChanged(event);
              }
            })
          )
      );
    } else {
      this.filteredCoins = this.originalCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(event.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(event.toLowerCase())
      );
    }
  }
}
