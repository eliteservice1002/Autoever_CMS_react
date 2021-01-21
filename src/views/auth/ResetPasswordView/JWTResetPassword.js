import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
	Box,
	Grid,
	Button,
	TextField,
} from '@material-ui/core';
import qs from 'querystringify';
import { useHistory } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const JWTResetPassword = ({ intl }) => {
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const msgError = [
		'El campo es requerido',
		'La constraseñas no coinciden',
	];
	const validationSchema = Yup.object().shape({
		password: Yup.string().max(191).required(msgError[0]),
		confirm_password: Yup.string().max(191).required(msgError[0])
											.oneOf([Yup.ref('password'), null], msgError[1]),
	})

	return (
		<Formik
			initialValues={{
				password: '',
				confirm_password: ''
			}}
			onSubmit={async (values) => {
				try {
					let data = { ...values };
					const {
						email,
						verification_key
					} = qs.parse(history.location.search);

					data.email = email;
					data.verification_key = verification_key;

					const {
						msg,
						status,
					} = await httpClient.post('api/resetpassword', data);

					enqueueSnackbar(
						msg,
						{ variant: (status) ? 'success' : 'danger' }
					)
					if(status == 1) {
						history.push(formatMessage(intl.urlLogin));
					}
				} catch(err) {
					console.log(err);
					enqueueSnackbar(err, { variant: 'danger' })
				}
			}}
			validationSchema={validationSchema}
		>
			{({
				errors,
				values,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				isSubmitting,
			}) => (
				<form onSubmit={handleSubmit} >
					<Grid container spacing={3} >
						<Grid item xs={12} >
							<TextField
								required
								fullWidth
								type='password'
								name="password"
								label="New Password"
								variant="outlined"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.password}
								error={Boolean(touched.password && errors.password)}
								helperText={
									(Boolean(touched.password && errors.password))
										? errors.password : ''
								}
							/>
						</Grid>

						<Grid item xs={12} >
							<TextField
								required
								fullWidth
								type='password'
								variant="outlined"
								name="confirm_password"
								onBlur={handleBlur}
								label="Confirm Password"
								onChange={handleChange}
								value={values.confirm_password}
								error={Boolean(touched.confirm_password && errors.confirm_password)}
								helperText={
									(Boolean(touched.confirm_password && errors.confirm_password))
										? errors.confirm_password : ''
								}
							/>
						</Grid>
					</Grid>

					<Box mt={5}>
						<Button
							fullWidth
							size="large"
							type="submit"
							color="secondary"
							variant="contained"
							disabled={isSubmitting}
						>
							SUBMIT
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
});

export default connectIntl(mapStateToProps)(JWTResetPassword);