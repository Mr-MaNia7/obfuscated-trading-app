const axios = require('axios');
const _ = require('lodash');
const { SUPPORTEDCOINS } = require('../utils/staticData');

const BINANCE_BASE_API = 'https://api.binance.com/api';
const QUOTE = 'USDT';

exports.getPrices = async () => {
    try {      
      const cryptos = SUPPORTEDCOINS.filter((item) => item.label !== 'USDT').map((item) => item.label);
  
      const symbols = JSON.stringify(cryptos.map((item) => item + QUOTE));
      const res = await axios.get(`${BINANCE_BASE_API}/v3/ticker/price`, {
        params: {
          symbols
        }
      });
  
      let prices = res.data?.map((item) => ({
        symbol: String(item.symbol?.replace('USDT', '')).toLowerCase(),
        price: Number(item.price)
      }));
      prices = _.mapKeys(prices, 'symbol');
      const coinPrices = { ...prices, usdt: { symbol: 'usdt', price: 1 } };
      return coinPrices;
    } catch (err) {
      console.log(err);
    }
};

exports.getCoinPrice = async (coin) => {
  try {
    const symbol = `${coin}${QUOTE}`;
    const res = await axios.get(`${BINANCE_BASE_API}/v3/ticker/price`, {
      params: {
        symbol
      }
    });
    const coinPrice = res.data?.price;
    
    return Number(coinPrice);
  } catch (err) {
    console.log(err);
  }
}