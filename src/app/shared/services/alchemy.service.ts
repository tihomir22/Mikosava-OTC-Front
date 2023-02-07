import { Injectable } from '@angular/core';
import {
  Network,
  Alchemy,
  OwnedBaseNftsResponse,
  NftContractNftsResponse,
} from 'alchemy-sdk';
import { getNetwork } from 'src/app/utils/chains';
import { environment } from 'src/environments/environment';
import { AlchemyERC721 } from '../models/Alchemy-ERC721';
import { ProviderService } from './provider.service';
@Injectable({
  providedIn: 'root',
})
export class AlchemyService {
  private settings = {
    apiKey: environment.ALCHEMY_API,
    network: '' as any,
  };
  private alchemyInstance!: Alchemy;
  constructor(private provider: ProviderService) {
    this.init();
  }

  private async init() {
    const [provider, , account, foundActiveNetwork] =
      await this.provider.getTools();
    this.settings.network = foundActiveNetwork.interal_name_id;
    this.alchemyInstance = new Alchemy(this.settings);
    const latestBlock = await this.alchemyInstance.core.getBlockNumber();
    console.log('The latest block number is', latestBlock);
  }

  public async getAllNftsOwnedByCurrentUser(): Promise<AlchemyERC721> {
    const [provider, , account, foundActiveNetwork] =
      await this.provider.getTools();
    const nfts = await this.alchemyInstance.nft.getNftsForOwner(
      account.address
    );
    return nfts as any;
  }

  public async getAllNftsByCollectionADdress(
    collectionAddress: string
  ): Promise<NftContractNftsResponse> {
    const nfts = await this.alchemyInstance.nft.getNftsForContract(
      collectionAddress
    );
    return nfts;
  }

  public switchNetwork(newNetworkChainId: number) {
    const foundActiveNetwork = getNetwork(newNetworkChainId);
    this.settings.network = foundActiveNetwork?.interal_name_id;
    this.alchemyInstance = new Alchemy(this.settings);
  }
}
