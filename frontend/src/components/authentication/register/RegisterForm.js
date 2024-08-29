import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert, Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register, getVerifyCode } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showTransactionKey, setShowTransactionKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verifyData, setVerifyData] = useState({
    verifyId: null,
    verifyCode: null
  });
  const [registerData, setRegisterData] = useState({
    transactionKey: null,
    accountName: null,
    email: null,
    password: null,
    passwordConfirm: null
  });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const RegisterSchema = Yup.object().shape({
    accountName: Yup.string()
      .min(8, 'Account name must be at least 8 characters')
      .max(50, 'Too Long!')
      .required('Account name required')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Only alphabets and numbers are allowed'),
    transactionKey: Yup.string()
      .min(8, 'Transaction key must be at least 8 characters')
      .max(50, 'Too Long!')
      .required('Transaction key is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    passwordConfirm: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      accountName: '',
      transactionKey: '',
      email: '',
      password: '',
      passwordConfirm: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        if (currentStep === 1) {
          const verifyId = await getVerifyCode(values);

          if (verifyId) {
            setVerifyData({ ...verifyData, verifyId });

            const { accountName, transactionKey, email, phoneNumber, password, passwordConfirm } = values;

            setRegisterData({
              accountName,
              transactionKey,
              email,
              phoneNumber,
              password,
              passwordConfirm
            });
            setCurrentStep(2);
          }
        } else if (currentStep === 2) {
          await register({ ...registerData, ...verifyData });
          enqueueSnackbar('Register success', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
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
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

            <TextField
              fullWidth
              autoComplete="account name"
              label="Account Name"
              {...getFieldProps('accountName')}
              error={Boolean(touched.accountName && errors.accountName)}
              helperText={touched.accountName && errors.accountName}
            />

            <TextField
              fullWidth
              autoComplete="transaction Key"
              type={showTransactionKey ? 'text' : 'password'}
              label="Transaction Key"
              {...getFieldProps('transactionKey')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowTransactionKey((prev) => !prev)}>
                      <Icon icon={showTransactionKey ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.transactionKey && errors.transactionKey)}
              helperText={touched.transactionKey && errors.transactionKey}
            />

            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="phoneNumber"
              label="Phone number (optional)"
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <TextField
              fullWidth
              autoComplete="confirm-password"
              type={showPasswordConfirm ? 'text' : 'password'}
              label="Password Confirmation"
              {...getFieldProps('passwordConfirm')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPasswordConfirm((prev) => !prev)}>
                      <Icon icon={showPasswordConfirm ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
              helperText={touched.passwordConfirm && errors.passwordConfirm}
            />

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Register
            </LoadingButton>
          </Stack>
        )}
        {currentStep === 2 && (
          <Stack spacing={3}>
            <Alert severity="info">Sent verification code to {registerData.email}</Alert>
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

            <TextField
              fullWidth
              autoComplete="verify code"
              label="Verification Code"
              value={verifyData.code}
              onChange={(e) => setVerifyData({ ...verifyData, verifyCode: e.target.value })}
            />

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Confirm Code
            </LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCurrentStep(1)}>Sign Up</Button>
            </Box>
          </Stack>
        )}
      </Form>
    </FormikProvider>
  );
}
