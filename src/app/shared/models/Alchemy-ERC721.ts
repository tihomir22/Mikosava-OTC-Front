export interface Contract {
  address: string;
}

export interface TokenMetadata {
  tokenType: string;
}

export interface Id {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

export interface TokenUri {
  raw: string;
  gateway: string;
}

export interface Medium {
  raw: string;
  gateway: string;
}

export interface Attribute {
  value: string;
  trait_type: string;
}

export interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Attribute[];
}

export interface OwnedNft {
  contract: Contract;
  id: Id;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Medium[];
  metadata: Metadata;
  rawMetadata: Metadata;
  timeLastUpdated: Date;
}

export interface AlchemyERC721 {
  ownedNfts: OwnedNft[];
  totalCount: number;
  blockHash: string;
}
