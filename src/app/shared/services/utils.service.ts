import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TxOngoingModalComponent } from '../components/tx-ongoing-modal/tx-ongoing-modal.component';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private bsModalReF: BsModalService,
    private provider: ProviderService
  ) {}

  public async displayTransactionDialog(txHash: string) {
    const [provider, signer, account, foundActiveNetwork] =
      await this.provider.getTools();

    let bsModalRef = this.bsModalReF.show(TxOngoingModalComponent, {
      class: 'modal-dialog-centered',
    });

    bsModalRef.content!.txHash = foundActiveNetwork.explorer + txHash;
    bsModalRef.content?.closeOnGoingTxModal.subscribe((data) =>
      this.bsModalReF.hide()
    );
  }
}
