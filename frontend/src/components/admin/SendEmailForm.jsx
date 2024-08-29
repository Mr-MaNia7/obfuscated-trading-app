import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Stack, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
//
import { MIconButton } from '../@material-extend';
import Axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function SendMessageForm() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contactUsSchema = Yup.object().shape({
    email: Yup.string().required('Email address is required'),
    message: Yup.string().required('Message is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      message: ''
    },
    validationSchema: contactUsSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await Axios.post('/api/v1/admin/sendEmailToUser', { ...values });

        enqueueSnackbar('Submit success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
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
            label="Email Address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows="5"
            {...getFieldProps('message')}
            error={Boolean(touched.message && errors.message)}
            helperText={touched.message && errors.message}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
