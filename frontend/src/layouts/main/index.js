import { Link as ScrollLink } from 'react-scroll';
import { useLocation, Outlet } from 'react-router-dom';
// material
import { Box, Container, Typography } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <MainNavbar />
      <div>
        <Outlet />
      </div>

      {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default'
          }}
        >
          <Container maxWidth="lg">
            <ScrollLink to="move_top" spy smooth>
              <Logo sx={{ mb: 1, mx: 'auto', cursor: 'pointer' }} />
            </ScrollLink>

            <Typography variant="caption" component="p">
              ©{new Date().getFullYear()} All rights reserved
              <br /> made by &nbsp; CryptoEver Inc.
            </Typography>
          </Container>
        </Box>
      )}
    </>
  );
}
