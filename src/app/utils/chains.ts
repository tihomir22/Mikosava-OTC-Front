import { environment } from 'src/environments/environment';

export enum ChainIds {
  MAINNET_POLYGON = 137,
  TESTNET_POLYGON = 80001,
}

export const list = [
  {
    chainId: ChainIds.TESTNET_POLYGON,
    name: 'Mumbai Testnet',
    interal_name_id: 'matic-testnet',
    testnet: true,
    asset: '/assets/icons/matic.png',
    platformName: 'polygon-pos',
    nativeCurrency: {
      name: 'MATIC',
      decimals: 18,
      symbol: 'MATIC',
      address: '0x0000000000000000000000000000000000001010',
    },
    //TETHER,POLYGON,WMATIC,WETH,USDC
    easyAccessCoins: [
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      // '0x0000000000000000000000000000000000001010',
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    ],
    rpcs: [
      'https://polygon-testnet.public.blastapi.io',
      'https://matic-testnet-archive-rpc.bwarelabs.com',
      'https://matic-mumbai.chainstacklabs.com',
    ],
  },
  {
    chainId: ChainIds.MAINNET_POLYGON,
    name: 'Polygon Mainnet',
    interal_name_id: 'matic-mainnet',
    testnet: false,
    asset: '/assets/icons/matic.png',
    platformName: 'polygon-pos',
    nativeCurrency: {
      name: 'MATIC',
      decimals: 18,
      symbol: 'MATIC',
      address: '0x0000000000000000000000000000000000001010',
    },
    //TETHER,POLYGON,WMATIC,WETH,USDC
    easyAccessCoins: [
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      // '0x0000000000000000000000000000000000001010',
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    ],
    rpcs: [
      'https://polygon.llamarpc.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'hhttps://matic-mainnet-archive-rpc.bwarelabs.com',
    ],
  },
];

export const getNetwork = (networkId: number) => {
  return list.find((network) => network.chainId == networkId);
};

export const getFeeForInternalPlatformId = (internalPlatformId: string) => {
  let found = list.find((entry) => entry.interal_name_id == internalPlatformId);
  if (found) {
    //Matic
    if (
      found.interal_name_id == 'matic-testnet' ||
      found.interal_name_id == 'matic-mainnet'
    ) {
      return environment.MATIC_FEE;
    }
  }
  return -1;
};

//TEST MUMBAI TESTNET COIN 0x111111111117dc0aa78b770fa6a738034120c302
