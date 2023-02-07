import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Nft, OwnedBaseNft } from 'alchemy-sdk';
import { cloneDeep, groupBy } from 'lodash';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { firstValueFrom, from, map, of } from 'rxjs';
import { AlchemyService } from '../../services/alchemy.service';
import Identicon from 'identicon.js';
import { ethers } from 'ethers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { truncateAddress } from 'src/app/utils/utils';
import * as NftActions from '../../../actions/nfts.actions';

export interface GroupedNft {
  [address: string]: MikosavaNft[];
}
export interface MikosavaNft extends Nft {
  identicon: string;
}
@Component({
  selector: 'app-list-nfts',
  templateUrl: './list-nfts.component.html',
  styleUrls: ['./list-nfts.component.scss'],
})
export class ListNftsComponent {
  public searchValue = '';
  public originalGroupErc721!: GroupedNft;
  public filteredGroupErc721!: GroupedNft;

  public truncate = truncateAddress;
  public iconNames = IconNamesEnum;
  public viewingModeNft: 'image' | 'details' = 'image';
  @Input() heightList: number = 200;
  @Input() allowToSelectNft: boolean = true;
  @Output() selectErc721 = new EventEmitter<MikosavaNft>();
  public selectTempNft!: MikosavaNft;
  public form!: FormGroup;
  public collectionAddress$ = this.store.select(
    (store) => store.nftCollectionsAdded
  );
  public dynamicGroupedNft: GroupedNft = {};

  constructor(
    private alchemyService: AlchemyService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store<State>
  ) {
    this.getNftsByWallet().subscribe((data) => {
      this.originalGroupErc721 = groupBy(data, 'contract.address');
      this.filteredGroupErc721 = { ...this.originalGroupErc721 };
      this.searchValue = '';
    });
    this.form = this.fb.group({
      selectionDisplay: ['wallet', []],
    });
  }

  public async searchChanged(event: string) {
    let originalCopy = cloneDeep(this.originalGroupErc721);
    if (event != '') {
      let isAddress = ethers.utils.isAddress(event);
      if (isAddress) {
        //Checkear si no existe ya
        const nftsResponse =
          await this.alchemyService.getAllNftsByCollectionADdress(event);
        this.store.dispatch(
          NftActions.addNewNftCollectionAddress({
            addresses: [event] as string[],
          })
        );
        this.dynamicGroupedNft[event] = this.mapIdenticon(
          nftsResponse.nfts as MikosavaNft[]
        );

        setTimeout(() => {
          this.form.get('selectionDisplay')?.patchValue(event);
          this.searchValue = '';
        }, 500);
      } else {
        const keysGroupedObject = Object.keys(originalCopy);
        keysGroupedObject.forEach((address) => {
          originalCopy[address] = (
            originalCopy[address] as Array<MikosavaNft>
          ).filter((entry) => {
            return (
              entry.title.toLowerCase().includes(event.toLowerCase()) ||
              entry.tokenId.toLowerCase().includes(event.toLowerCase()) ||
              entry.contract.address.toLowerCase().includes(event.toLowerCase())
            );
          });
        });
      }
    }
    this.filteredGroupErc721 = { ...originalCopy };
  }

  public selectNFTNonTMP(): void {
    this.selectErc721.emit(this.selectTempNft);
  }

  public selectNft(nft: MikosavaNft) {
    this.selectTempNft = nft;
  }

  public unSelect() {
    this.selectTempNft = null as any;
  }

  public changeType(mode: 'image' | 'details') {
    this.viewingModeNft = mode;
  }

  private getNftsByWallet() {
    return from(this.alchemyService.getAllNftsOwnedByCurrentUser()).pipe(
      map((entry) => this.mapIdenticon(entry.ownedNfts as any))
    );
  }

  private mapIdenticon(nfts: MikosavaNft[]) {
    return nfts.map((nft: MikosavaNft) => {
      nft.identicon = new Identicon(nft.tokenId + nft.contract.address, {
        size: 64,
        background: [255, 255, 255, 255],
        margin: 0.2,
      }).toString();
      return nft;
    });
  }
}
