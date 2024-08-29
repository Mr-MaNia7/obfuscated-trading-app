import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';

import closeFill from '@iconify/icons-eva/close-fill';
import _ from 'lodash';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Typography,
  Button,
  Card,
  Alert,
  CardContent,
  Stack,
  InputAdornment,
  CircularProgress,
  Autocomplete,
  TextField,
  Box
} from '@mui/material';
//
import { SeoIllustration } from '../../assets';
import { SUPPORTEDCOINS, TRX_FEE } from '../../utils/staticData';
import { fCurrency, fNumberWithDecimal } from '../../utils/formatNumber';
import useAuth from '../../hooks/useAuth';
import Axios from '../../utils/axios';
import { MIconButton } from '../@material-extend';
import { getBalance } from '../../redux/actions/dataAction';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function WithdrawForm({ setReloadTrx }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { balance, prices } = useSelector((state) => state);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [asset, setAsset] = useState(null);
  const [amount, setAmount] = useState('');
  const [friendName, setFriendName] = useState('');

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const clearForm = () => {
    setAsset(null);
    setFriendName('');
    setAmount('');
  };

  const transferAssets = SUPPORTEDCOINS.filter((item) => balance[item.symbol] > 0);

  const usdAmount = amount * prices[asset?.symbol]?.price;
  const isValidAmount = amount && amount >= 0 && amount <= balance[asset?.symbol];

  const diableGet2FAButton = _.isEmpty(asset) || _.isEmpty(friendName) || !isValidAmount;

  const handleSetMaxAmount = () => {
    if (!asset) return;
    const amount = balance[asset?.symbol];
    const trxFee = (amount * TRX_FEE[user?.tier]) / 100;
    setAmount(Number(amount - trxFee * 1.05).toFixed(8));
  };

  const handleConfirmTransfer = async () => {
    if (usdAmount < 10) {
      setError('Min transfer amount is 10 USD');
      return;
    }
    setError('');
    setPending(true);
    try {
      const transferData = {
        asset: asset?.label,
        price: prices[asset?.symbol]?.price,
        friendAccountName: friendName,
        amount: Number(amount),
        fee: Number((amount * TRX_FEE[user?.tier]) / 100).toFixed(8)
      };

      await Axios.post('/api/v1/transactions/confirmFriendlyTransfer', {
        ...transferData
      });
      await dispatch(getBalance());

      setPending(false);
      clearForm();

      enqueueSnackbar('Transfer Request success', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setReloadTrx(Date.now());
    } catch (err) {
      // console.log(err);
      setError(Object.values(err.message)[0]);
      setPending(false);
    }
  };

  return (
    <Card>
      <SeoIllustration
        sx={{
          p: 3,
          width: 255,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
      <CardContent
        sx={{
          p: { md: 2 },
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {_.isEmpty(transferAssets) && (
          <Stack alignItems="center">
            {!_.isEmpty(balance) ? (
              <Typography sx={{ textAlign: 'center' }}>No Assets to transfer</Typography>
            ) : (
              <CircularProgress />
            )}
          </Stack>
        )}
        {!_.isEmpty(transferAssets) && (
          <>
            <Stack mb={3}>{error && <Alert severity="error">{error}</Alert>}</Stack>
            <Autocomplete
              value={asset}
              onChange={(event, newValue) => {
                setAsset(newValue);
              }}
              id="withdraw-asset"
              fullWidth
              options={transferAssets}
              autoHighlight
              getOptionLabel={(option) => `${option?.name} (${option?.label})`}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <img loading="lazy" width="20" src={option.icon} alt="" />
                  {option.name} ({option.label})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose asset to withdraw"
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
                  {fNumberWithDecimal(balance[asset?.symbol])} {asset?.label} ( ~{' '}
                  {fCurrency(balance[asset?.symbol] * prices[asset?.symbol]?.price)} USD)
                </span>
              )}
            </Typography>

            <TextField
              fullWidth
              autoComplete="Friend's account name"
              label="Friend's account name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              sx={{ marginBottom: 4 }}
            />

            <Stack direction="row" alignItems="center">
              <TextField
                disabled={_.isEmpty(asset)}
                fullWidth
                autoComplete="Transfer amount"
                label="Transfer amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ marginTop: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {asset?.label}
                      {asset && (
                        <img
                          src={asset?.icon}
                          alt={`${asset?.icon}`}
                          style={{ width: 24, marginLeft: 4, marginRight: 4 }}
                        />
                      )}
                    </InputAdornment>
                  )
                }}
              />
              <Button onClick={handleSetMaxAmount}>Max</Button>
            </Stack>

            <Stack
              sx={{ minHeight: 25 }}
              ml={1}
              mb={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>
                {amount && !isValidAmount ? (
                  <Typography color="error.main" sx={{ fontSize: '0.8rem' }}>
                    Invalid value
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: '0.8rem' }}>~ {fCurrency(usdAmount)} USD</Typography>
                )}
              </span>
              <Typography sx={{ fontSize: '0.8rem' }}>
                Fee : {fNumberWithDecimal((amount * TRX_FEE[user?.tier]) / 100)} {asset?.label}
              </Typography>
            </Stack>

            <LoadingButton
              size="large"
              loading={pending}
              disabled={diableGet2FAButton}
              variant="contained"
              fullWidth
              onClick={handleConfirmTransfer}
            >
              Transfer without key
            </LoadingButton>
          </>
        )}
      </CardContent>
    </Card>
  );
}
