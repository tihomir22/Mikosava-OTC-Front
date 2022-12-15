import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { copyClipboard } from 'src/app/utils/utils';
import { MikosavaTrade } from '../../models/MikosavaTrade';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
})
export class ShareModalComponent {
  @Input() trade: MikosavaTrade = null as any;
  @Input() url: string = '';

  constructor(private toastr: ToastrService) {}

  public copyAddressToClipboard() {
    copyClipboard(this.url);
    this.toastr.info('Copied to the clipboard!');
  }
}
