import { useSelector } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Typography } from '@mui/material';
// ----
import { SUPPORTED_COINS } from '../../utils/staticData';
import { fCurrency } from '../../utils/formatNumber';
// ----------------------------------------------------------------------

const ContentStyle = styled(Card)(({ theme }) => ({
  marginTop: -120,
  boxShadow: 'none',
  padding: theme.spacing(5),
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(3),
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`
}));

const ImgStyle = styled('img')(() => ({
  width: 24,
  height: 24,
  marginRight: 10
}));
// ----------------------------------------------------------------------

export default function TrendingBox() {
  const { prices } = useSelector((state) => state);

  const TrendingCoins = ['btc', 'eth', 'sol', 'algo'];

  return (
    <div>
      <Box
        component="img"
        src="/static/illustrations/illustration_invite.png"
        sx={{
          zIndex: 9,
          position: 'relative',
          left: 40,
          width: 140,
          minHeight: 206,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))'
        }}
      />
      <ContentStyle>
        <Typography mb={2}>
          Prices of trending coins{' '}
          <span role="img" aria-label="burning">
            &#128293;
          </span>
        </Typography>
        {TrendingCoins.map((item) => (
          <Stack key={item} direction="row" alignItems="center" justifyContent="space-between" mb={2.2}>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyle alt="crypto" src={SUPPORTED_COINS[item]?.icon} />
              {SUPPORTED_COINS[item]?.name} ({SUPPORTED_COINS[item]?.label})
            </Typography>
            <Typography variant="h5">{fCurrency(prices[item]?.price)} USD</Typography>
          </Stack>
        ))}
      </ContentStyle>
    </div>
  );
}
