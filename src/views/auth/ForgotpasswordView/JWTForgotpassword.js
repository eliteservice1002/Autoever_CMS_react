import React from 'react';

import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
	Box,
	Grid,
	Button,
	TextField,
	makeStyles,
	FormHelperText,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
	root: {}
}));

const JWTForgotpassword = ({ intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	return (
		<Formik
			initialValues={{
				email: '',
				company_key: ''
			}}
			validationSchema={Yup.object().shape({
				company_key: Yup.string().max(191).required('the company key is required'),
				email: Yup.string().email('Must be a valid email').max(191).required('Email is required'),
			})}
			onSubmit={async (values) => {
				try {
					const { status, msg } = await httpClient.post('api/forgotpass', values);
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
		>
			{({
				errors,
				handleBlur,
				handleChange,
				handleSubmit,
				isSubmitting,
				touched,
				values
			}) => (
				<form onSubmit={handleSubmit} >
					<Grid container spacing={3} >
						<Grid item xs={12} >
							<TextField
								required
								fullWidth
								name="company_key"
								variant="outlined"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.company_key}
								label="Clave de la compañia"
								error={Boolean(touched.company_key && errors.company_key)}
								helperText={
									(Boolean(touched.company_key && errors.company_key))
										? errors.company_key : ''
								}
							/>
						</Grid>

						<Grid item xs={12} >
							<TextField
								required
								fullWidth
								name="email"
								variant="outlined"
								onBlur={handleBlur}
								value={values.email}
								label="Email Address"
								onChange={handleChange}
								error={Boolean(touched.email && errors.email)}
								helperText={
									(Boolean(touched.email && errors.email))
										? errors.email : ''
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

JWTForgotpassword.propTypes = {
	className: PropTypes.string
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
});

export default connectIntl(mapStateToProps)(JWTForgotpassword);