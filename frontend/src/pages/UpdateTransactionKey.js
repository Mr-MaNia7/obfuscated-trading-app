// material
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import UpdateTransactionKeyForm from '../components/user/UpdateTransactionKeyForm';

// ----------------------------------------------------------------------

export default function PageFive() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Update Transaction Key | CryptoEver">
      <Container maxWidth={themeStretch ? false : 'sm'}>
        <Typography variant="h3">Update Transaction Key</Typography>
        <UpdateTransactionKeyForm />
      </Container>
    </Page>
  );
}
