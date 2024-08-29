import { useState } from 'react';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment, Button, Alert, Box, Card, CardContent } from '@mui/material';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useAuth from '../../hooks/useAuth';
//
import { MIconButton } from '../@material-extend';
import { MaintenanceIllustration } from '../../assets';
// utils
import Axios from '../../utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function UpdateForm() {
  const { user } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTrxKey, setShowTrxKey] = useState(false);
  const [showTrxKeyConfirm, setShowTrxKeyConfirm] = useState(false);
  const [verifyData, setVerifyData] = useState({
    verifyId: null,
    verifyCode: null
  });

  const UpdateTrxKeySchema = Yup.object().shape({
    trxKey: Yup.string()
      .min(8, 'Transaction key must be at least 8 characters')
      .max(50, 'Too Long!')
      .required('New transaction key is required'),
    trxKeyConfirm: Yup.string()
      .required('Transaction key confirmation is required')
      .oneOf([Yup.ref('trxKey'), null], 'Transaction keys must match')
  });

  const formik = useFormik({
    initialValues: {
      trxKey: '',
      trxKeyConfirm: ''
    },
    validationSchema: UpdateTrxKeySchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        if (currentStep === 1) {
          const res = await Axios.get('/api/v1/users/getVerifyCodeForTrxKeyUpdate');
          const { verifyId } = res.data?.data;

          if (verifyId) {
            setVerifyData({ ...verifyData, verifyId });
            setCurrentStep(2);
          }
        } else if (currentStep === 2) {
          await Axios.patch('/api/v1/users/updateTrxKey', { ...values, ...verifyData });
          enqueueSnackbar('Transaction key update success', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          resetForm();
          setCurrentStep(1);
        }

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        // console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: Object.values(error.message)[0] });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Stack spacing={3}>
            <Stack>
              <Alert severity="info">We will send verification code to {user?.email}.</Alert>
            </Stack>

            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

            <TextField
              fullWidth
              autoComplete="current-trxKey"
              type={showTrxKey ? 'text' : 'password'}
              label="New Transaction Key"
              {...getFieldProps('trxKey')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowTrxKey((prev) => !prev)}>
                      <Icon icon={showTrxKey ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.trxKey && errors.trxKey)}
              helperText={touched.trxKey && errors.trxKey}
            />

            <TextField
              fullWidth
              autoComplete="confirm-password"
              type={showTrxKeyConfirm ? 'text' : 'password'}
              label="Transaction Key Confirmation"
              {...getFieldProps('trxKeyConfirm')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowTrxKeyConfirm((prev) => !prev)}>
                      <Icon icon={showTrxKeyConfirm ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.trxKeyConfirm && errors.trxKeyConfirm)}
              helperText={touched.trxKeyConfirm && errors.trxKeyConfirm}
            />

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Next
            </LoadingButton>
          </Stack>
        )}
        {currentStep === 2 && (
          <Stack spacing={3}>
            <Alert severity="info">Sent verification code to {user.email}. Please check.</Alert>
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

            <TextField
              fullWidth
              autoComplete="verify code"
              label="Verification Code"
              value={verifyData.code}
              onChange={(e) => setVerifyData({ ...verifyData, verifyCode: e.target.value })}
            />

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Next
            </LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCurrentStep(1)}>Previous</Button>
            </Box>
          </Stack>
        )}
      </Form>
    </FormikProvider>
  );
}

export default function UpdateTransactionKeyForm() {
  return (
    <Card sx={{ minHeight: 600 }}>
      <MaintenanceIllustration
        sx={{
          p: 3,
          width: 255,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />

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
        <UpdateForm />
      </CardContent>
    </Card>
  );
}
