import { useState } from 'react';
// material
import { Container, Grid, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import FriendlyTransferForm from '../components/friendly-transfer/FriendlyTransferForm';
import FriendlyTrxDetails from '../components/friendly-transfer/FriendlyTrxDetails';
import CurrentBalance from '../components/wallets/CurrentBalance';

// ----------------------------------------------------------------------

export default function FriendlyTransfer() {
  const { themeStretch } = useSettings();
  const [reloadTrx, setReloadTrx] = useState(null);

  return (
    <Page title="Friendly Transfer | CryptoEver">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h3">Friendly Transfer</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={7}>
            <FriendlyTransferForm setReloadTrx={setReloadTrx} />
          </Grid>

          <Grid item xs={12} md={5}>
            <CurrentBalance />
          </Grid>
        </Grid>
        <FriendlyTrxDetails reloadTrx={reloadTrx} />
      </Container>
    </Page>
  );
}
