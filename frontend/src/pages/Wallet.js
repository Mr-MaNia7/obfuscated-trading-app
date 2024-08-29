import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Icon } from '@iconify/react';
import _ from 'lodash';
import ReactECharts from 'echarts-for-react';
// material
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
  Skeleton
} from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import InternalWallet from '../components/wallets';
// utils
import { fNumber, fNumberWithDecimal, fPercent } from '../utils/formatNumber';
import { MARKET_COINS } from '../utils/staticData';

// ----------------------------------------------------------------------
const QUOTE = 'USDT';

const BINANCE_BASE_API = 'https://api.binance.com/api';
const KLINE_ENDPOINT = `${BINANCE_BASE_API}/v3/klines`;
const TICKER_24HR = `${BINANCE_BASE_API}/v3/ticker/24hr`;

const KLINE_INTERVAL = '30m';
const KLINE_INTERVAL_WEEK = '1h';

const GREEN = '#23C865';
const RED = '#F6361A';

const REFRESH_TIME = 30 * 1000;

const ImgStyle = styled('img')(() => ({
  width: 40,
  height: 40
}));

const CryptoRow = ({ crypto }) => {
  const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
    chart: [],
    chart7d: [],
    percent: '',
    price: '',
    quoteVolume: '',
    volume: ''
  });

  const { chart, chart7d, percent, price, volume, quoteVolume } = state;

  const fetchTickerFromBinance24hr = async (tokenSymbol) => {
    const res = await axios.get(TICKER_24HR, { params: { symbol: tokenSymbol + QUOTE } });
    const price = Number(res.data.lastPrice);
    const percent = Number(res.data.priceChangePercent);
    const volume = Number(res.data.volume);
    const quoteVolume = Number(res.data.quoteVolume);
    return { price, percent, volume, quoteVolume };
  };

  useEffect(() => {
    const getChartData = async () => {
      if (!crypto.symbol) return;
      const res = await axios.get(KLINE_ENDPOINT, {
        params: {
          symbol: crypto.symbol + QUOTE,
          interval: KLINE_INTERVAL,
          startTime: new Date().getTime() - 24 * 3600 * 1000
        }
      });
      const chartData = res.data.map((c) => c[4]);

      setState({
        chart: chartData
      });
    };

    const getChartData7d = async () => {
      if (!crypto.symbol) return;
      const res = await axios.get(KLINE_ENDPOINT, {
        params: {
          symbol: crypto.symbol + QUOTE,
          interval: KLINE_INTERVAL_WEEK,
          startTime: new Date().getTime() - 7 * 24 * 3600 * 1000
        }
      });
      const chartData = res.data.map((c) => c[4]);

      setState({
        chart7d: chartData
      });
    };

    const getTicker24hr = async () => {
      if (!crypto.symbol) return;
      const fetchData = await fetchTickerFromBinance24hr(crypto.symbol);

      const { price, percent, volume, quoteVolume } = fetchData;
      setState({
        price,
        percent,
        volume,
        quoteVolume
      });
    };

    getTicker24hr();
    getChartData();
    getChartData7d();

    const intervalCrypto = setInterval(() => {
      getTicker24hr();
      getChartData();
      getChartData7d();
    }, REFRESH_TIME);

    return () => clearInterval(intervalCrypto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TableRow sx={{ height: 90 }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
          <ImgStyle alt="crypto" src={crypto.icon} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2"> {crypto.symbol}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {crypto.name}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="right">${price ? fNumberWithDecimal(Math.round(price * 1e8) / 1e8) : ''}</TableCell>
      <TableCell sx={{ color: percent >= 0 ? 'primary.main' : 'error.main' }} align="right" gap={0.5}>
        {percent >= 0 ? <Icon icon="ant-design:caret-up-filled" /> : <Icon icon="ant-design:caret-down-filled" />}{' '}
        {fPercent(percent)}
      </TableCell>
      <TableCell align="right">
        <Box>
          <Typography variant="subtitle2"> ${fNumber(quoteVolume)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fNumber(volume)} {crypto.symbol}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {_.isEmpty(chart) ? (
          <Skeleton variant="text" animation="wave" sx={{ bgcolor: '#d3d3d353' }} />
        ) : (
          <ReactECharts
            option={{
              color: percent >= 0 ? GREEN : RED,
              backgroundColor: 'transparent',
              xAxis: {
                type: 'category',
                show: false
              },
              yAxis: {
                type: 'value',
                show: false,
                min: Math.min(chart),
                max: Math.max(chart)
              },
              series: [
                {
                  data: chart,
                  type: 'line',
                  smooth: true,
                  showSymbol: false
                }
              ],
              grid: {
                show: false,
                top: '10%',
                bottom: '10%',
                left: '0',
                right: '0'
              }
            }}
            style={{ height: 60, width: 170, margin: 'auto !important', float: 'right' }}
            className="echarts-for-echarts"
          />
        )}
      </TableCell>
      <TableCell>
        {_.isEmpty(chart7d) ? (
          <Skeleton variant="text" animation="wave" sx={{ bgcolor: '#d3d3d353' }} />
        ) : (
          <ReactECharts
            option={{
              color: chart7d[chart7d.length - 1] >= chart7d[0] ? GREEN : RED,
              backgroundColor: 'transparent',
              xAxis: {
                type: 'category',
                show: false
              },
              yAxis: {
                type: 'value',
                show: false,
                min: Math.min(chart7d),
                max: Math.max(chart7d)
              },
              series: [
                {
                  data: chart7d,
                  type: 'line',
                  smooth: true,
                  showSymbol: false
                }
              ],
              grid: {
                show: false,
                top: '10%',
                bottom: '10%',
                left: '0',
                right: '0'
              }
            }}
            style={{ height: 60, width: 170, margin: 'auto !important', float: 'right' }}
            className="echarts-for-echarts"
          />
        )}
      </TableCell>
    </TableRow>
  );
};

CryptoRow.propTypes = {
  crypto: PropTypes.object
};

export default function PageOne() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Wallet | CryptoEver">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h3">Wallet</Typography>
        <InternalWallet />
        <Card sx={{ pb: 3, mt: 3 }}>
          <CardHeader title="Market" sx={{ mb: 3 }} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">24h %</TableCell>
                    <TableCell align="right">Volume (24h)</TableCell>
                    <TableCell align="right">Price Chart (24h)</TableCell>
                    <TableCell align="right">Last 7 Days</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MARKET_COINS.map((row) => (
                    <CryptoRow crypto={row} key={row.name} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
