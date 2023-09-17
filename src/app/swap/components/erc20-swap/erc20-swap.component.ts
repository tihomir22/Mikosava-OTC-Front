import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  from,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { State } from 'src/app/reducers';
import { ListCoinsComponent } from 'src/app/shared/components/list-coins/list-coins.component';
import { CoingeckoCoin } from 'src/app/shared/models/CoinGeckoCoin';
import { ProviderService } from 'src/app/shared/services/provider.service';
import * as CoinsActions from '../../../actions/coins.actions';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { returnERC20InstanceFromAddress } from 'src/app/utils/tokens';
import { CoinsService } from 'src/app/shared/services/coins.service';
import { getNetwork } from 'src/app/utils/chains';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-erc20-swap',
  templateUrl: './erc20-swap.component.html',
  styleUrls: ['./erc20-swap.component.scss'],
})
export class Erc20SwapComponent {
  @Input() formERC20!: FormGroup;
  public ACoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinA
  );
  public BCoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinB
  );

  public iconNames = IconNamesEnum;

  constructor(
    private modalService: BsModalService,
    private store: Store<State>,
    private providerService: ProviderService,
    private coinService: CoinsService,
    private numberPipe: DecimalPipe
  ) {}

  ngOnInit(): void {}

  public async selectCoin(whichOne: 'A' | 'B') {
    const [, signer, , foundActiveNetwork] =
      await this.providerService.getTools();
    let coinASelected = await firstValueFrom(this.ACoin);
    let coinBSelected = await firstValueFrom(this.BCoin);
    let bsModalRef = this.modalService.show(ListCoinsComponent, {
      class: 'modal-dialog-centered',
    });
    if (bsModalRef.content) {
      bsModalRef.content.widthList = 550;
      bsModalRef.content.heightList = 650;
      if (whichOne == 'B') {
        const avoidingList = [foundActiveNetwork.nativeCurrency.symbol];
        if (!!coinASelected) avoidingList.push(coinASelected.symbol);
        bsModalRef.content.tokensToAvoidSymbol = avoidingList;
      } else {
        bsModalRef.content.tokensToAvoidSymbol = !!coinBSelected
          ? [coinBSelected.symbol]
          : [];
      }
      bsModalRef.content.selectCoin.subscribe(async (coin) => {
        this.store.dispatch(
          whichOne == 'A'
            ? CoinsActions.selectCoinA({ selectACoin: coin })
            : CoinsActions.selectCoinB({ selectBCoin: coin })
        );
        bsModalRef.hide();
      });
    }
  }

  public async calculateAmount(type: 'A' | 'B', amount: 50 | 100) {
    let amountToSet = 0;
    if (type == 'A') {
      const coinA = await firstValueFrom(this.ACoin);

      if (!!coinA) {
        const amountCoinA = (await firstValueFrom(
          coinA.amountOfToken$
        )) as number;
        if (amountCoinA > 0) amountToSet = amountCoinA * (amount / 100);
      }
      this.formERC20.controls['acoin'].patchValue(
        this.numberPipe.transform(amountToSet, '1.1-18')
      );
    } else {
      const coinB = await firstValueFrom(this.BCoin);
      if (!!coinB) {
        const amountCoinB = (await firstValueFrom(
          coinB.amountOfToken$
        )) as number;

        if (amountCoinB > 0) amountToSet = amountCoinB * (amount / 100);
      }
      this.formERC20.controls['bcoin'].patchValue(
        this.numberPipe.transform(amountToSet, '1.1-18')
      );
    }
  }
  public async replaceSelected() {
    let coinASelected = await firstValueFrom(this.ACoin);
    let coinBSelected = await firstValueFrom(this.BCoin);
    let amountA = this.formERC20.controls['acoin'].getRawValue();
    let amountB = this.formERC20.controls['bcoin'].getRawValue();
    if (!coinASelected || !coinBSelected) return;
    this.store.dispatch(
      CoinsActions.selectCoinA({ selectACoin: coinBSelected })
    );
    this.formERC20.controls['acoin'].patchValue(amountB);
    this.store.dispatch(
      CoinsActions.selectCoinB({ selectBCoin: coinASelected })
    );
    this.formERC20.controls['bcoin'].patchValue(amountA);
  }
}
