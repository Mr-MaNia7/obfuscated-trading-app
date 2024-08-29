// material
import { Container, Grid, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import WithdrawForm from '../components/withdraw/WithdrawForm';
import WithdrawTrxDetails from '../components/withdraw/WithdrawTrxDetails';
import CurrentBalance from '../components/wallets/CurrentBalance';

// ----------------------------------------------------------------------

export default function PageThree() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Withdraw | CryptoEver">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h3">Withdraw</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={7}>
            <WithdrawForm />
          </Grid>

          <Grid item xs={12} md={5}>
            <CurrentBalance />
          </Grid>
        </Grid>
        <WithdrawTrxDetails />
      </Container>
    </Page>
  );
}
