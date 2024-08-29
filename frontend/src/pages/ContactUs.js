// material
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Container, Typography, Card } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../components/animate';
import Page from '../components/Page';
//
import ContactUsForm from '../components/supports/ContactUsForm';

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
    <Page title="Contact Us | CryptoEver">
      <RootStyle>
        <Container maxWidth="md">
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Contact Us
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
                <ContactUsForm />
              </Card>
            </MotionInView>
            <MotionInView variants={varFadeInUp}>
              <Typography>
                We are committed to protecting and respecting your privacy, and we will only use your personal
                information to administer your account and to provide the products and services, you requested from us.
                From time to time, we would like to contact you about our products and services, as well as other
                content that may be of interest to you.
              </Typography>
            </MotionInView>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
