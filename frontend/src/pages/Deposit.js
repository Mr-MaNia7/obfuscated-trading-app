import { useState } from 'react';
// material
import { Container, Grid, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import DepositForm from '../components/deposit/DepositForm';
import VerifyDeposit from '../components/deposit/VerifyDeposit';
import DepositTrxDetails from '../components/deposit/DepositTrxDetails';

// ----------------------------------------------------------------------

export default function PageThree() {
  const { themeStretch } = useSettings();
  const [depositAsset, setDepositAsset] = useState(null);
  const [reloadTrx, setReloadTrx] = useState(null);

  return (
    <Page title="Deposit | CryptoEver">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h3">Deposit</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={6}>
            <DepositForm setDepositAsset={setDepositAsset} reloadTrx={reloadTrx} />
          </Grid>

          <Grid item xs={12} md={6}>
            <VerifyDeposit depositAsset={depositAsset} setReloadTrx={setReloadTrx} />
          </Grid>
        </Grid>
        <DepositTrxDetails reloadTrx={reloadTrx} />
      </Container>
    </Page>
  );
}
