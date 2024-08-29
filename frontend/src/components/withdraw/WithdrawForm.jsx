import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import WAValidator from 'multicoin-address-validator';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';

import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
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
  IconButton,
  CircularProgress,
  Autocomplete,
  TextField,
  Box
} from '@mui/material';
//
import { UploadIllustration } from '../../assets';
import { SUPPORTEDCOINS, SUPPORTED_NETWORKS, TRX_FEE } from '../../utils/staticData';
import { fCurrency, fNumberWithDecimal } from '../../utils/formatNumber';
import useAuth from '../../hooks/useAuth';
import Axios from '../../utils/axios';
import { MIconButton } from '../@material-extend';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function WithdrawForm() {
  const { user } = useAuth();
  const { balance, prices } = useSelector((state) => state);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [asset, setAsset] = useState(null);
  const [network, setNetwork] = useState(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [transactionKey, setTransactionKey] = useState('');

  const [showTransactionKey, setShowTransactionKey] = useState(false);

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const clearForm = () => {
    setAsset(null);
    setNetwork(null);
    setAddress(null);
    setAmount(null);
  };

  const withdrawAssets = SUPPORTEDCOINS.filter((item) => balance[item.symbol] > 0);

  const networks = useMemo(() => {
    if (!asset) return [];
    return SUPPORTED_NETWORKS[asset?.symbol];
  }, [asset]);

  const isValidAddress = network?.value && WAValidator.validate(address, network?.value);
  const isValidAmount = amount && amount >= 0 && amount <= balance[asset?.symbol];

  const diableGet2FAButton =
    _.isEmpty(asset) || _.isEmpty(network) || _.isEmpty(address) || !isValidAddress || !isValidAmount;

  const handleSetMaxAmount = () => {
    if (!asset) return;
    const amount = balance[asset?.symbol];
    const trxFee = (amount * TRX_FEE[user?.tier]) / 100;
    setAmount(Number(amount - trxFee * 1.05).toFixed(8));
  };

  const handleNext = () => {
    setError('');
    const usdAmount = Number(prices[asset?.symbol]?.price * amount);
    if (usdAmount < 10) {
      setError('Min withdraw amount is 10 USD.');
      return;
    }
    setCurrentStep(2);
  };

  const handleConfirmWithdraw = async () => {
    setError('');
    setPending(true);
    try {
      const withdrawData = {
        asset: asset?.label,
        network: network?.network,
        address,
        amount,
        fee: Number((amount * TRX_FEE[user?.tier]) / 100).toFixed(8)
      };

      await Axios.post('/api/v1/transactions/confirmWithdraw', {
        transactionKey,
        ...withdrawData
      });

      setPending(false);
      clearForm();
      setCurrentStep(1);

      enqueueSnackbar('Withdraw Request success', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } catch (err) {
      // console.log(err);
      setError(Object.values(err.message)[0]);
      setPending(false);
    }
  };

  return (
    <Card>
      <UploadIllustration
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
        {currentStep === 1 && _.isEmpty(withdrawAssets) && (
          <Stack alignItems="center">
            {!_.isEmpty(balance) ? (
              <Typography sx={{ textAlign: 'center' }}>No Assets to withdraw</Typography>
            ) : (
              <CircularProgress />
            )}
          </Stack>
        )}
        {currentStep === 1 && !_.isEmpty(withdrawAssets) && (
          <>
            <Autocomplete
              value={asset}
              onChange={(event, newValue) => {
                setAsset(newValue);
                // eslint-disable-next-line no-unused-expressions
                SUPPORTED_NETWORKS[newValue?.symbol] && setNetwork(SUPPORTED_NETWORKS[newValue?.symbol][0]);
              }}
              id="withdraw-asset"
              fullWidth
              options={withdrawAssets}
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

            <Autocomplete
              value={network}
              onChange={(event, newValue) => {
                setNetwork(newValue);
              }}
              id="network-of-asset"
              fullWidth
              options={networks}
              autoHighlight
              getOptionLabel={(option) => `${option?.label} (${option?.network})`}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option?.label} ({option?.network})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose network"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />

            <TextField
              disabled={_.isEmpty(asset)}
              fullWidth
              autoComplete="wallet address"
              label="Wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ marginTop: 4 }}
            />
            <Typography sx={{ minHeight: 25, fontSize: '0.8rem' }} ml={1} color="error.main">
              {network && address && !isValidAddress && <span>Invalid wallet address for {network?.label}</span>}
            </Typography>

            <Stack direction="row" alignItems="center">
              <TextField
                disabled={_.isEmpty(asset)}
                fullWidth
                autoComplete="withdraw amount"
                label="Withdraw amount"
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
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    ~ {fCurrency(amount * prices[asset?.symbol]?.price)} USD
                  </Typography>
                )}
              </span>
              <Typography sx={{ fontSize: '0.8rem' }}>
                Fee : {fNumberWithDecimal((amount * TRX_FEE[user?.tier]) / 100)} {asset?.label}
              </Typography>
            </Stack>

            <Typography sx={{ fontSize: '0.8rem', minHeight: 25, color: 'error.main' }} my={1}>
              {error && error}
            </Typography>

            <LoadingButton
              size="large"
              loading={pending}
              disabled={diableGet2FAButton}
              variant="contained"
              fullWidth
              onClick={handleNext}
            >
              Next
            </LoadingButton>
          </>
        )}
        {currentStep === 2 && (
          <Stack spacing={3}>
            <Alert severity="info">Please enter your transaction key.</Alert>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              autoComplete="transaction Key"
              type={showTransactionKey ? 'text' : 'password'}
              label="Transaction Key"
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

            <LoadingButton
              disabled={!transactionKey}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={pending}
              onClick={handleConfirmWithdraw}
            >
              Confirm Withdraw
            </LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCurrentStep(1)}>Previous</Button>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
