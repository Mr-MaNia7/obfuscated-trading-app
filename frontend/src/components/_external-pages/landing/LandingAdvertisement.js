import { motion } from 'framer-motion';
// material
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography } from '@mui/material';
//
import { varFadeInDown, varFadeInUp, MotionInView } from '../../animate';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 456,
  margin: 'auto',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
  borderRadius: theme.shape.borderRadiusMd,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    maxWidth: '100%',
    marginTop: theme.spacing(5),
    paddingBottom: 0,
    alignItems: 'center'
  }
}));

// ----------------------------------------------------------------------

export default function LandingAdvertisement() {
  return (
    <Container maxWidth="lg">
      <ContentStyle>
        <MotionInView
          variants={varFadeInUp}
          sx={{
            mb: { xs: 3, md: 0 }
          }}
        >
          <motion.div animate={{ y: [-20, 0, -20] }} transition={{ duration: 4, repeat: Infinity }}>
            <Box component="img" alt="rocket" src="/static/home/rocket.png" sx={{ maxWidth: 460, width: 1 }} />
          </motion.div>
        </MotionInView>

        <Box
          sx={{
            pl: { md: 10 },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <MotionInView variants={varFadeInDown} sx={{ color: 'common.white', mb: 5 }}>
            <Typography variant="h2">
              Get started with
              <br /> CryptoEver today
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Button
              size="large"
              variant="contained"
              href={PATH_DASHBOARD.root}
              sx={{
                whiteSpace: 'nowrap',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                bgcolor: 'common.white',
                '&:hover': { bgcolor: 'grey.300' }
              }}
            >
              Let's Go Now
            </Button>
          </MotionInView>
        </Box>
      </ContentStyle>
    </Container>
  );
}
