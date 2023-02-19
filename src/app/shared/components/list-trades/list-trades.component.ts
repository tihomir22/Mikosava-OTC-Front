import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BigNumber, ethers } from 'ethers';
import { IdenticonOptions } from 'identicon.js';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { generateIdenticonB64, isEmptyAddress } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { MikosavaTrade } from '../../models/MikosavaTrade';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import MikosavaABI from '../../../../assets/MikosavaOTC.json';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../services/provider.service';
import {
  ListNftsComponent,
  MikosavaNft,
} from '../list-nfts/list-nfts.component';
import { AlchemyService } from '../../services/alchemy.service';
import { UtilsService } from '../../services/utils.service';
export interface ListTradeItem {
  tradeId: BigInt;
  amountA: BigInt;
  aTokenAddress: string;
  amountB: BigInt;
  bTokenAddress: string;
  validUntil: BigInt;
  cancelled: boolean;
  sold: boolean;
  type: 'erc20' | 'erc721';
  creator: string;
  receiver: string;
}

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.component.html',
  styleUrls: ['./list-trades.component.scss'],
})
export class ListTradesComponent {
  @Input() trades: ListTradeItem[] = [];
  @Input() tradesLoaded: boolean = false;
  @Input() typeTrades: 'erc20' | 'erc721' = 'erc20';
  public iconNames = IconNamesEnum;
  public transformToIdenticoin = generateIdenticonB64;
  public isEmptyAddress = isEmptyAddress;
  public options: IdenticonOptions = {
    size: 32,
    background: [255, 255, 255, 255],
    margin: 0.2,
  };

  @Output() clickTradeItem = new EventEmitter<ListTradeItem>();
  @Output() cancelTradeItem = new EventEmitter<ListTradeItem>();
  @Output() shareTradeItem = new EventEmitter<ListTradeItem>();
  //collection - tokenId
  @Output() viewNftDetails = new EventEmitter<[string, string]>();
  @Output() tradeCancelledSuccessfully = new EventEmitter<ListTradeItem>();

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private provider: ProviderService,
    private alchemy: AlchemyService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.clickTradeItem.subscribe((trade) => {
      if (this.typeTrades == 'erc20') {
        this.router.navigate(['/trade/' + trade.tradeId]);
      } else if (this.typeTrades == 'erc721') {
        this.router.navigate(['/nft-trade/' + trade.tradeId]);
      } else {
        console.error('No known type: ', this.typeTrades);
      }
    });

    this.shareTradeItem.subscribe((trade) => {
      let bsModalRef = this.modalService.show(ShareModalComponent, {
        class: 'modal-dialog-centered',
      });
      bsModalRef.content!.trade = trade;
      bsModalRef.content!.url =
        window.location.origin +
        (trade.type == 'erc20' ? '/trade/' : '/nft-trade/') +
        trade.tradeId;
    });

    this.viewNftDetails.subscribe(async (param) => {
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
        bsModalRef.content.unSelectNft.subscribe(() =>
          this.modalService.hide()
        );
      }
    });

    this.cancelTradeItem.subscribe(async (trade) => {
      const [, signer, , ,] = await this.provider.getTools();

      const otcContract = new ethers.Contract(
        environment.MATIC_DEPLOYED_ADDRESS_OTC,
        MikosavaABI.abi,
        signer
      );

      try {
        let tx = null as any;
        if (this.typeTrades == 'erc20') {
          tx = await otcContract['cancellOTCCPosition'](trade.tradeId);
        } else {
          tx = await otcContract['cancellOTCNPosition'](trade.tradeId);
        }
        this.toastr.info('Approving is on the go');
        this.utils.displayTransactionDialog(tx.hash);
        const receipt = await tx.wait();
        this.modalService.hide();
        this.toastr.success(
          `The trade ${trade.tradeId} has been cancelled successfully!`
        );
        this.tradeCancelledSuccessfully.emit(trade);
      } catch (error: any) {
        this.toastr.error(error.reason);
        this.modalService.hide();
      }
    });
  }
}
