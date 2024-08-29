import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
// material
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Card, Stack, Divider, Typography, Button } from '@mui/material';
//
import useAuth from '../../hooks/useAuth';
// utils
import { fCurrency } from '../../utils/formatNumber';
//
import UpgradeTierModal from './UpgradeTierModal';

PlanCard.propTypes = {
  cardIndex: PropTypes.number,
  plan: PropTypes.shape({
    tier: PropTypes.number,
    license: PropTypes.any,
    required: PropTypes.number,
    commons: PropTypes.arrayOf(PropTypes.string),
    icon: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.arrayOf(PropTypes.string)
  })
};

export default function PlanCard({ plan, cardIndex }) {
  const { user } = useAuth();
  const theme = useTheme();
  const { tier, license, required, commons, options, disabled, icon } = plan;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLight = theme.palette.mode === 'light';

  const disableButton = tier <= user?.tier;

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: (theme) =>
          `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.12)}`,
        ...(cardIndex === 1 && {
          boxShadow: (theme) =>
            `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.48)}`
        })
      }}
    >
      <Stack spacing={5}>
        <div>
          <Typography variant="overline" sx={{ mb: 2, color: 'text.disabled', display: 'block' }}>
            Tier
          </Typography>
          <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {license}
            <Box component="img" src={icon} sx={{ width: 50, height: 50 }} />
          </Typography>
          <Typography variant="h5">
            {license === 'Basic' ? 'Free' : fCurrency(required)}
            <Typography variant="h4" component="span" ml={1} color="primary.main">
              {license !== 'Basic' && 'USD'}
            </Typography>
          </Typography>
        </div>

        <Stack spacing={2.5}>
          {commons.map((option) => (
            <Stack key={option} spacing={1.5} direction="row" alignItems="center">
              <Box component={Icon} icon={checkmarkFill} sx={{ color: 'primary.main', width: 20, height: 20 }} />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {options.map((option) => (
            <Stack spacing={1.5} direction="row" alignItems="center" key={option}>
              <Box
                component={Icon}
                icon={checkmarkFill}
                sx={{
                  width: 20,
                  height: 20,
                  color: 'primary.main'
                }}
              />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))}
          {disabled.map((option) => (
            <Stack spacing={1.5} direction="row" alignItems="center" sx={{ color: 'text.disabled' }} key={option}>
              <Box
                component={Icon}
                icon={checkmarkFill}
                sx={{
                  width: 20,
                  height: 20,
                  color: 'primary.main'
                }}
              />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))}
        </Stack>

        <Stack>
          <Button
            disabled={disableButton}
            size="large"
            onClick={() => setIsModalOpen(true)}
            variant={cardIndex === user?.tier + 1 ? 'contained' : 'outlined'}
          >
            Upgrade
          </Button>
        </Stack>
      </Stack>
      {isModalOpen && <UpgradeTierModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} plan={plan} />}
    </Card>
  );
}
