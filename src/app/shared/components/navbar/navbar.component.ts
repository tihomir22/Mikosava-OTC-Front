import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, filter, map, noop, Observable, of, switchMap } from 'rxjs';
import { Account, State } from 'src/app/reducers';
import { ChainIds, getNetwork } from 'src/app/utils/chains';
import { ParseFromWeiToDecimalNumberPipe } from '../../pipes/parse-from-wei-to-decimal-number.pipe';
import { ProviderService } from '../../services/provider.service';
import { tap } from 'lodash';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() public isCollapsed: boolean = true;
  private account$: Observable<Account>;
  public balance$: Observable<string>;
  public nativeCurrencyName$: Observable<any>;
  public activeAccount$ = null as any;

  constructor(
    private store: Store<any>,
    public route: ActivatedRoute,
    private transformToEther: ParseFromWeiToDecimalNumberPipe,
    private providerService: ProviderService
  ) {
    this.account$ = this.store.select((action: State) => action.account);
    this.account$.subscribe(noop);
    this.activeAccount$ = this.account$.pipe(
      map((account) => getNetwork(account.chainIdConnect))
    );
    this.nativeCurrencyName$ = this.account$.pipe(
      map((acount) => getNetwork(acount.chainIdConnect)?.nativeCurrency.name)
    );
    this.balance$ = this.account$.pipe(
      switchMap((account) => {
        if (account && account.balance) {
          return this.transformToEther.transform(account.balance, '', 'native');
        } else {
          return of(0);
        }
      }),
      switchMap((balance) => {
        return of(balance.toFixed(4));
      })
    );
  }

  ngOnInit(): void {}

  public isCurrentPathActive(pathToCheck: string): boolean {
    return pathToCheck == window.location.pathname;
  }
}
