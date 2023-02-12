import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BigNumber, ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { State } from '../reducers';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import {
  MikosavaNFTTRade,
  MikosavaTrade,
} from '../shared/models/MikosavaTrade';
import { CoinsService } from '../shared/services/coins.service';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShareModalComponent } from '../shared/components/share-modal/share-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ListTradeItem } from '../shared/components/list-trades/list-trades.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ListNftsComponent,
  MikosavaNft,
} from '../shared/components/list-nfts/list-nfts.component';
import { firstValueFrom } from 'rxjs';
import { AlchemyService } from '../shared/services/alchemy.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class UserListComponent {
  public trades: Array<MikosavaTrade> = [];
  public nftTrades: Array<MikosavaNFTTRade> = [];
  public iconNames = IconNamesEnum;
  public tradesLoaded = false;
  public form!: FormGroup;

  constructor(
    private store: Store<State>,
    private coins: CoinsService,
    private provider: ProviderService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private alchemy: AlchemyService
  ) {
    this.form = this.fb.group({
      activeType: ['erc20', []],
    });
  }

  ngOnInit(): void {
    this.provider.getAccountStream().subscribe((data) => {
      this.tradesLoaded = false;
      this.loadMyTrades();
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
    this.trades = (await otcContract['fetchMyCoinTrades']()).map(
      (entry: MikosavaTrade) => {
        let clonedTrade = { ...entry };
        (clonedTrade as any)['sortTradeId'] = Number(entry.tradeId);
        return clonedTrade;
      }
    );
    this.nftTrades = (await otcContract['fetchMyNftTrades']()).map(
      (entry: MikosavaNFTTRade) => {
        let clonedTrade = { ...entry };
        (clonedTrade as any)['sortTradeId'] = Number(entry.tradeId);
        return clonedTrade;
      }
    );
    this.tradesLoaded = true;
  }

  public openShareModal(trade: ListTradeItem) {
    let bsModalRef = this.modalService.show(ShareModalComponent, {
      class: 'modal-dialog-centered',
    });
    bsModalRef.content!.trade = trade;
    bsModalRef.content!.url =
      window.location.origin +
      (trade.type == 'erc20' ? '/trade/' : '/nft-trade/') +
      trade.tradeId;
  }

  public async cancelTrade(trade: ListTradeItem) {
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
      this.loadMyTrades();
    } catch (error: any) {
      this.toastr.error(error.reason);
    }
  }

  public clickedTradeItem(trade: ListTradeItem) {
    this.router.navigate(['/trade/' + trade.tradeId]);
  }

  public redirectToTrade() {
    this.router.navigate(['/swap']);
  }

  public clickedNftTradeItem(trade: ListTradeItem) {
    this.router.navigate(['/nft-trade/' + trade.tradeId]);
  }

  public async viewNftDetails(param: [string, string]) {
    const [address, tokenId] = param;
    let bsModalRef = this.modalService.show(ListNftsComponent, {
      class: 'modal-dialog-centered',
    });
    const alchemyResponse = await this.alchemy.getTokenMetadata(
      address,
      tokenId
    );
    if (bsModalRef.content) {
      bsModalRef.content.heightList = 650;
      bsModalRef.content.allowToSelectNft = false;
      bsModalRef.content.selectTempNft = alchemyResponse as MikosavaNft;
      bsModalRef.content.unSelectNft.subscribe((data) =>
        this.modalService.hide()
      );
    }
  }
}
