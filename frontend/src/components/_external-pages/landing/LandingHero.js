import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { varFadeIn, varFadeInUp, varWrapEnter, varFadeInRight } from '../../animate';
import './styles/landingHero.scss';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  perspective: 1000,
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left'
  }
}));

const HeroOverlayStyle = styled(motion.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  borderRadius: 20,
  transform: 'rotateY(313deg) rotateX(16deg)!important',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '20%',
    width: 'auto',
    height: '48vh'
  }
}));

// ----------------------------------------------------------------------

export default function LandingHero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" variants={varFadeIn} />

        <HeroImgStyle className="w3-card-4" alt="hero" src="/static/home/cryptos.jpg" variants={varFadeInUp} />

        <Container maxWidth="lg">
          <ContentStyle>
            <motion.div variants={varFadeInRight}>
              <Typography variant="h2" sx={{ color: 'common.white' }}>
                Crypto Assets
                <br />
                Holding, Staking <br /> with
                <Typography component="span" variant="h2" sx={{ color: 'primary.main' }}>
                  &nbsp;CryptoEver
                </Typography>
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Typography sx={{ color: 'common.white' }}>
                CryptoEver is our asset management platform that helps you grow your crypto holdings easily. We offer
                competitive APYs to ensure higher yields, and best-in-class security to safeguard your funds. Whether
                you're a regular crypto Joe or a cryptonaut, invest with us today to start earning!
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.root}
                startIcon={<Icon icon="clarity:wallet-solid" width={20} height={20} />}
              >
                To Wallet
              </Button>
            </motion.div>

            <Stack
              className="crypto_images"
              direction="row"
              spacing={1.5}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.img variants={varFadeInRight} src="/static/cryptos/btc.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/eth.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/bnb.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/sol.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/usdt.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/usdc.svg" />
            </Stack>

            <Stack
              className="crypto_images"
              direction="row"
              spacing={1.5}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.img variants={varFadeInRight} src="/static/cryptos/busd.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/algo.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/ada.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/matic.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/shib.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/avax.svg" />
            </Stack>

            <Stack
              className="crypto_images"
              direction="row"
              spacing={1.5}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <motion.img variants={varFadeInRight} src="/static/cryptos/near.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/trx.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/uni.svg" />
              <motion.img variants={varFadeInRight} src="/static/cryptos/cake.svg" />
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
