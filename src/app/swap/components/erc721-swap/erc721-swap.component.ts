import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { firstValueFrom, Observable } from 'rxjs';
import { State } from 'src/app/reducers';
import {
  ListNftsComponent,
  MikosavaNft,
} from 'src/app/shared/components/list-nfts/list-nfts.component';
import * as NftActions from '../../../actions/nfts.actions';

@Component({
  selector: 'app-erc721-swap',
  templateUrl: './erc721-swap.component.html',
  styleUrls: ['./erc721-swap.component.scss'],
})
export class Erc721SwapComponent {
  public iconNames = IconNamesEnum;
  public NFTA: Observable<MikosavaNft> = this.store.select(
    (store) => store.selectNFTA
  );
  public NFTB: Observable<MikosavaNft> = this.store.select(
    (store) => store.selectNFTB
  );
  constructor(
    private modalService: BsModalService,
    private store: Store<State>
  ) {}

  public selectNftFromWallet(whichOne: 'A' | 'B') {
    let bsModalRef = this.modalService.show(ListNftsComponent, {
      class: 'modal-dialog-centered',
    });
    if (bsModalRef.content) {
      bsModalRef.content.heightList = 650;
      bsModalRef.content.selectErc721.subscribe((nft) => {
        this.store.dispatch(
          whichOne == 'A'
            ? NftActions.selectNftA({ selectANFT: nft })
            : NftActions.selectNftB({ selectBNFT: nft })
        );
        bsModalRef.hide();
      });
    }
  }

  public async viewNft(nftToViewParam: Observable<MikosavaNft>) {
    let bsModalRef = this.modalService.show(ListNftsComponent, {
      class: 'modal-dialog-centered',
    });
    const nftToView = await firstValueFrom(nftToViewParam);
    if (bsModalRef.content) {
      bsModalRef.content.heightList = 650;
      bsModalRef.content.allowToSelectNft = false;
      bsModalRef.content.selectTempNft = nftToView;
    }
  }
}
