export const list = [
  {
    chainId: 80001,
    name: 'Mumbai Testnet',
    testnet: true,
    asset: '/assets/icons/matic.png',
    platformName: 'polygon-pos',
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    //TETHER,POLYGON,WMATIC,WETH,USDC
    easyAccessCoins: [
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      '0x0000000000000000000000000000000000001010',
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
];

export const getNetwork = (networkId: number) => {
  return list.find((network) => network.chainId == networkId);
};

//TEST MUMBAI TESTNET COIN 0x111111111117dc0aa78b770fa6a738034120c302
