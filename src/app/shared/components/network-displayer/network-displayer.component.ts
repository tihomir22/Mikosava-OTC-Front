import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { filter } from 'rxjs';
import { State } from 'src/app/reducers';
import { list } from 'src/app/utils/chains';
import { environment } from 'src/environments/environment';
import { ProviderService } from '../../services/provider.service';
import { NetworkModalComponent } from '../network-modal/network-modal.component';

@Component({
  selector: 'app-network-displayer',
  templateUrl: './network-displayer.component.html',
  styleUrls: ['./network-displayer.component.scss'],
})
export class NetworkDisplayerComponent {
  public networksAvalaible = list.filter((network) => {
    if (environment.mainnet && network.testnet) {
      return false;
    }
    return true;
  });
  public activeNetwork = null as any;
  public iconNames = IconNamesEnum;

  constructor(
    private store: Store<State>,
    private modalService: BsModalService
  ) {
    this.store
      .select((action: State) => action.account)
      .pipe(filter((entry) => Object.values(entry).length > 0))
      .subscribe((data) => {
        this.activeNetwork = this.networksAvalaible.find(
          (network) => network.chainId == data.chainIdConnect
        );
        if (!this.activeNetwork) {
          let bsModalRef = this.modalService.show(NetworkModalComponent, {
            class: 'modal-dialog-centered network-modal',
            keyboard: false,
            backdrop: 'static',
          });
        } else {
          this.modalService.hide();
        }
      });
  }

  public async selectNetwork(network: { chainId: number }) {
    await ProviderService.changeNetwork(network.chainId);
    if (!this.activeNetwork) {
      window.location.reload();
    }
  }
}
