
const ETH = '0x291273C71D08981d68BF601e2CE1b104CBF29Cf1';
const BNB = '0x38118142Ba0869919fCfbD4B07011f0Ae9ABb6ca';
const TRX = 'TWe6yTsucCq5GesZLLSCRHNjDUJD6WzQZe';
const SOL = '9yQcU5daLCJMf9RiwKH5Znzuhbzy8SUquVxkS1dVZ61';

const BTC = '1PGNNhmBiKikeqS23RHfctd4YWfkoagSDc';
const ADA = 'addr1q987ecxr33x0jqwcdqkzwg0pmg9udhs5gweygwp87q36l460ansv8rzvlyqas6pvyus7rkstcm0pgsajgsuz0upr4lts97gmt5';
const ALGO = 'WC7MAHK545NCPA7QPVJBTMLVLQU4Z6DOOVOX5PBM6PKIVJ4LH6SWWYR7XM';

exports.DEPOSIT_ADDRESSES = {
  eth: ETH,
  bnb: BNB,
  trx: TRX,
  sol: SOL,
  btc: BTC,
  ada: ADA,
  algo: ALGO
};

exports.SUPPORTEDCOINS = [
  { symbol: 'btc', label: 'BTC', icon: '/static/cryptos/btc.svg', name: 'Bitcoin' },
  { symbol: 'eth', label: 'ETH', icon: '/static/cryptos/eth.svg', name: 'Ethereum' },
  { symbol: 'bnb', label: 'BNB', icon: '/static/cryptos/bnb.svg', name: 'Binance Coin' },
  { symbol: 'sol', label: 'SOL', icon: '/static/cryptos/sol.svg', name: 'Solana' },
  { symbol: 'usdt', label: 'USDT', icon: '/static/cryptos/usdt.svg', name: 'USD Tether' },
  { symbol: 'usdc', label: 'USDC', icon: '/static/cryptos/usdc.svg', name: 'USD Coin' },
  { symbol: 'busd', label: 'BUSD', icon: '/static/cryptos/busd.svg', name: 'Binance USD' },
  { symbol: 'algo', label: 'ALGO', icon: '/static/cryptos/algo.svg', name: 'Algorand' },
  { symbol: 'ada', label: 'ADA', icon: '/static/cryptos/ada.svg', name: 'Cardano' },
  { symbol: 'matic', label: 'MATIC', icon: '/static/cryptos/matic.svg', name: 'Polygon' },
  { symbol: 'shib', label: 'SHIB', icon: '/static/cryptos/shib.svg', name: 'Shiba Inu' },
  { symbol: 'avax', label: 'AVAX', icon: '/static/cryptos/avax.svg', name: 'Avalanche' },
  { symbol: 'near', label: 'NEAR', icon: '/static/cryptos/near.svg', name: 'NEAR Protocol' },
  { symbol: 'trx', label: 'TRX', icon: '/static/cryptos/trx.svg', name: 'Tron' },
  { symbol: 'uni', label: 'UNI', icon: '/static/cryptos/uni.svg', name: 'Uniswap' },
  { symbol: 'cake', label: 'CAKE', icon: '/static/cryptos/cake.svg', name: 'PancakeSwap' }
];

exports.userTiers = [
  { tier: 0, required: 0, transferLimit: 0 },
  { tier: 1, required: 200, transferLimit: 1000 },
  { tier: 2, required: 500, transferLimit: 5000 },
  { tier: 3, required: 1000, transferLimit: 20000 },
  { tier: 4, required: 2000, transferLimit: 100000 },
  { tier: 5, required: 10000, transferLimit: 1000000 },
];
