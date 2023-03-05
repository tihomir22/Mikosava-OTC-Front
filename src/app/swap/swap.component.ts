import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account, State } from 'src/app/reducers';
import { CoingeckoCoin } from '../shared/models/CoinGeckoCoin';
import * as CoinsActions from '../actions/coins.actions';
import * as NftActions from '../actions/nfts.actions';
import {
  combineLatest,
  filter,
  firstValueFrom,
  forkJoin,
  interval,
  map,
  merge,
  Observable,
  switchMap,
} from 'rxjs';
import { ProviderService } from '../shared/services/provider.service';
import { BigNumber, ethers } from 'ethers';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { getFeeForInternalPlatformId, getNetwork } from 'src/app/utils/chains';
import {
  returnERC20InstanceFromAddress,
  returnERC721InstanceFromAddress,
} from 'src/app/utils/tokens';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { Router } from '@angular/router';
import moment from 'moment';
import { CoinsService } from '../shared/services/coins.service';
import { MikosavaNft } from '../shared/components/list-nfts/list-nfts.component';
import { UtilsService } from '../shared/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
export type TradingType = 'erc20' | 'erc721' | 'mixed';
export enum ErrorErc20 {
  NO_ERROR = 0,
  POSITION_IS_ZERO = 1,
  MORE_THAN_BALANCE = 2,
}
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
  public validUntil: number = 0;
  public privateTrade = false;
  public errorStateERC20: ErrorErc20 = ErrorErc20.NO_ERROR;
  public ErrorErc20MAP = ErrorErc20;

  constructor(
    private modalService: BsModalService,
    private store: Store<State>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private router: Router,
    private coinService: CoinsService,
    private utils: UtilsService,
    private translate: TranslateService
  ) {
    combineLatest([this.ACoin, this.BCoin, this.formGroupERC20.valueChanges])
      .pipe(
        filter(([acoin, bcoin, form]) => {
          return !!acoin && !!bcoin && !!form;
        }),
        switchMap(([acoin, bcoin, form]) => {
          return forkJoin(acoin.amountOfToken$, bcoin.amountOfToken$).pipe(
            map((amounts) => {
              const [amountA, amountB] = amounts as any;
              return [acoin, amountA, bcoin, amountB, form];
            })
          );
        })
      )
      .subscribe((data) => {
        const [aCoin, balanceA, bCoin, balanceB, formAmount] = data;
        this.errorStateERC20 = this.getErrorValidationERC20(
          formAmount.acoin,
          balanceA,
          formAmount.bcoin,
          balanceB
        );
      });
  }

  public getErrorValidationERC20(
    aCoinAmount: number,
    aCoinBalance: number,
    bCoinAmount: number,
    bCoinBalance: number
  ): ErrorErc20 {
    //Position can't be 0
    if (aCoinAmount === 0) {
      return ErrorErc20.POSITION_IS_ZERO;
    }
    //Check if desired amount exceeds balance
    if (aCoinAmount > aCoinBalance) {
      return ErrorErc20.MORE_THAN_BALANCE;
    }
    return ErrorErc20.NO_ERROR;
  }

  public returnErrorMessage() {
    if (this.errorStateERC20 == ErrorErc20.MORE_THAN_BALANCE) {
      return this.translate.instant('COINS.ERROR.MORE_THAN_BALANCE');
    } else if (this.errorStateERC20 == ErrorErc20.POSITION_IS_ZERO) {
      return this.translate.instant('COINS.ERROR.POSITION_IS_ZERO');
    }
    return '';
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
      foundActiveNetwork.contracts.OTC_PROXY,
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
    this.utils.displayTransactionDialog(tx.hash);
    const receipt = await tx.wait();
    this.toastr.success('The amount has been approved!');
    this.modalService.hide();
    this.allowance = await this.coinService.getAllowanceERC20(selectedACoin);
  }

  public async openNftTrade() {
    const [provider, signer, account, foundActiveNetwork] =
      await this.providerService.getTools();

    const nftA = await firstValueFrom(this.NFTA);

    const nftB = await firstValueFrom(this.NFTB);

    const nftAContract = returnERC721InstanceFromAddress(
      nftA.contract.address,
      signer
    );

    const nftBContract = returnERC721InstanceFromAddress(
      nftB.contract.address,
      signer
    );

    const otcContract = new ethers.Contract(
      foundActiveNetwork.contracts.OTC_PROXY,
      MikosavaABI.abi,
      signer
    );

    const approval = await nftAContract['approve'](
      otcContract.address,
      nftA.tokenId,
      { from: (account as Account).address }
    );
    this.toastr.info('Approving is on the go');
    const receipt = await approval.wait();
    const fees =
      getFeeForInternalPlatformId(foundActiveNetwork!.interal_name_id) *
      10 ** foundActiveNetwork!.nativeCurrency.decimals;
    try {
      let trade = await otcContract['createOTCNPosition'](
        nftAContract.address,
        nftBContract.address,
        nftA.tokenId,
        nftB.tokenId,
        this.validUntil * 1000,
        !this.privateTrade,
        {
          value: fees,
        }
      );
      this.toastr.info('The trade is pending...');
      this.utils.displayTransactionDialog(trade.hash);
      const receipt = await trade.wait();
      this.modalService.hide();
      this.toastr.success('The trade has been opened correctly.');
      this.store.dispatch(NftActions.selectNftA({ selectANFT: null as any }));
      this.store.dispatch(NftActions.selectNftB({ selectBNFT: null as any }));
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.modalService.hide();
    }
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
      foundActiveNetwork.contracts.OTC_PROXY,
      MikosavaABI.abi,
      signer
    );

    const decimals = await coinAContract['decimals']();
    const decimalsCoinB = await coinBContract['decimals']();

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
        this.validUntil * 1000,
        !this.privateTrade,
        {
          value:
            getFeeForInternalPlatformId(foundActiveNetwork!.interal_name_id) *
            10 ** foundActiveNetwork!.nativeCurrency.decimals,
        }
      );
      this.utils.displayTransactionDialog(trade.hash);
      this.toastr.info('The trade is pending...');
      const receipt = await trade.wait();
      this.modalService.hide();
      this.toastr.success('The trade has been opened correctly.');
      this.store.dispatch(
        CoinsActions.selectCoinA({ selectACoin: null as any })
      );
      this.store.dispatch(
        CoinsActions.selectCoinB({ selectBCoin: null as any })
      );
      this.formGroupERC20.reset();
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.modalService.hide();
    }
  }

  public changeType(newType: TradingType) {
    this.activeTradingType = newType;
  }
}
