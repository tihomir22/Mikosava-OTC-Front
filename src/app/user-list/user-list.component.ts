import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import {
  firstValueFrom,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../reducers';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { MikosavaTrade } from '../shared/models/MikosavaTrade';
import { CoinsService } from '../shared/services/coins.service';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShareModalComponent } from '../shared/components/share-modal/share-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  public trades: Observable<Array<MikosavaTrade>> = from(
    this.loadMyTrades()
  ).pipe(
    tap((trades) => {
      this.tradesLoaded = true;
      console.log(trades);
      of(trades);
    })
  );
  public iconNames = IconNamesEnum;
  public tradesLoaded = false;

  constructor(
    private store: Store<State>,
    private coins: CoinsService,
    private provider: ProviderService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.provider.getAccountStream().subscribe((data) => {
      this.tradesLoaded = false;
      this.trades = from(this.loadMyTrades()).pipe(
        tap((trades) => {
          this.tradesLoaded = true;
          console.log(trades);
        })
      );
    });
  }

  public async loadMyTrades() {
    const [provider, signer, account, foundActiveNetwork] =
      await this.provider.getTools();
    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );
    return otcContract['fetchMyCoinTrades']();
  }

  public openShareModal(trade: MikosavaTrade) {
    let bsModalRef = this.modalService.show(ShareModalComponent, {
      class: 'modal-dialog-centered',
    });
    bsModalRef.content!.trade = trade;
    bsModalRef.content!.url =
      window.location.origin + '/trade/' + trade.tradeId;
  }

  public async cancelTrade(trade: MikosavaTrade) {
    const [, signer, , ,] = await this.provider.getTools();

    const otcContract = new ethers.Contract(
      environment.MATIC_DEPLOYED_ADDRESS_OTC,
      MikosavaABI.abi,
      signer
    );

    try {
      const tx = await otcContract['cancellOTCCPosition'](trade.tradeId);
      this.toastr.info('Approving is on the go');
      const receipt = await tx.wait();
      this.toastr.success(
        `The trade ${trade.tradeId} has been cancelled successfully!`
      );
      this.trades = from(this.loadMyTrades());
    } catch (error: any) {
      this.toastr.error(error.reason);
    }
  }

  public clickedTradeItem(trade: MikosavaTrade) {
    this.router.navigate(['/trade/' + trade.tradeId]);
  }

  public redirectToTrade() {
    this.router.navigate(['/swap']);
  }
}
