import { Component } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account, State } from '../reducers';
import { MikosavaTrade } from '../shared/models/MikosavaTrade';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { ToastrService } from 'ngx-toastr';
import { returnERC20InstanceFromAddress } from '../utils/tokens';
import { ProviderService } from '../shared/services/provider.service';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { getStatus } from '../utils/utils';
import { UtilsService } from '../shared/services/utils.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-close-trade',
  templateUrl: './close-trade.component.html',
  styleUrls: ['./close-trade.component.scss'],
})
export class CloseTradeComponent {
  public resolveData$!: Observable<Data>;
  public viewedTrade!: MikosavaTrade;
  public account!: Account;
  public allowance: BigInt = BigInt(0);
  public iconNames = IconNamesEnum;

  public getAccount = this.provider.getAccountStream().pipe(
    tap(async (account) => {
      this.allowance = await this.calculateAllowance(
        this.viewedTrade.coinCounterpart
      );
    })
  );
  public getStatus = getStatus;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private toastr: ToastrService,
    private router: Router,
    private provider: ProviderService,
    private utils: UtilsService,
    private bsModal: BsModalService
  ) {
    this.resolveData$ = this.route.data;
  }

  ngOnInit(): void {
    this.resolveData$.subscribe(
      (data: any) => (this.viewedTrade = data.idTrade)
    );
  }

  public async exchange() {
    try {
      const signer = await this.provider.getSigner();
      const otcContract = new ethers.Contract(
        environment.MATIC_DEPLOYED_ADDRESS_OTC,
        MikosavaABI.abi,
        signer
      );
      this.toastr.info('Exchange is on the go');
      let tx = await otcContract['closeOTCCPosition'](this.viewedTrade.tradeId);
      this.utils.displayTransactionDialog(tx.hash);
      const receipt = await tx.wait();
      this.bsModal.hide();
      this.toastr.success('The trade has been completed!');
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.bsModal.hide();
    }
  }

  public async approve() {
    const signer = await this.provider.getSigner();

    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );
    const coinContract = returnERC20InstanceFromAddress(
      this.viewedTrade.coinCounterpart,
      signer
    );

    let tx = await coinContract['approve'](
      otcContract.address,
      this.viewedTrade.amountPositionCounterpart.toString()
    );
    this.toastr.info('Approving is on the go');
    this.utils.displayTransactionDialog(tx.hash);
    const receipt = await tx.wait();
    this.toastr.success('The amount has been approved!');
    this.bsModal.hide();
    this.allowance = await this.calculateAllowance(
      this.viewedTrade.coinCounterpart
    );
  }

  private async calculateAllowance(erc20Address: string): Promise<BigInt> {
    const signer = await this.provider.getSigner();

    const coinAContract = returnERC20InstanceFromAddress(erc20Address, signer);

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

  public async cancell() {
    try {
      const signer = await this.provider.getSigner();
      const otcContract = new ethers.Contract(
        environment.MATIC_DEPLOYED_ADDRESS_OTC,
        MikosavaABI.abi,
        signer
      );
      this.toastr.info('Cancel is on the go');
      let tx = await otcContract['cancellOTCCPosition'](
        this.viewedTrade.tradeId
      );
      this.utils.displayTransactionDialog(tx.hash);
      const receipt = await tx.wait();
      this.bsModal.hide();
      this.toastr.success('The trade has been cancelled!');
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.bsModal.hide();
    }
  }

  public goBack() {
    this.router.navigate(['/list']);
  }
}
