// material
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Container, Typography, Card } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../components/animate';
import Page from '../components/Page';
//
import SendMessageForm from '../components/admin/SendMessageForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15)
  }
}));

// ----------------------------------------------------------------------

export default function FAQ() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  return (
    <Page title="Send Message | CryptoEver">
      <RootStyle>
        <Container maxWidth="md">
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Send SMS to User
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInUp}>
              <Card
                sx={{
                  p: 5,
                  boxShadow: (theme) =>
                    `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.48)}`,
                  textAlign: 'left',
                  mb: 4
                }}
              >
                <SendMessageForm />
              </Card>
            </MotionInView>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
