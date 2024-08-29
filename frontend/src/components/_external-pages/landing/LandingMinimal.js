// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Card, Container, Typography, useMediaQuery } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../../animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: '/static/cryptos/usdt.svg',
    title: 'USDT',
    apy: '5.70',
    saving: '4,124,423.424'
  },
  {
    icon: '/static/cryptos/usdc.svg',
    title: 'USDC',
    apy: '5.30',
    saving: '2,751,582.156'
  },
  {
    icon: '/static/cryptos/busd.svg',
    title: 'BUSD',
    apy: '3.85',
    saving: '124,423.187'
  },
  {
    icon: '/static/cryptos/bnb.svg',
    title: 'BNB',
    apy: '7.32',
    saving: '5,123.843'
  },
  {
    icon: '/static/cryptos/sol.svg',
    title: 'SOL',
    apy: '8.25',
    saving: '8,423.485'
  },
  {
    icon: '/static/cryptos/trx.svg',
    title: 'TRX',
    apy: '10.55',
    saving: '42,125.751'
  },
  {
    icon: '/static/cryptos/matic.svg',
    title: 'MATIC',
    apy: '24.86',
    saving: '85,563.742'
  },
  {
    icon: '/static/cryptos/algo.svg',
    title: 'ALGO',
    apy: '20.25',
    saving: '21,265.478'
  },
  {
    icon: '/static/cryptos/near.svg',
    title: 'FTM',
    apy: '18.95',
    saving: '7,153.985'
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15)
  }
}));

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    maxWidth: 380,
    minHeight: 440,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(5, 5, 0),
    boxShadow: `-40px 40px 80px 0 ${shadowCard(0.48)}`,
    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    '&.cardLeft': {
      [theme.breakpoints.up('md')]: { marginTop: -40 }
    },
    '&.cardCenter': {
      [theme.breakpoints.up('md')]: {
        marginTop: -80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
        '&:before': {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          content: "''",
          margin: 'auto',
          position: 'absolute',
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)',
          borderRadius: theme.shape.borderRadiusMd,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`
        }
      }
    }
  };
});

const CardIconStyle = styled('img')(({ theme }) => ({
  width: 40,
  height: 40,
  margin: 'auto',
  marginBottom: theme.spacing(2)
}));

// ----------------------------------------------------------------------

export default function LandingMinimalHelps() {
  const theme = useTheme();
  // const isLight = theme.palette.mode === 'light';
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 10, md: 25 } }}>
          <MotionInView variants={varFadeInUp}>
            <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
              CryptoEver Earn
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Grow Your Crypto Holdings
            </Typography>
          </MotionInView>
        </Box>

        <Grid container spacing={isDesktop ? 10 : 5}>
          {CARDS.map((card, index) => (
            <Grid key={card.title} item xs={12} md={4}>
              <MotionInView variants={varFadeInUp}>
                <CardStyle
                  className={
                    ((index === 0 || index === 3 || index === 6) && 'cardLeft') ||
                    ((index === 1 || index === 4 || index === 7) && 'cardCenter')
                  }
                >
                  <CardIconStyle src={card.icon} alt={card.title} />
                  <Typography variant="h5" paragraph>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">
                    {card.apy} %{' '}
                    <Typography component="span" color="text.secondary" fontWeight="bold">
                      APY
                    </Typography>
                  </Typography>
                  <Typography color="text.secondary" fontWeight="bold" mt={2}>
                    Total Savings
                  </Typography>
                  <Typography>
                    {card.saving}
                    <Typography component="span" fontWeight="bold" pl={1}>
                      {card.title}
                    </Typography>
                  </Typography>
                </CardStyle>
              </MotionInView>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
