import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
// material
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack, Skeleton } from '@mui/material';
// utils
import { fNumberWithDecimal, fCurrency } from '../../utils/formatNumber';
import { SUPPORTED_COINS } from '../../utils/staticData';
// -----

// ----------------------------------------------------------------------

const RowStyle = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  transition: '0.3s',
  '&:hover': {
    background: '#95f7b2',
    color: 'black'
  },
  marginTop: '10px!important',
  paddingLeft: '10px!important',
  paddingRight: '10px!important',
  borderRadius: '5px'
});

const ImgStyle = styled('img')(() => ({
  width: 24,
  height: 24,
  marginRight: 10
}));

// ----------------------------------------------------------------------

export default function CurrentBalance() {
  const { prices, balance } = useSelector((state) => state);

  const myBalance = useMemo(() => {
    const data = Object.keys(balance).map((item) => ({
      asset: balance[item],
      usdValue: balance[item] * prices[item]?.price,
      symbol: item
    }));
    return _.orderBy(data, ['usdValue', 'symbol'], ['desc', 'asc']);
  }, [prices, balance]);

  const loading = _.isEmpty(balance) || _.isEmpty(prices);

  return (
    <Card sx={{ p: 3, backgroundColor: 'primary.lighter', color: 'primary.darker', minHeight: 688 }}>
      {loading ? (
        <Skeleton variant="text" animation="wave" sx={{ bgcolor: '#92919152' }} />
      ) : (
        <Stack spacing={1}>
          {myBalance.map((item) => (
            <RowStyle key={item.symbol}>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyle alt={item.symbol} src={SUPPORTED_COINS[item.symbol]?.icon} />
                {SUPPORTED_COINS[item.symbol]?.name}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography component="span" sx={{ height: '1rem' }}>
                  {fNumberWithDecimal(item.asset)} {SUPPORTED_COINS[item.symbol]?.label}
                </Typography>
                <Typography component="span" sx={{ height: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                  {fCurrency(item.usdValue)} USD
                </Typography>
              </Typography>
            </RowStyle>
          ))}
        </Stack>
      )}
    </Card>
  );
}
