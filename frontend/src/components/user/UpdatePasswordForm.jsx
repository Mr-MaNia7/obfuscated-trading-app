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
import { Stack, TextField, IconButton, InputAdornment, Alert, Card, CardContent } from '@mui/material';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
//
import { MIconButton } from '../@material-extend';
import { SeverErrorIllustration } from '../../assets';
// utils
import Axios from '../../utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function UpdateForm() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showTransactionKey, setShowTransactionKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const UpdatePasswordSchema = Yup.object().shape({
    passwordCurrent: Yup.string().required('Current password is required'),
    password: Yup.string().required('New Password is required').min(8, 'Password must be at least 8 characters'),
    passwordConfirm: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    transactionKey: Yup.string()
      .min(8, 'Transaction key must be at least 8 characters')
      .max(50, 'Too Long!')
      .required('Transaction key is required')
  });

  const formik = useFormik({
    initialValues: {
      passwordCurrent: '',
      password: '',
      passwordConfirm: '',
      transactionKey: ''
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        await Axios.patch('/api/v1/users/updatePassword', { ...values });

        enqueueSnackbar('Password update success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });

        resetForm();

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        // console.error(error);
        resetForm();
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
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showCurrentPassword ? 'text' : 'password'}
            label="Current Password"
            {...getFieldProps('passwordCurrent')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                    <Icon icon={showCurrentPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.passwordCurrent && errors.passwordCurrent)}
            helperText={touched.passwordCurrent && errors.passwordCurrent}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Confirm
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

export default function UpdatePasswordForm() {
  return (
    <Card sx={{ minHeight: 600 }}>
      <SeverErrorIllustration
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
