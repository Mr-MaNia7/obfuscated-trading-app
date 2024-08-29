import _ from 'lodash';

export const MARKET_COINS = [
  { symbol: 'BTC', icon: '/static/cryptos/btc.svg', name: 'Bitcoin' },
  { symbol: 'ETH', icon: '/static/cryptos/eth.svg', name: 'Ethereum' },
  { symbol: 'BNB', icon: '/static/cryptos/bnb.svg', name: 'BNB' },
  { symbol: 'SOL', icon: '/static/cryptos/sol.svg', name: 'Solana' },
  // { symbol: 'USDC', icon: '/static/cryptos/usdc.svg', name: 'USD Coin' },
  // { symbol: 'BUSD', icon: '/static/cryptos/busd.svg', name: 'Binance USD' },
  { symbol: 'APT', icon: '/static/cryptos/apt.svg', name: 'Aptos' },
  { symbol: 'ALGO', icon: '/static/cryptos/algo.svg', name: 'Algorand' },
  { symbol: 'ADA', icon: '/static/cryptos/ada.svg', name: 'Cardano' },
  { symbol: 'MATIC', icon: '/static/cryptos/matic.svg', name: 'Polygon' },
  { symbol: 'SHIB', icon: '/static/cryptos/shib.svg', name: 'Shiba Inu' },
  { symbol: 'AVAX', icon: '/static/cryptos/avax.svg', name: 'Avalanche' },
  { symbol: 'NEAR', icon: '/static/cryptos/near.svg', name: 'NEAR Protocol' },
  { symbol: 'TRX', icon: '/static/cryptos/trx.svg', name: 'Tron' },
  { symbol: 'UNI', icon: '/static/cryptos/uni.svg', name: 'Uniswap' },
  { symbol: 'CAKE', icon: '/static/cryptos/cake.svg', name: 'PancakeSwap' },
  { symbol: 'LUNC', icon: '/static/cryptos/lunc.svg', name: 'Terra Classic' }
];

export const SUPPORTEDCOINS = [
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

export const SUPPORTED_COINS = _.mapKeys(SUPPORTEDCOINS, 'symbol');

export const SUPPORTED_NETWORKS = {
  btc: [{ network: 'BTC', label: 'Bitcoin network', value: 'btc' }],
  eth: [
    { network: 'ERC20', label: 'Ethereum network', value: 'eth' },
    { network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }
  ],
  bnb: [{ network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }],
  sol: [{ network: 'SOL', label: 'Solana network', value: 'sol' }],
  usdt: [
    { network: 'TRC20', label: 'Tron network', value: 'trx' },
    { network: 'ERC20', label: 'Ethereum network', value: 'eth' },
    { network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' },
    { network: 'SOL', label: 'Solana network', value: 'sol' }
    // { network: 'Polygon', label: 'Polygon network', value: 'matic' }
  ],
  usdc: [
    { network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' },
    { network: 'ERC20', label: 'Ethereum network', value: 'eth' },
    { network: 'SOL', label: 'Solana network', value: 'sol' }
    // { network: 'Polygon', label: 'Polygon network', value: 'matic' },
    // { network: 'AVAX', label: 'Avalanche network', value: 'avax' }
  ],
  trx: [{ network: 'TRC20', label: 'Tron network', value: 'trx' }],
  busd: [
    { network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' },
    { network: 'ERC20', label: 'Ethereum network', value: 'eth' }
  ],
  algo: [{ network: 'ALGO', label: 'Algorand network', value: 'algo' }],
  ada: [{ network: 'ADA', label: 'Cardano network', value: 'ada' }],
  matic: [{ network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }],
  shib: [
    { network: 'ERC20', label: 'Ethereum network', value: 'eth' },
    { network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }
  ],
  avax: [{ network: 'AVAX', label: 'BNB Smart Chain network', value: 'bnb' }],
  near: [{ network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }],
  uni: [{ network: 'ERC20', label: 'Ethereum network', value: 'eth' }],
  cake: [{ network: 'BEP20', label: 'BNB Smart Chain network', value: 'bnb' }]
};

export const tierLevels = [
  { label: 'Basic', icon: '/static/tiers/basic.svg', value: 'eth' },
  { label: 'Bronze', icon: '/static/tiers/bronze.svg', value: 'eth' },
  { label: 'Silver', icon: '/static/tiers/silver.svg', value: 'eth' },
  { label: 'Gold', icon: '/static/tiers/gold.svg', value: 'eth' },
  { label: 'Platinum', icon: '/static/tiers/platinum.svg', value: 'eth' },
  { label: 'Diamond', icon: '/static/tiers/diamond.svg', value: 'eth' }
];

export const TRX_FEE = [2, 1, 0.5, 0.5, 0.2, 0.1];
