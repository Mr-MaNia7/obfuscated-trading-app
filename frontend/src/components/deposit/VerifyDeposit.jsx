import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Card, Alert, CardContent, Stack, InputAdornment, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
//
import { fCurrency } from '../../utils/formatNumber';
import { SUPPORTED_COINS } from '../../utils/staticData';
import Axios from '../../utils/axios';
import { MIconButton } from '../@material-extend';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function WithdrawForm({ depositAsset, setReloadTrx }) {
  const { prices } = useSelector((state) => state);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [amount, setAmount] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [transactionKey, setTransactionKey] = useState('');

  const [showTransactionKey, setShowTransactionKey] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const clearForm = () => {
    setAmount('');
    setReferenceCode('');
    setTransactionKey('');
    setError('');
  };

  useEffect(() => {
    if (!depositAsset) clearForm();
  }, [depositAsset]);

  const confirmDeposit = async () => {
    setError('');
    const usdAmount = Number(prices[depositAsset]?.price * amount);
    if (usdAmount <= 0) {
      setError('Invalid amount value.');
      return;
    }
    if (usdAmount < 100) {
      setError('Min deposit amount is 100 USD.');
      return;
    }
    if (usdAmount > 1000000) {
      setError('Max deposit amount is 1,000,000 USD.');
      return;
    }
    setPending(true);
    try {
      const confirmData = {
        referenceCode,
        asset: String(depositAsset).toUpperCase(),
        amount,
        transactionKey
      };

      await Axios.post('/api/v1/transactions/confirmDeposit', {
        ...confirmData
      });

      setPending(false);
      clearForm();

      enqueueSnackbar('Confirm Deposit success', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setReloadTrx(referenceCode + Date.now().toString());
    } catch (err) {
      // console.log(err);
      setError(Object.values(err.message)[0]);
      setPending(false);
    }
  };

  const disableButton = !depositAsset || !amount || !transactionKey || !referenceCode;

  return (
    <Card sx={{ minHeight: 690 }}>
      <CardContent>
        <Typography variant="h4" textAlign="center" mb={2}>
          Deposit Verification
        </Typography>
        <Stack>
          <Alert severity="info" sx={{ mb: 1 }}>
            After successfully transferring asset to the deposit address, you will need to submit the{' '}
            <Typography variant="span" color="primary.main" fontWeight="bold">
              reference code
            </Typography>{' '}
            and{' '}
            <Typography variant="span" color="primary.main" fontWeight="bold">
              deposit amount
            </Typography>{' '}
            in order to verify your deposit.
          </Alert>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </CardContent>
      <CardContent
        sx={{
          p: { md: 2 },
          minHeight: 380,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Stack>
          <TextField
            disabled={!depositAsset}
            fullWidth
            autoComplete=""
            label="Reference code"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            sx={{ marginTop: 1 }}
          />
        </Stack>

        <Stack>
          <TextField
            disabled={!depositAsset}
            fullWidth
            autoComplete="Deposit amount"
            label="Deposit amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ marginTop: 1 }}
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: (
                <InputAdornment position="start">
                  {depositAsset && String(depositAsset).toUpperCase()}
                  {depositAsset && (
                    <img
                      src={SUPPORTED_COINS[depositAsset]?.icon}
                      alt={`${SUPPORTED_COINS[depositAsset]?.icon}`}
                      style={{ width: 24, marginLeft: 4, marginRight: 4 }}
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
          <Stack sx={{ minHeight: 25 }} ml={1} direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: '0.8rem' }}>~ {fCurrency(amount * prices[depositAsset]?.price)} USD</Typography>
            <Typography sx={{ fontSize: '0.8rem' }}>Deposit amount: 100 ~ 1,000,000 USD</Typography>
          </Stack>
        </Stack>

        <Stack mb={1}>
          <TextField
            disabled={!depositAsset}
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

        <LoadingButton
          disabled={disableButton}
          size="large"
          loading={pending}
          variant="contained"
          fullWidth
          onClick={confirmDeposit}
        >
          Confirm Deposit
        </LoadingButton>
      </CardContent>
    </Card>
  );
}
