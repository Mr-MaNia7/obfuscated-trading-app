import { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Button, Card, Alert, Tooltip, CardContent, Stack, IconButton } from '@mui/material';

import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//
import { MotivationIllustration } from '../../assets';
import { SUPPORTEDCOINS, SUPPORTED_NETWORKS } from '../../utils/staticData';
import Axios from '../../utils/axios';
import { generateQR } from '../../utils/string';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function DepositForm({ setDepositAsset, reloadTrx }) {
  const [asset, setAsset] = useState(null);
  const [network, setNetwork] = useState(null);
  const [depositData, setDepositData] = useState({
    depositAddress: null,
    referenceCode: null
  });
  const [qrCodeForDeposit, setQrCodeForDeposit] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const initialCopyState = {
    depositAddress: false,
    referenceCode: false
  };
  const [copied, setCopied] = useState(initialCopyState);

  // const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      if (depositData?.depositAddress) {
        const qrCode = await generateQR(depositData?.depositAddress);
        setQrCodeForDeposit(qrCode);
      }
      return '';
    })();
  }, [depositData]);

  const clearForm = () => {
    setAsset(null);
    setNetwork(null);
    setDepositAsset(null);
  };

  useEffect(() => {
    clearForm();
    setCurrentStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTrx]);

  const networks = useMemo(() => {
    if (!asset) return [];
    return SUPPORTED_NETWORKS[asset?.symbol];
  }, [asset]);

  const diableGetDepositButton = _.isEmpty(asset) || _.isEmpty(network);

  const getDepositAddress = async () => {
    // setError('');
    setPending(true);
    try {
      const res = await Axios.post('/api/v1/transactions/getDepositAddress', {
        asset: asset?.label,
        network: network?.network,
        value: network?.value
      });
      const { address, referenceCode } = res.data?.data;
      setDepositData({ depositAddress: address, referenceCode });
      setPending(false);
      setDepositAsset(asset?.symbol);
      setCurrentStep(2);
    } catch (err) {
      console.log(err);
      setPending(false);
    }
  };

  const handleCopyAddress = (item) => {
    setCopied({ ...copied, [item]: true });

    // Copy the text inside the text field
    navigator.clipboard.writeText(depositData[item]);

    setTimeout(() => {
      setCopied(initialCopyState);
    }, 1500);
  };

  const handlePrevious = () => {
    clearForm();
    setCurrentStep(1);
  };

  return (
    <Card sx={{ minHeight: 680 }}>
      {currentStep === 1 && (
        <MotivationIllustration
          sx={{
            p: 3,
            width: 255,
            margin: { xs: 'auto', md: 'inherit' }
          }}
        />
      )}
      {currentStep === 1 && (
        <CardContent
          sx={{
            p: { md: 2 },
            gap: 5,
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Stack>
            <Alert severity="info">Please choose the asset and network to deposit.</Alert>
          </Stack>

          <Autocomplete
            value={asset}
            onChange={(event, newValue) => {
              setAsset(newValue);
              // eslint-disable-next-line no-unused-expressions
              SUPPORTED_NETWORKS[newValue?.symbol] && setNetwork(SUPPORTED_NETWORKS[newValue?.symbol][0]);
            }}
            id="withdraw-asset"
            fullWidth
            options={SUPPORTEDCOINS}
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
                label="Choose asset to deposit"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />

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

          <LoadingButton
            size="large"
            loading={pending}
            disabled={diableGetDepositButton}
            variant="contained"
            fullWidth
            onClick={getDepositAddress}
          >
            Get deposit address
          </LoadingButton>
        </CardContent>
      )}
      {currentStep === 2 && (
        <CardContent
          sx={{
            p: { md: 2 },
            gap: 3,
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Stack>
            <Typography sx={{ wordBreak: 'break-word' }}>Reference Code</Typography>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              mb={1}
              sx={{ border: '1px solid', borderRadius: 1 }}
            >
              <Typography sx={{ wordBreak: 'break-word' }}>{depositData.referenceCode}</Typography>
              <Tooltip title={copied.referenceCode ? 'Copied' : 'Copy reference code'}>
                <IconButton aria-label="copy address" onClick={() => handleCopyAddress('referenceCode')}>
                  {copied.referenceCode ? <ContentCopyTwoToneIcon /> : <ContentCopyIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
            <Alert severity="info">
              Please make sure you use the{' '}
              <Typography variant="span" color="primary.main" fontWeight="bold">
                reference code
              </Typography>{' '}
              indicated above when you are verifying the deposit, otherwise we may not be able to locate your
              transaction.
            </Alert>
          </Stack>

          <Stack>
            <Typography sx={{ wordBreak: 'break-word' }}>Deposit Address</Typography>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              mb={1}
              sx={{ border: '1px solid', borderRadius: 1 }}
            >
              <Typography sx={{ wordBreak: 'break-word' }}>{depositData.depositAddress}</Typography>
              <Tooltip title={copied.depositAddress ? 'Copied' : 'Copy deposit address'}>
                <IconButton aria-label="copy address" onClick={() => handleCopyAddress('depositAddress')}>
                  {copied.depositAddress ? <ContentCopyTwoToneIcon /> : <ContentCopyIcon />}
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack alignItems="center" mb={1}>
              {qrCodeForDeposit && (
                <img
                  src={qrCodeForDeposit}
                  alt="qrcode of deposit address"
                  style={{ width: 170, border: '5px double' }}
                />
              )}
            </Stack>

            <Alert severity="info">
              Send only{' '}
              <Typography variant="span" color="primary.main" fontWeight="bold">
                {asset?.label}
              </Typography>{' '}
              to this deposit address. Ensure the network is{' '}
              <Typography variant="span" color="primary.main" fontWeight="bold">
                {network?.label} ({network?.network})
              </Typography>
            </Alert>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handlePrevious}>Previous</Button>
          </Box>
        </CardContent>
      )}
    </Card>
  );
}
