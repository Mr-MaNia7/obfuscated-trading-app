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
import useAuth from '../../hooks/useAuth';
//
import { MIconButton } from '../@material-extend';
import Axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function ContactUsForm() {
  const { user } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contactUsSchema = Yup.object().shape({
    topic: Yup.string()
      .min(8, 'Topic must be at least 8 characters')
      .max(200, 'Topic cannot exceed 200 characters.')
      .required('Topic is required'),
    message: Yup.string()
      .min(30, 'Message must be at least 30 characters')
      .max(2000, 'Topic cannot exceed 2000 characters.!')
      .required('Message is required')
  });

  const formik = useFormik({
    initialValues: {
      topic: '',
      message: ''
    },
    validationSchema: contactUsSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        await Axios.post('/api/v1/users/submitMessage', { ...values });

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
        resetForm();
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
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            label="Topic"
            {...getFieldProps('topic')}
            error={Boolean(touched.topic && errors.topic)}
            helperText={touched.topic && errors.topic}
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

          <Alert severity="info">We will contact you via your account email {user?.email}.</Alert>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
