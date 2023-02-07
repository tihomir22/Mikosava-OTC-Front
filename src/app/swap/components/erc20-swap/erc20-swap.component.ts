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
  Observable,
} from 'rxjs';
import { State } from 'src/app/reducers';
import { ListCoinsComponent } from 'src/app/shared/components/list-coins/list-coins.component';
import { CoingeckoCoin } from 'src/app/shared/models/CoinGeckoCoin';
import { ProviderService } from 'src/app/shared/services/provider.service';
import * as CoinsActions from '../../../actions/coins.actions';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { returnERC20InstanceFromAddress } from 'src/app/utils/tokens';
import { CoinsService } from 'src/app/shared/services/coins.service';
@Component({
  selector: 'app-erc20-swap',
  templateUrl: './erc20-swap.component.html',
  styleUrls: ['./erc20-swap.component.scss'],
})
export class Erc20SwapComponent {
  @Input() public allowance: BigInt = BigInt(0);
  @Output() allowanceChange = new EventEmitter<BigInt>();
  @Input() formERC20!: FormGroup;
  public ACoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinA
  );
  public BCoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinB
  );
  public amountCoinAParsed: BigInt = BigInt(0);
  public iconNames = IconNamesEnum;

  constructor(
    private modalService: BsModalService,
    private store: Store<State>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private router: Router,
    private coinService: CoinsService
  ) {}

  ngOnInit(): void {
    this.formERC20
      .get('acoin')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (valueChangedCoinA) => {
        let coinSelected = await firstValueFrom(this.ACoin);
        if (coinSelected && Object.values(coinSelected).length > 0) {
          this.allowance = await this.coinService.getAllowanceERC20(
            coinSelected
          );
          this.amountCoinAParsed = await this.returnParsedAmountCoinA();
        }
      });
  }

  public selectCoin(whichOne: 'A' | 'B') {
    let bsModalRef = this.modalService.show(ListCoinsComponent, {
      class: 'modal-dialog-centered',
    });
    if (bsModalRef.content) {
      bsModalRef.content.widthList = 550;
      bsModalRef.content.heightList = 650;
      bsModalRef.content.selectCoin.subscribe(async (coin) => {
        this.store.dispatch(
          whichOne == 'A'
            ? CoinsActions.selectCoinA({ selectACoin: coin })
            : CoinsActions.selectCoinB({ selectBCoin: coin })
        );
        if (whichOne == 'A') {
          this.allowance = await this.coinService.getAllowanceERC20(coin);
        }
        bsModalRef.hide();
      });
    }
  }

  public onClickChipTimeFrameAvailableUntil(timeSelectedInMinutes: number) {
    if (timeSelectedInMinutes == -1) {
      //custom
      this.formERC20.get('selectAvailableUntil')?.patchValue('custom');
    } else {
      this.formERC20
        .get('selectAvailableUntil')
        ?.patchValue(timeSelectedInMinutes);
    }
  }

  private async returnParsedAmountCoinA() {
    const [, signer, , foundActiveNetwork] =
      await this.providerService.getTools();
    let selectedACoin = await firstValueFrom(this.ACoin);
    const coinAContract = returnERC20InstanceFromAddress(
      selectedACoin.platforms[foundActiveNetwork!.platformName],
      signer
    );
    const decimals = await coinAContract['decimals']();
    return BigInt(this.formERC20.value.acoin * 10 ** decimals);
  }
}
