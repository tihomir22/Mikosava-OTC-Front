import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tx-ongoing-modal',
  templateUrl: './tx-ongoing-modal.component.html',
  styleUrls: ['./tx-ongoing-modal.component.scss'],
})
export class TxOngoingModalComponent {
  @Input() txHash: string = '';
  @Output() closeOnGoingTxModal = new EventEmitter<void>();
}
