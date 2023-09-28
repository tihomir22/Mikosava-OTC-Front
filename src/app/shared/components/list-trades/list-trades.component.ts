import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BigNumber, ethers } from 'ethers';
import { IdenticonOptions } from 'identicon.js';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  generateIdenticonB64,
  getStatus,
  isEmptyAddress,
} from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import MikosavaABI from '../../../../assets/MikosavaOTC.json';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../services/provider.service';
import {
  ListNftsComponent,
  MikosavaNft,
} from '../list-nfts/list-nfts.component';
import { UtilsService } from '../../services/utils.service';
import { Store } from '@ngrx/store';
import { Account, State } from 'src/app/reducers';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FilterDialogListTradesComponent,
  FiltersDialogListTrades,
} from './components/filter-dialog-list-trades/filter-dialog-list-trades.component';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { IdenticoinComponent } from '../identicoin/identicoin.component';
import { StatusDisplayerRendererComponent } from '../status-displayer-renderer/status-displayer-renderer.component';
import {
  PairDisplayerComponent,
  PairDisplayerRendererParams,
} from '../pair-displayer/pair-displayer.component';
import {
  IconDisplayerRendererComponent,
  IconDisplayerRendererParams,
} from '../icon-displayer-renderer/icon-displayer-renderer.component';
import { DatePipe } from '@angular/common';
import { ProgressBarRendererComponent } from '../progress-bar-renderer/progress-bar-renderer.component';
import {
  TableActionsComponent,
  TableActionsParams,
} from '../table-actions/table-actions.component';
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
  sortNo?: number;
  createdAt?: Date;
}

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.component.html',
  styleUrls: ['./list-trades.component.scss'],
})
export class ListTradesComponent {
  @Input() set trades(data: ListTradeItem[]) {
    if (data) {
      this._originalTrades = data;
      this.tradesFiltered = [...this._originalTrades];
    }
  }
  public get trades() {
    return this.tradesFiltered;
  }
  public tradesFiltered: ListTradeItem[] = [];
  public _originalTrades: ListTradeItem[] = [];
  @Input() tradesLoaded: boolean = false;
  @Input() form!: FormGroup;
  public iconNames = IconNamesEnum;
  public transformToIdenticoin = generateIdenticonB64;
  public isEmptyAddress = isEmptyAddress;
  public options: IdenticonOptions = {
    size: 32,
    background: [255, 255, 255, 255],
    margin: 0.2,
  };
  public rowClassRules = {
    'ag-row-even-mikosava': (params: any) => {
      return params.node.rowIndex % 2 === 0;
    },
    'ag-row-odd-mikosava': (params: any) => {
      return params.node.rowIndex % 2 !== 0;
    },
  };

  @Output() clickTradeItem = new EventEmitter<ListTradeItem>();
  @Output() cancelTradeItem = new EventEmitter<ListTradeItem>();
  @Output() shareTradeItem = new EventEmitter<ListTradeItem>();
  @Output() newTrade = new EventEmitter<void>();
  //collection - tokenId
  @Output() viewNftDetails = new EventEmitter<[string, string]>();
  @Output() tradeCancelledSuccessfully = new EventEmitter<ListTradeItem>();
  @Output() clickedFilter = new EventEmitter<void>();
  public filterApplied!: FiltersDialogListTrades;

  public account?: Account;
  public ENVIRONMENT = environment;

  public colDefs: ColDef[] = [
    {
      field: 'creator',
      cellRenderer: IdenticoinComponent,
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: 60,
    },
    {
      field: 'receiver',
      cellRenderer: IdenticoinComponent,
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: 60,
    },
    {
      cellRenderer: StatusDisplayerRendererComponent,
      resizable: true,
      sortable: false,
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
    },
    {
      cellRenderer: PairDisplayerComponent,
      flex: 2,
      headerName: 'Asset A',
      minWidth: 200,
      cellRendererParams: {
        onViewNftDetailsClick: (tokenAddress: string, amount: BigInt) => {
          this.viewNftDetails.emit([tokenAddress, amount as any]);
        },
        lookOutKeyAddress: 'aTokenAddress',
        lookOutKeyAmount: 'amountA',
      } as PairDisplayerRendererParams,
    },
    {
      cellRenderer: IconDisplayerRendererComponent,
      flex: 1,
      cellRendererParams: {
        icon: IconNamesEnum.ArrowLeftRight,
      } as IconDisplayerRendererParams,
    },
    {
      cellRenderer: PairDisplayerComponent,
      flex: 2,
      headerName: 'Asset B',
      minWidth: 200,
      cellRendererParams: {
        onViewNftDetailsClick: (tokenAddress: string, amount: BigInt) => {
          this.viewNftDetails.emit([tokenAddress, amount as any]);
        },
        lookOutKeyAddress: 'bTokenAddress',
        lookOutKeyAmount: 'amountB',
      } as PairDisplayerRendererParams,
    },
    {
      field: 'createdAt',
      resizable: true,
      flex: 1,
      sortable: true,
      minWidth: 120,
      valueFormatter: (params) => {
        if (this.isEmptyDate(params.data.createdAt)) {
          return 'Not known';
        } else {
          return (
            this.date
              .transform(params.data.createdAt, 'dd/MM/yyyy')
              ?.toString() ?? ''
          );
        }
      },
    },
    {
      headerName: 'Valid until',
      resizable: true,
      sortable: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: ProgressBarRendererComponent,
    },
    {
      flex: 1,
      minWidth: 220,
      cellRenderer: TableActionsComponent,
      cellRendererParams: {
        clickTradeItem: (trade) => {
          this.clickTradeItem.emit(trade);
        },
        cancelTradeItem: (trade) => {
          this.cancelTradeItem.emit(trade);
        },
        shareTradeItem: (trade) => {
          this.shareTradeItem.emit(trade);
        },
      } as TableActionsParams,
    },
  ];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private provider: ProviderService,
    private utils: UtilsService,
    private store: Store<State>,
    private fb: FormBuilder,
    private date: DatePipe
  ) {
    this.provider.getAccountStream().subscribe((data) => {
      this.account = data;
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.newTrade.subscribe(() => {
      this.router.navigate(['/swap']);
    });

    this.clickedFilter.subscribe((data) => {
      let sellerAddreses: Array<string> = [];
      let buyerAddresses: Array<string> = [];
      let possibleStatuses: Array<'Cancelled' | 'Sold' | 'Expired' | 'Open'> =
        [];
      let tokenAddresssForSell: Array<string> = [];
      let tokensAddressesForBuy: Array<string> = [];
      this.trades.forEach((erc20Trade) => {
        sellerAddreses.push(erc20Trade.creator);
        buyerAddresses.push(erc20Trade.receiver);
        possibleStatuses.push(getStatus(erc20Trade));
        tokenAddresssForSell.push(erc20Trade.aTokenAddress);
        tokensAddressesForBuy.push(erc20Trade.bTokenAddress);
      });

      let bsModalRef = this.modalService.show(FilterDialogListTradesComponent, {
        class: 'modal-dialog-centered',
      });
      if (bsModalRef.content) {
        bsModalRef.content.sellerAddresees = [...new Set(sellerAddreses)];
        bsModalRef.content.buyerAddresses = [...new Set(buyerAddresses)];
        bsModalRef.content.statuses = [...new Set(possibleStatuses)];
        bsModalRef.content.tokenAddressesSell = [
          ...new Set(tokenAddresssForSell),
        ];
        bsModalRef.content.tokenAddressesBuy = [
          ...new Set(tokensAddressesForBuy),
        ];
        bsModalRef.content.form.patchValue(this.filterApplied);
        bsModalRef.content.onApplyFilter.subscribe((data) => {
          this.modalService.hide();
          this.applyFilters(data);
          this.filterApplied = data;
        });
      }
    });

    this.clickTradeItem.subscribe((trade) => {
      if (this.form.get('activeType')?.value == 'erc20') {
        this.router.navigate(['/trade/' + trade.tradeId]);
      } else if (this.form.get('activeType')?.value == 'erc721') {
        this.router.navigate(['/nft-trade/' + trade.tradeId]);
      } else {
        console.error('No known type: ', this.form.get('activeType')?.value);
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
      // const alchemyResponse = await this.alchemy.getTokenMetadata(
      //   address,
      //   tokenId
      // );
      if (bsModalRef.content) {
        bsModalRef.content.heightList = 650;
        bsModalRef.content.allowToSelectNft = false;
        //bsModalRef.content.selectTempNft = alchemyResponse as MikosavaNft;
        bsModalRef.content.unSelectNft.subscribe(() =>
          this.modalService.hide()
        );
      }
    });

    this.cancelTradeItem.subscribe(async (trade) => {
      const [provider, signer, account, foundActiveNetwork] =
        await this.provider.getTools();
      const otcContract = new ethers.Contract(
        foundActiveNetwork.contracts.OTC_PROXY,
        MikosavaABI.abi,
        signer
      );

      try {
        let tx = null as any;
        if (this.form.get('activeType')?.value == 'erc20') {
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

  private applyFilters(filters: FiltersDialogListTrades) {
    this.tradesFiltered = this._originalTrades.filter((trade) => {
      let includeInList = true;
      if (filters.sellerAddress && includeInList) {
        includeInList =
          trade.creator.toLowerCase() == filters.sellerAddress.toLowerCase();
      }
      if (filters.buyingTokenAddress && includeInList) {
        includeInList =
          trade.bTokenAddress.toLowerCase() ==
          filters.buyingTokenAddress.toLowerCase();
      }
      if (filters.buyerAddress && includeInList) {
        includeInList =
          trade.receiver.toLowerCase() == filters.buyerAddress.toLowerCase();
      }
      if (filters.sellingTokenAddress && includeInList) {
        includeInList =
          trade.aTokenAddress.toLowerCase() ==
          filters.sellingTokenAddress.toLowerCase();
      }
      if (filters.status && includeInList) {
        includeInList = getStatus(trade) == filters.status;
      }
      return includeInList;
    });
  }

  public isEmptyDate(tradeCreatedDate: Date): boolean {
    return tradeCreatedDate.getFullYear() == 1970;
  }

  public rowDoubleClicked(row: { data: ListTradeItem }) {
    this.clickTradeItem.emit(row.data);
  }
}
