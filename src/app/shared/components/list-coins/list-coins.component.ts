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
    private coins: CoinsService,
    private alchemy: AlchemyService
  ) {}

  ngOnInit(): void {
    this.loadCoins();
  }

  private async loadCoins() {
    const [account, coins, provider] = await firstValueFrom(
      combineLatest([
        this.store.select((data) => data.account),
        this.coins.getAllCoinsForCurrentNetwork(),
        from(ProviderService.getWebProvider(false)),
      ])
    );

    let userBalances = (
      await this.alchemy.getAllERC20TokensByWallet(account.address)
    ).tokenBalances.sort(
      (a, b) => (b.tokenBalance! as any) - (a.tokenBalance! as any)
    );

    let foundActiveNetwork = getNetwork(account.chainIdConnect);
    const coinAddresses = coins.map(
      (coin) => coin.platforms[foundActiveNetwork!.platformName]
    );

    const notAddedInListTokens = userBalances.filter(
      (tokenBalance) =>
        !coinAddresses.find(
          (coinAddress) =>
            coinAddress.toLowerCase() ==
            tokenBalance.contractAddress.toLowerCase()
        )
    );

    const tokensToAdd = await firstValueFrom(
      forkJoin(
        notAddedInListTokens.map((entry) =>
          from(
            this.alchemy.getMetadataForERC20Token(entry.contractAddress)
          ).pipe(
            map((metadata) => {
              let coin: CoingeckoCoin = {
                id: metadata.symbol!.toLowerCase(),
                symbol: metadata.symbol!,
                name: metadata.name!,
                decimals: metadata.decimals! as any,
                image: metadata.logo ?? '/assets/icons/question-mark.png',
                platforms: {
                  [foundActiveNetwork!.platformName]: entry.contractAddress,
                },
                amountOfToken$: of(
                  (entry.tokenBalance as any) / 10 ** metadata.decimals!
                ),
              };
              return coin;
            })
          )
        )
      )
    );

    this.originalCoins = [...tokensToAdd, ...coins];

    //order => userBalances
    const ordered = userBalances.reduce((prev, current, index) => {
      prev[current.contractAddress] = index;
      return prev;
    }, {} as any);
    this.originalCoins = this.originalCoins.sort(
      (a, b) =>
        ordered[a.platforms[foundActiveNetwork!.platformName]] -
        ordered[b.platforms[foundActiveNetwork!.platformName]]
    );

    this.filteredCoins = [...this.originalCoins];
    this.searchValue = '';
  }

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
                const coin = await firstValueFrom(
                  this.coins.getERC20Info(event, provider, account)
                );
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
