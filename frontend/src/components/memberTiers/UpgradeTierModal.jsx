import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Typography,
  Box,
  Fade,
  Modal,
  Backdrop,
  Stack,
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
//
import useAuth from '../../hooks/useAuth';
import { getBalance } from '../../redux/actions/dataAction';
import { MIconButton } from '../@material-extend';
// utils
import { fCurrency, fNumberWithDecimal } from '../../utils/formatNumber';
import { SUPPORTED_COINS } from '../../utils/staticData';
import Axios from '../../utils/axios';

const ModalRoot = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '96%',
    padding: 12
  },
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: theme.palette.background.paper,
  border: '2px solid',
  boxShadow: 24,
  padding: 32
}));

UpgradeTierModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.any,
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

export default function UpgradeTierModal({ isOpen, setIsOpen, plan }) {
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { tier, license, required, icon } = plan;
  const { balance, prices } = useSelector((state) => state);
  const [asset, setAsset] = useState(null);
  const [transactionKey, setTransactionKey] = useState('');
  const [showTransactionKey, setShowTransactionKey] = useState(false);

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const myBalance = useMemo(() => {
    const data = Object.keys(balance).map((item) => ({
      ...SUPPORTED_COINS[item],
      asset: balance[item],
      usdValue: balance[item] * prices[item]?.price
    }));
    return _.orderBy(data, ['usdValue', 'symbol'], ['desc', 'asc']);
  }, [prices, balance]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const selectedAssetUSD = balance[asset?.symbol] * prices[asset?.symbol]?.price;
  const isSufficientBalance = selectedAssetUSD >= required;
  const disableButton = !asset || !transactionKey || !isSufficientBalance;

  const confirmUpgrade = async () => {
    setError('');
    setPending(true);
    try {
      const res = await Axios.patch('/api/v1/users/upgradeUserTier', {
        tier,
        asset: asset?.symbol,
        transactionKey
      });
      const { user } = res.data?.data;

      updateProfile(user);
      dispatch(getBalance());
      setPending(false);

      enqueueSnackbar('Tier Upgrade success', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });

      handleClose();
    } catch (err) {
      setError(Object.values(err.message)[0]);
      setPending(false);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={isOpen}>
        <ModalRoot>
          <Typography variant="h4" id="transition-modal-title" textAlign="center" mb={3}>
            Member Tier Upgrade
          </Typography>
          <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box component="img" src={icon} sx={{ width: 50, height: 50 }} />
            <Box>
              {license} <Typography>( {fCurrency(required)} USD Required )</Typography>
            </Box>
          </Typography>
          <Stack mt={2}>
            <Autocomplete
              value={asset}
              onChange={(event, newValue) => {
                setAsset(newValue);
              }}
              id="withdraw-asset"
              fullWidth
              options={myBalance}
              autoHighlight
              getOptionLabel={(option) => `${option?.name} (${option?.label})`}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <img loading="lazy" width="20" src={option.icon} alt="" />
                  <Typography color={option?.usdValue < required ? 'error.main' : ''}>
                    {option.name} ( {fNumberWithDecimal(balance[option?.symbol])} {option.label} ~{' '}
                    {fCurrency(option?.usdValue)} USD )
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose asset to pay"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Typography sx={{ minHeight: 25, fontSize: '0.8rem' }} ml={1} mb={1}>
              {asset?.symbol && (
                <span>
                  {fNumberWithDecimal(balance[asset?.symbol])} {asset?.label} ( ~ {fCurrency(selectedAssetUSD)} USD)
                  {!isSufficientBalance && (
                    <Typography variant="span" color="error.main" ml={1}>
                      Insufficient balance
                    </Typography>
                  )}
                </span>
              )}
            </Typography>
          </Stack>
          <Stack>
            {asset && (
              <Typography display="flex">
                <Box
                  component="img"
                  src="/static/icons/usd.png"
                  sx={{ color: 'primary.main', width: 20, height: 20 }}
                />
                {fCurrency(required)} USD = ~ {fNumberWithDecimal(required / prices[asset?.symbol]?.price)}{' '}
                {asset?.label}
                <Box component="img" src={asset?.icon} sx={{ color: 'primary.main', width: 20, height: 20 }} ml={1} />
              </Typography>
            )}
          </Stack>
          <Stack mb={4} mt={2}>
            <TextField
              disabled={!asset}
              fullWidth
              autoComplete="transaction key"
              type={showTransactionKey ? 'text' : 'password'}
              label="Transaction key"
              value={transactionKey}
              onChange={(e) => setTransactionKey(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowTransactionKey((prev) => !prev)}>
                      <Icon icon={showTransactionKey ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <Stack mb={2}>{error && <Alert severity="error">{error}</Alert>}</Stack>

          <LoadingButton
            disabled={disableButton}
            size="large"
            loading={pending}
            variant="contained"
            fullWidth
            onClick={confirmUpgrade}
          >
            Confirm Upgrade
          </LoadingButton>
        </ModalRoot>
      </Fade>
    </Modal>
  );
}
