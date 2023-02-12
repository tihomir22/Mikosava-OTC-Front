import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { copyClipboard } from 'src/app/utils/utils';
import { ListTradeItem } from '../list-trades/list-trades.component';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
})
export class ShareModalComponent {
  @Input() set trade(data: ListTradeItem) {
    if (data) {
      this.url = window.location.origin + '/trade/' + data.tradeId;
      this._trade = data;
    }
  }
  @Input() showQR: boolean = true;
  @Input() showClipboard: boolean = true;
  @Input() widthQr: number = 256;
  public _trade?: ListTradeItem;
  public url: string = '';

  constructor(private toastr: ToastrService) {}

  public copyAddressToClipboard() {
    copyClipboard(this.url);
    this.toastr.info('Copied to the clipboard!');
  }
}
