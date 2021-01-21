import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
	Box,
	Grid,
	Card,
	Switch,
	Button,
	TextField,
	Typography,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import { useHistory } from 'react-router';

/* utils */
import { printErrors } from 'src/utils';
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
	root: {
		'& .MuiFormHelperText-root.Mui-required': {
			color: 'red'
		}
	},
	customButton: {
		textAlign: 'center',
	}
}));

const AppusersAddEditForm = ({ appuser, update, intl }) => {
	const { user } = useAuth();
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ languages, setLanguages ] = useState([]);
	const [ languageId, setLanguageId ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	useEffect(() => {
		httpClient.get('api/languages')
		.then(({ data }) => {
			setLanguages(data);

			if(update) {
				setLanguageId(appuser.language.id)
			} else if(data.length) {
				setLanguageId(data[0].id);
			}
		})
	}, [])

	const msgError = [
		formatMessage(intl.theFieldIsRequired),
	];
	const validationSchema = Yup.object().shape({
		active: Yup.boolean().required(msgError[0]),
		// name: Yup.string().max(191).required(msgError[0]),
		password: Yup.string().max(191).when('$update', {
			is: (value) => !update,
			otherwise: Yup.string(),
			then: Yup.string().required(msgError[0]),
		}),
		// location: Yup.string().max(191).required(msgError[0]),
		// department: Yup.string().max(191).required(msgError[0]),
		employee_number: Yup.string().max(191).required(msgError[0]),
	})

	return (
		<Formik
			initialValues={{
				password: '',
				// name: appuser.name || '',
				// location: appuser.location || '',
				// department: appuser.department || '',
				active: Boolean(appuser.active) || false,
				employee_number: appuser.employee_number || '',
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						let data = { ...values };

						data.language_id = languageId;

						if(update && !data.password) delete data.password;

						const url = `api/appusers/${(update) ? appuser.id + '/edit' : 'create'}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, data)
						.then((response) => {
							if(response && response.status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update) ? 'successUpdatedAppuser' : 'successAddedAppuser']),
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlAppuserList));
							} else {
								setIsSubmitting(false);
								console.warn(response);
								printErrors(response, enqueueSnackbar, { ...intl, formatMessage });
							}
						})
						.catch((err) => {
							console.error(err);
							setIsSubmitting(false);
							printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
						})
					} catch(err) {
						console.error(err);
						setIsSubmitting(false);
						enqueueSnackbar(
							formatMessage(intl.unexpectedError),
							{ variant: 'error' }
						)
					}
				}
			}
			validationSchema={validationSchema}
		>
			{({
				errors,
				values,
				touched,
				handleBlur,
				handleSubmit,
				handleChange,
				...rest
			}) => {

				return(
					<form
						onSubmit={handleSubmit}
						className={clsx(classes.root)}
					>
						<Card>
							<CardContent>
							<Grid
								container
								spacing={3}
							>
							{/*
								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										required
										fullWidth
										name="name"
										variant="outlined"
										onBlur={handleBlur}
										value={values.name}
										onChange={handleChange}
										label={formatMessage(intl.name)}
										error={Boolean(touched.name && errors.name)}
										helperText={
											(Boolean(touched.name && errors.name))
												? errors.name : ''
										}
									/>
								</Grid>

								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										required
										fullWidth
										name="location"
										label="Location"
										variant="outlined"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.location}
										error={Boolean(touched.location && errors.location)}
										helperText={
											(Boolean(touched.location && errors.location))
												? errors.location : ''
										}
									/>
								</Grid>

								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										required
										fullWidth
										name="department"
										variant="outlined"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.department}
										label={formatMessage(intl.departament)}
										error={Boolean(touched.department && errors.department)}
										helperText={
											(Boolean(touched.department && errors.department))
												? errors.department : ''
										}
									/>
								</Grid>
							*/}

								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										required
										fullWidth
										variant="outlined"
										onBlur={handleBlur}
										name="employee_number"
										onChange={handleChange}
										value={values.employee_number}
										label={formatMessage(intl.employeeNumber)}
										error={Boolean(touched.employee_number && errors.employee_number)}
										helperText={
											(Boolean(touched.employee_number && errors.employee_number))
												? errors.employee_number : ''
										}
									/>
								</Grid>

								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										fullWidth
										name='password'
										type='password'
										variant='outlined'
										required={!update}
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.password}
										label={(update)
											? formatMessage(intl.leaveEmptyPassword)
											: formatMessage(intl.password)
										}
										error={Boolean(touched.password && errors.password)}
										helperText={
											(Boolean(touched.password && errors.password))
												? errors.password : ''
										}
									/>
								</Grid>

								<Grid
									item
									md={6}
									xs={12}
								>
									<TextField
										select
										required
										fullWidth
										name="languageId"
										value={languageId}
										variant="outlined"
										SelectProps={{ native: true }}
										label={formatMessage(intl.languages)}
										onChange={ (e) => setLanguageId(e.target.value) }
										error={Boolean(touched.languageId && errors.languageId)}
										helperText={
											(Boolean(touched.languageId && errors.languageId))
												? errors.languageId : ''
										}
									>
										{languages.map((el) => (
											<option key={el.id} value={el.id} >
												{el.title}
											</option>
										))}
									</TextField>
								</Grid>

								<Grid item md={6} xs={12} >
									<Typography variant="h5" color="textPrimary" >
										{formatMessage(intl.activeQuestion)}
									</Typography>
									
									<Switch
										edge="start"
										name="active"
										color="secondary"
										onChange={handleChange}
										checked={Boolean(values.active)}
									/>
								</Grid>
							</Grid>

							<Grid container spacing={3} >
								<Grid item md={6} xs={12} className={classes.customButton}>
									<Box mt={4}>
										<Button 
											size="small"
											type="submit"
											color="secondary"
											variant="contained"
											disabled={isSubmitting}
										>
											{(update)
												? formatMessage(intl.update)
												: formatMessage(intl.create)
											}{' '}{formatMessage(intl.appuser)}
										</Button>
									</Box>
								</Grid>
							</Grid>
						</CardContent>
						</Card>
					</form>
				)
			}}
		</Formik>
	);
};

AppusersAddEditForm.propTypes = {
	update: PropTypes.bool,
	appuser: PropTypes.object,
	className: PropTypes.string,
};

AppusersAddEditForm.defaultProps = {
	appuser: {},
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(AppusersAddEditForm);