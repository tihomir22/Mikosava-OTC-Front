import { createAction, props } from '@ngrx/store';
import { MikosavaNft } from '../shared/components/list-nfts/list-nfts.component';

export const selectNftA = createAction(
  '[NFTs] Set NFT A',
  props<{ selectANFT: MikosavaNft }>()
);

export const selectNftB = createAction(
  '[NFTs] Set NFT B',
  props<{ selectBNFT: MikosavaNft }>()
);

export const addNewNftCollectionAddress = createAction(
  '[NFTs] Add new collection address',
  props<{ addresses: string[] }>()
);
