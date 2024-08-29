// material
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../components/animate';
import Page from '../components/Page';
import TiersGrid from '../components/memberTiers/TiersGrid';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15)
  }
}));

// ----------------------------------------------------------------------

export default function LandingPricingPlans() {
  return (
    <Page title="Member Tier | CryptoEver">
      <RootStyle>
        <Container maxWidth="lg">
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInUp}>
              <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary' }}>
                Member Tier Level
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                CryptoEver Member Tier
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInDown}>
              <Typography
                sx={{
                  color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'text.primary')
                }}
              >
                Please upgrade your tier for more services and supports.
              </Typography>
            </MotionInView>
          </Box>

          <TiersGrid />

          <Box sx={{ m: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography
                sx={{
                  color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'text.primary')
                }}
              >
                Savings rewards are calculated daily according to the user's balance, and will be converted into USDT
                and deposited into the user's wallet on December 1st of each year.
              </Typography>
            </MotionInView>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
