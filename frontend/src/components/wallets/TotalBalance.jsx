import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import _ from 'lodash';
// material
import { Button, Card, Typography, Stack, Link } from '@mui/material';
// utils
import { fCurrency, fNumberWithDecimal } from '../../utils/formatNumber';
//--------
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function EcommerceCurrentBalance() {
  const { prices, balance } = useSelector((state) => state);

  const totalBalance = useMemo(() => {
    const data = Object.keys(balance).map((item) => ({
      usdValue: balance[item] * prices[item]?.price,
      symbol: item
    }));
    return _.sumBy(data, 'usdValue');
  }, [prices, balance]);

  return (
    <Card sx={{ p: 3, backgroundColor: 'primary.lighter', color: 'primary.darker', mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Total Balance
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h3">{fCurrency(totalBalance)} USD</Typography>
        <Typography>~ {fNumberWithDecimal(totalBalance / prices.btc?.price)} BTC</Typography>

        <Stack direction="row" spacing={1.5}>
          <Link underline="none" component={RouterLink} to={PATH_DASHBOARD.general.deposit} width="50%">
            <Button fullWidth variant="contained" color="warning">
              Deposit
            </Button>
          </Link>
          <Link underline="none" component={RouterLink} to={PATH_DASHBOARD.general.withdraw} width="50%">
            <Button fullWidth variant="contained">
              Withdraw
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}
