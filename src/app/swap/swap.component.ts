import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { State } from 'src/app/reducers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';
import * as CoinsActions from '../actions/coins.actions';
import { firstValueFrom, Observable } from 'rxjs';
import { ProviderService } from '../shared/services/provider.service';
import { BigNumber, ethers } from 'ethers';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { getFeeForInternalPlatformId, getNetwork } from 'src/app/utils/chains';
import { returnERC20InstanceFromAddress } from 'src/app/utils/tokens';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { Router } from '@angular/router';
import moment from 'moment';
import { CoinsService } from '../shared/services/coins.service';
import { MikosavaNft } from '../shared/components/list-nfts/list-nfts.component';
export type TradingType = 'erc20' | 'erc721' | 'mixed';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent {
  public amountCoinAParsed: BigInt = BigInt(0);
  public iconNames = IconNamesEnum;
  public allowance: BigInt = BigInt(0);
  public formGroupERC20: FormGroup = this.fb.group({
    acoin: [null, [Validators.required, Validators.min(0)]],
    bcoin: [null, [Validators.required, Validators.min(0)]],
    availableUntil: [false, []],
    selectAvailableUntil: [null, []],
    selectCustomAvalaible: [null, []],
  });
  public ACoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinA
  );
  public BCoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinB
  );
  public NFTA: Observable<MikosavaNft> = this.store.select(
    (store) => store.selectNFTA
  );
  public NFTB: Observable<MikosavaNft> = this.store.select(
    (store) => store.selectNFTB
  );
  public activeTradingType: TradingType = 'erc20';
  constructor(
    private modalService: BsModalService,
    private store: Store<State>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private router: Router,
    private coinService: CoinsService
  ) {}

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
    let amountParsedA = BigInt(
      this.formGroupERC20.value.acoin * 1.1 * 10 ** decimals
    );

    let tx = await coinAContract['approve'](
      otcContract.address,
      amountParsedA.toString()
    );
    this.toastr.info('Approving is on the go');
    const receipt = await tx.wait();
    this.toastr.success('The amount has been approved!');
    this.allowance = await this.coinService.getAllowanceERC20(selectedACoin);
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

    let amountParsedA = BigInt(
      this.formGroupERC20.value.acoin * 10 ** decimals
    );

    let amountParsedB = BigInt(
      this.formGroupERC20.value.bcoin * 10 ** decimalsCoinB
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
      this.formGroupERC20.reset();
      window.location.href = '/list';
    } catch (error: any) {
      this.toastr.error(error.reason);
    }
  }

  public openTradeNft() {
    console.log('YUP');
  }

  public getValidUntil(): number {
    if (
      !this.formGroupERC20.get('availableUntil')?.value ||
      !this.formGroupERC20.get('selectAvailableUntil')
    )
      return 0;

    let isCustom =
      this.formGroupERC20.get('selectAvailableUntil')?.value == 'custom';

    if (!isCustom) {
      let parsedMinutes = Number(
        this.formGroupERC20.value.selectAvailableUntil
      );
      return +moment(new Date()).add(parsedMinutes, 'minutes').toDate();
    } else {
      return +moment(
        this.formGroupERC20.value.selectCustomAvalaible ?? new Date()
      ).toDate();
    }
  }

  public returnAvailableDetails(): string {
    if (
      !!this.formGroupERC20.get('availableUntil')?.value &&
      !!this.formGroupERC20.get('selectAvailableUntil')?.value
    ) {
      let isCustom =
        this.formGroupERC20.get('selectAvailableUntil')?.value == 'custom';

      if (!isCustom) {
        let parsedMinutes = Number(
          this.formGroupERC20.value.selectAvailableUntil
        );
        return moment(new Date())
          .add(parsedMinutes, 'minutes')
          .format('DD/MM/YYYY HH:mm')
          .toString();
      } else {
        return moment(
          this.formGroupERC20.value.selectCustomAvalaible ?? new Date()
        )
          .format('DD/MM/YYYY HH:mm')
          .toString();
      }
    }
    return '';
  }

  public changeType(newType: TradingType) {
    this.activeTradingType = newType;
  }
}
