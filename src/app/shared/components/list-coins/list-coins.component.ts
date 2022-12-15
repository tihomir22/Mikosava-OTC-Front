import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
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
  catchError,
  combineLatest,
  filter,
  first,
  firstValueFrom,
  forkJoin,
  from,
  interval,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Account, State } from 'src/app/reducers';
import { getNetwork, list } from 'src/app/utils/chains';
import { CoingeckoCoin } from '../../models/CoinGeckoCoin';
import erc20Object from '../../../../assets/ERC20.json';
import { ProviderService } from '../../services/provider.service';
import * as CoinsActions from '../../../actions/coins.actions';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-list-coins',
  templateUrl: './list-coins.component.html',
  styleUrls: ['./list-coins.component.scss'],
})
export class ListCoinsComponent {
  public originalCoins: CoingeckoCoin[] = [];
  public filteredCoins: CoingeckoCoin[] = [];
  public activeCoins: CoingeckoCoin[] = [];
  public quickAccessCoins$: Observable<CoingeckoCoin[]> =
    this.generateActiveCoins();
  public networksAvalaible = list;
  public toUpperCase = this.toUpperCaseFn;
  public searchValue = '';
  @Input() widthList: number = 400;
  @Input() heightList: number = 200;
  @Output() selectCoin = new EventEmitter<CoingeckoCoin>();

  constructor(
    private store: Store<State>,
    private http: HttpClient,
    private coins: CoinsService
  ) {
    this.coins.getAllCoinsForCurrentNetwork().subscribe((data) => {
      this.originalCoins = data;
      this.filteredCoins = [...this.originalCoins];
      this.searchValue = '';
    });
  }

  ngOnInit(): void {}

  public toUpperCaseFn(text: string) {
    return text.toUpperCase();
  }

  public generateActiveCoins() {
    return this.store
      .select((data) => data.account)
      .pipe(
        map((account) => {
          let foundActiveNetwork = getNetwork(account.chainIdConnect);
          let activeCoins = this.originalCoins.filter((originalCoin) =>
            foundActiveNetwork?.easyAccessCoins.includes(
              originalCoin.platforms[foundActiveNetwork!.platformName]
            )
          );
          return activeCoins;
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
              let foundActiveNetwork = getNetwork(account.chainIdConnect);
              let foundCoins = this.originalCoins.filter(
                (coin) =>
                  coin.platforms[
                    foundActiveNetwork!.platformName
                  ].toLowerCase() == event.toString().toLowerCase()
              );
              if (foundCoins.length > 0) {
                this.filteredCoins = foundCoins;
              } else {
                const provider = await ProviderService.getWebProvider(false);
                const erc20 = new ethers.Contract(
                  event,
                  erc20Object.abi,
                  provider
                );
                const decimals = await erc20['decimals']();
                const name = await erc20['name']();
                const symbol = await erc20['symbol']();
                const balanceOf = await erc20['balanceOf'](
                  provider.getSigner().getAddress()
                );
                let coin: CoingeckoCoin = {
                  id: symbol.toLowerCase(),
                  symbol: symbol,
                  decimals,
                  name: name,
                  platforms: { [foundActiveNetwork!.platformName]: event },
                  amountOfToken$: balanceOf,
                };
                this.store.dispatch(
                  CoinsActions.addNewCoinExternally({ newCoin: coin })
                );
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
