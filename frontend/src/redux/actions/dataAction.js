import _ from 'lodash';
import axios from 'axios';
import Axios from '../../utils/axios';
import * as Types from '../actionTypes';
import { SUPPORTEDCOINS } from '../../utils/staticData';

const BINANCE_BASE_API = 'https://api.binance.com/api';

export const getBalance = () => async (dispatch) => {
  try {
    const res = await Axios.get(`/api/v1/wallets/getBalance`);
    const { balance } = res.data.data;
    delete balance._id;
    delete balance.__v;

    dispatch({
      type: Types.GET_BALANCES,
      payload: balance
    });
  } catch (err) {
    console.log(err);
  }
};

export const getPrices = () => async (dispatch) => {
  try {
    const QUOTE = 'USDT';
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

    dispatch({
      type: Types.FETCH_PRICES,
      payload: { ...prices, usdt: { symbol: 'usdt', price: 1 } }
    });
  } catch (err) {
    console.log(err);
  }
};
