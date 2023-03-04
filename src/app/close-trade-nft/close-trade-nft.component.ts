import { Component } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { Account, State } from '../reducers';
import { MikosavaNFTTRade } from '../shared/models/MikosavaTrade';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import { environment } from 'src/environments/environment';
import { ethers } from 'ethers';
import { returnERC721InstanceFromAddress } from '../utils/tokens';
import { getStatus } from '../utils/utils';
import {
  ListNftsComponent,
  MikosavaNft,
} from '../shared/components/list-nfts/list-nfts.component';
import { AlchemyService } from '../shared/services/alchemy.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import * as NftActions from '../actions/nfts.actions';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-close-trade-nft',
  templateUrl: './close-trade-nft.component.html',
  styleUrls: ['./close-trade-nft.component.scss'],
})
export class CloseTradeNftComponent {
  public resolveData$!: Observable<Data>;
  public viewedTrade!: MikosavaNFTTRade;

  public getAccount = this.provider.getAccountStream();
  public getStatus = getStatus;
  public nftA!: Observable<MikosavaNft>;
  public nftB!: Observable<MikosavaNft>;
  public iconNames = IconNamesEnum;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private toastr: ToastrService,
    private router: Router,
    private provider: ProviderService,
    private alchemy: AlchemyService,
    private modalService: BsModalService,
    private utils: UtilsService
  ) {
    this.resolveData$ = this.route.data;

    this.nftA = this.resolveData$.pipe(
      switchMap(
        (entry: any) =>
          this.alchemy.getTokenMetadata(
            entry.idTradeNft.nftAddressA,
            entry.idTradeNft.nftIdA
          ) as any
      )
    ) as Observable<MikosavaNft>;
    this.nftB = this.resolveData$.pipe(
      switchMap(
        (entry: any) =>
          this.alchemy.getTokenMetadata(
            entry.idTradeNft.nftAddressB,
            entry.idTradeNft.nftIdB
          ) as any
      )
    ) as Observable<MikosavaNft>;
  }

  ngOnInit(): void {
    this.resolveData$.subscribe(
      (data: any) => (this.viewedTrade = data.idTradeNft)
    );
    this.setTradeNfts();
  }

  private async setTradeNfts() {
    const NFTA = await firstValueFrom(this.nftA);
    const NFTB = await firstValueFrom(this.nftB);
    this.store.dispatch(NftActions.selectNftA({ selectANFT: NFTA }));
    this.store.dispatch(NftActions.selectNftB({ selectBNFT: NFTB }));
  }

  public goBack() {
    this.router.navigate(['/list']);
  }

  public async exchange() {
    const [provider, signer, account, foundActiveNetwork] =
      await this.provider.getTools();
    try {
      const signer = await this.provider.getSigner();
      const otcContract = new ethers.Contract(
        foundActiveNetwork.contracts.OTC_PROXY,
        MikosavaABI.abi,
        signer
      );
      const nftBContract = returnERC721InstanceFromAddress(
        this.viewedTrade.nftAddressB,
        signer
      );
      const approval = await nftBContract['approve'](
        otcContract.address,
        this.viewedTrade.nftIdB,
        {
          from: (account as Account).address,
        }
      );
      this.toastr.info('Approving is on the go');
      await approval.wait();
      this.toastr.info('Exchange is on the go');
      let tx = await otcContract['closeOTCNPosition'](this.viewedTrade.tradeId);
      this.utils.displayTransactionDialog(tx.hash);
      await tx.wait();
      this.modalService.hide();
      this.toastr.success('The trade has been completed!');
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.modalService.hide();
    }
  }

  public async cancell() {
    try {
      const [provider, signer, account, foundActiveNetwork] =
        await this.provider.getTools();
      const otcContract = new ethers.Contract(
        foundActiveNetwork.contracts.OTC_PROXY,
        MikosavaABI.abi,
        signer
      );
      this.toastr.info('Cancel is on the go');
      let tx = await otcContract['cancellOTCNPosition'](
        this.viewedTrade.tradeId
      );
      this.utils.displayTransactionDialog(tx.hash);
      const receipt = await tx.wait();
      this.modalService.hide();
      this.toastr.success('The trade has been cancelled!');
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.toastr.error(error.reason);
      this.modalService.hide();
    }
  }

  public async viewNftDetails(nft: Observable<MikosavaNft>) {
    let bsModalRef = this.modalService.show(ListNftsComponent, {
      class: 'modal-dialog-centered',
    });
    const mikosavaNft = await firstValueFrom(nft);
    if (bsModalRef.content) {
      bsModalRef.content.heightList = 650;
      bsModalRef.content.allowToSelectNft = false;
      bsModalRef.content.selectTempNft = mikosavaNft as MikosavaNft;
      bsModalRef.content.unSelectNft.subscribe((data) =>
        this.modalService.hide()
      );
    }
  }
}
