import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
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
    //TMP disabled
    // if (environment.mainnet && network.testnet) {
    //   return false;
    // }
    return true;
  });
  public activeNetwork = null as any;
  public iconNames = IconNamesEnum;
  @Input() public innerComponent = false;

  constructor(
    private store: Store<State>,
    private modalService: BsModalService,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    if (!this.innerComponent) {
      this.providerService.getAccountStream().subscribe((account) => {
        this.activeNetwork = this.networksAvalaible.find(
          (network) => network.chainId == account.chainIdConnect
        );
        if (!this.activeNetwork) {
          let dialogRef = this.displayNotValidNetworkModal();
        } else {
          this.modalService.hide(1);
        }
      });
    }
  }

  public async selectNetwork(network: { chainId: number }) {
    await ProviderService.changeNetwork(network.chainId);
    if (!this.activeNetwork) {
      window.location.reload();
    }
  }

  private displayNotValidNetworkModal() {
    return this.modalService.show(NetworkModalComponent, {
      class: 'modal-dialog-centered network-modal',
      keyboard: false,
      backdrop: 'static',
      id: 1,
    });
  }
}
