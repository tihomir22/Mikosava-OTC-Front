import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { filter } from 'rxjs';
import { State } from 'src/app/reducers';
import { list } from 'src/app/utils/chains';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-network-displayer',
  templateUrl: './network-displayer.component.html',
  styleUrls: ['./network-displayer.component.scss'],
})
export class NetworkDisplayerComponent {
  public networksAvalaible = list;
  public activeNetwork = null as any;
  public iconNames = IconNamesEnum;


  constructor(private store: Store<State>) {
    this.store
      .select((action: State) => action.account)
      .pipe(filter((entry) => Object.values(entry).length > 0))
      .subscribe((data) => {
        this.activeNetwork = this.networksAvalaible.find(
          (network) => network.chainId == data.chainIdConnect
        );
      });
  }

  public async selectNetwork(network: { chainId: number }) {
    await ProviderService.changeNetwork(network.chainId);
  }
}
