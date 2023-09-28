import { environment } from 'src/environments/environment';

export enum ChainIds {
  MAINNET_POLYGON = 137,
  TESTNET_POLYGON = 80001,
  SMR_EVM_TESTNET = 1072,
  SMR_EVN_MAINNET = 148,
}

export const list = [
  {
    chainId: ChainIds.SMR_EVM_TESTNET,
    contracts: {
      OTC_PROXY: '0xb1F7F78393E8164a0bAfa174725aE78472124706',
      WRAP_ADDRESS: 'X',
    },
    name: 'Shimmer EVM Testnet',
    interal_name_id: 'shimmer-evm-testnet',
    testnet: true,
    asset: '/assets/icons/smr-testnet.png',
    explorer: 'https://explorer.evm.testnet.shimmer.network/tx/',
    nativeCurrency: {
      name: 'SMR',
      decimals: 18,
      symbol: 'DISABLED_SMR',
      address: '0x0000000000000000000000000000000000000000',
    },
    //SMR IOTA USDC
    easyAccessCoins: [
      '0x1074010000000000000000000000000000000000',
      '0xEA2f30e43Aa8f2E563F8079aF36F2e29d5DF25B9',
      '0x01ee95C34AeCAE1948aB618e467A6806b25fe7e4',
    ],
    rpcs: ['https://json-rpc.evm.testnet.shimmer.network'],
  },
  {
    chainId: ChainIds.SMR_EVN_MAINNET,
    contracts: {
      OTC_PROXY: '0xb1F7F78393E8164a0bAfa174725aE78472124706',
      WRAP_ADDRESS: 'X',
    },
    name: 'Shimmer EVM Mainnet',
    interal_name_id: 'shimmer-evm-mainnet',
    testnet: true,
    asset: '/assets/icons/smr.png',
    explorer: 'https://explorer.evm.shimmer.network/tx/',
    nativeCurrency: {
      name: 'SMR',
      decimals: 18,
      symbol: 'DISABLED_SMR',
      address: '0x0000000000000000000000000000000000000000',
    },
    //SMR APEIN WSMR
    easyAccessCoins: [
      '0x1074010000000000000000000000000000000000',
      '0x264F2e6142CE8bEA68e5C646f8C07db98A9E003A',
      '0x6C890075406C5DF08b427609E3A2eAD1851AD68D',
    ],
    rpcs: ['https://json-rpc.evm.shimmer.network'],
  },
  // {
  //   chainId: ChainIds.TESTNET_POLYGON,
  //   contracts: {
  //     OTC_PROXY: '0x81b47E8520f9E7431D6135fa6Bb60F2a4E221Fdc',
  //     WRAP_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  //   },
  //   name: 'Mumbai Testnet',
  //   interal_name_id: 'polygon-mumbai',
  //   testnet: true,
  //   asset: '/assets/icons/matic.png',
  //   explorer: 'https://mumbai.polygonscan.com/tx/',
  //   nativeCurrency: {
  //     name: 'MATIC',
  //     decimals: 18,
  //     symbol: 'MATIC',
  //     address: '0x0000000000000000000000000000000000001010',
  //   },
  //   //USDC WMATIC
  //   easyAccessCoins: [
  //     '0x992d00C09E1162Bda6D556A15d83e5050d300908',
  //     '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  //   ],
  //   rpcs: [
  //     'https://polygon-testnet.public.blastapi.io',
  //     'https://matic-testnet-archive-rpc.bwarelabs.com',
  //     'https://matic-mumbai.chainstacklabs.com',
  //   ],
  // },
  // {
  //   chainId: ChainIds.MAINNET_POLYGON,
  //   contracts: {
  //     OTC_PROXY: '0xbeb8eEd57BaE1a1C6CDf060393d831b77A317408',
  //     WRAP_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  //   },
  //   name: 'Polygon Mainnet',
  //   interal_name_id: 'polygon-mainnet',
  //   testnet: false,
  //   asset: '/assets/icons/matic.png',
  //   explorer: 'https://polygonscan.com/tx/',
  //   nativeCurrency: {
  //     name: 'MATIC',
  //     decimals: 18,
  //     symbol: 'MATIC',
  //     address: '0x0000000000000000000000000000000000001010',
  //   },
  //   //TETHER,POLYGON,WMATIC,WETH,USDC
  //   easyAccessCoins: [
  //     '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  //     // '0x0000000000000000000000000000000000001010',
  //     '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  //     '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  //     '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  //   ],
  //   rpcs: [
  //     'https://polygon.llamarpc.com',
  //     'https://rpc-mainnet.matic.quiknode.pro',
  //     'hhttps://matic-mainnet-archive-rpc.bwarelabs.com',
  //   ],
  // },
];

export const getNetwork = (networkId: number) => {
  return list.find((network) => network.chainId == networkId);
};

export const getFeeForInternalPlatformId = (internalPlatformId: string) => {
  let found = list.find((entry) => entry.interal_name_id == internalPlatformId);
  if (found) {
    //Matic
    if (
      found.interal_name_id == 'polygon-mumbai' ||
      found.interal_name_id == 'polygon-mainnet'
    ) {
      return environment.MATIC_FEE;
      //SMR
    } else if (
      found.interal_name_id == 'shimmer-evm-testnet' ||
      found.interal_name_id == 'shimmer-evm-mainnet'
    ) {
      return environment.SMR_FEE;
    }
  }
  return -1;
};

//TEST MUMBAI TESTNET COIN 0x111111111117dc0aa78b770fa6a738034120c302
