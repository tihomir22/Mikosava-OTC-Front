import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { State } from 'src/app/reducers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';
import { ListCoinsComponent } from '../shared/components/list-coins/list-coins.component';
import * as CoinsActions from '../actions/coins.actions';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  interval,
  Observable,
} from 'rxjs';
import { ProviderService } from '../shared/services/provider.service';
import { BigNumber, ethers } from 'ethers';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { getFeeForInternalPlatformId, getNetwork } from 'src/app/utils/chains';
import { returnERC20InstanceFromAddress } from 'src/app/utils/tokens';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent {
  public ACoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinA
  );
  public BCoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinB
  );

  public formGroup: FormGroup = this.fb.group({
    acoin: [null, [Validators.required, Validators.min(0)]],
    bcoin: [null, [Validators.required, Validators.min(0)]],
    availableUntil: [false, []],
    selectAvailableUntil: [null, []],
    selectCustomAvalaible: [null, []],
  });

  public allowance: BigInt = BigInt(0);
  public amountCoinAParsed: BigInt = BigInt(0);
  public iconNames = IconNamesEnum;

  constructor(
    private modalService: BsModalService,
    private store: Store<State>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private router: Router
  ) {
    this.formGroup
      .get('acoin')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (valueChangedCoinA) => {
        let coinSelected = await firstValueFrom(this.ACoin);
        if (coinSelected && Object.values(coinSelected).length > 0) {
          this.allowance = await this.calculateAllowance(coinSelected);
          this.amountCoinAParsed = await this.returnParsedAmountCoinA();
        }
      });
  }



  public onClickChipTimeFrameAvailableUntil(timeSelectedInMinutes: number) {
    if (timeSelectedInMinutes == -1) {
      //custom
      this.formGroup.get('selectAvailableUntil')?.patchValue('custom');
    } else {
      this.formGroup
        .get('selectAvailableUntil')
        ?.patchValue(timeSelectedInMinutes);
    }
  }

  public getValidUntil(): number {
    if (
      !this.formGroup.get('availableUntil')?.value ||
      !this.formGroup.get('selectAvailableUntil')
    )
      return 0;

    let isCustom =
      this.formGroup.get('selectAvailableUntil')?.value == 'custom';

    if (!isCustom) {
      let parsedMinutes = Number(this.formGroup.value.selectAvailableUntil);
      return +moment(new Date()).add(parsedMinutes, 'minutes').toDate();
    } else {
      return +moment(
        this.formGroup.value.selectCustomAvalaible ?? new Date()
      ).toDate();
    }
  }

  public returnAvailableDetails(): string {
    if (
      !!this.formGroup.get('availableUntil')?.value &&
      !!this.formGroup.get('selectAvailableUntil')?.value
    ) {
      let isCustom =
        this.formGroup.get('selectAvailableUntil')?.value == 'custom';

      if (!isCustom) {
        let parsedMinutes = Number(this.formGroup.value.selectAvailableUntil);
        return moment(new Date())
          .add(parsedMinutes, 'minutes')
          .format('DD/MM/YYYY HH:mm')
          .toString();
      } else {
        return moment(this.formGroup.value.selectCustomAvalaible ?? new Date())
          .format('DD/MM/YYYY HH:mm')
          .toString();
      }
    }
    return '';
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
          this.allowance = await this.calculateAllowance(coin);
        }
        bsModalRef.hide();
      });
    }
  }

  private async calculateAllowance(coin: CoingeckoCoin): Promise<BigInt> {
    const [, signer, , foundActiveNetwork] =
      await this.providerService.getTools();

    const coinAContract = returnERC20InstanceFromAddress(
      coin.platforms[foundActiveNetwork!.platformName],
      signer
    );

    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );

    let allowance = await coinAContract['allowance'](
      await signer.getAddress(),
      otcContract.address
    );

    return allowance;
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
    return BigInt(this.formGroup.value.acoin * 10 ** decimals);
  }

  public async approve() {
    const [, signer, , foundActiveNetwork] =
      await this.providerService.getTools();
    let selectedACoin = await firstValueFrom(this.ACoin);

    const coinAContract = returnERC20InstanceFromAddress(
      selectedACoin.platforms[foundActiveNetwork!.platformName],
      signer
    );
    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );
    const decimals = await coinAContract['decimals']();
    let amountParsedA = BigInt(this.formGroup.value.acoin * 10 ** decimals);

    let tx = await coinAContract['approve'](
      otcContract.address,
      amountParsedA.toString()
    );
    this.toastr.info('Approving is on the go');
    const receipt = await tx.wait();
    this.toastr.success('The amount has been approved!');
    this.allowance = await this.calculateAllowance(selectedACoin);
  }

  public async openTrade() {
    const [provider, signer, , foundActiveNetwork] =
      await this.providerService.getTools();
    let selectedACoin = await firstValueFrom(this.ACoin);
    let selectedBCoin = await firstValueFrom(this.BCoin);

    const coinAContract = returnERC20InstanceFromAddress(
      selectedACoin.platforms[foundActiveNetwork!.platformName],
      signer
    );

    const coinBContract = returnERC20InstanceFromAddress(
      selectedBCoin.platforms[foundActiveNetwork!.platformName],
      signer
    );

    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );

    const decimals = await coinAContract['decimals']();
    const decimalsCoinB = await coinBContract['decimals']();
    // const name = await coinAContract['name']();
    // const symbol = await coinAContract['symbol']();
    // const balanceOf = await coinAContract['balanceOf'](
    //   provider.getSigner().getAddress()
    // );

    let amountParsedA = BigInt(this.formGroup.value.acoin * 10 ** decimals);

    let amountParsedB = BigInt(
      this.formGroup.value.bcoin * 10 ** decimalsCoinB
    );

    try {
      let trade = await otcContract['createOTCCPosition'](
        coinAContract.address,
        coinBContract.address,
        amountParsedA.toString(),
        amountParsedB.toString(),
        this.getValidUntil() * 1000,
        {
          value:
            getFeeForInternalPlatformId(foundActiveNetwork!.interal_name_id) *
            10 ** foundActiveNetwork!.nativeCurrency.decimals,
        }
      );
      this.toastr.info('The trade is pending...');
      const receipt = await trade.wait();
      this.toastr.success('The trade has been opened correctly.');
      this.store.dispatch(
        CoinsActions.selectCoinA({ selectACoin: null as any })
      );
      this.store.dispatch(
        CoinsActions.selectCoinB({ selectBCoin: null as any })
      );
      this.formGroup.reset();
      setTimeout(() => {
        this.router.navigate(['/list']);
      }, 1000);
    } catch (error: any) {
      this.toastr.error(error.reason);
    }
  }
}
