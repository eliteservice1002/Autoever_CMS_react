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
import httpClient from 'src/utils/httpClient';
import Checkbox from '@material-ui/core/Checkbox';
import { formatDate, printErrors } from 'src/utils';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

const CmsusersAddEditForm = ({ cmsuser, update, className, intl }) => {
	const { user } = useAuth();
	const classes = useStyles();
	const history = useHistory();
	const [ roles, setRoles ] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [ roleId, setRoleId ] = useState('');
	const [ companyId, setCompanyId ] = useState('');
	const [ companies, setCompanies ] = useState([]);

	useEffect(() => {
		httpClient.get('api/userroles')
		.then(({ data }) => {
			setRoles(data);

			if(update) {
				setRoleId(cmsuser.userrole_id)
			} else if(data.length) {
				setRoleId(data[0].id);
			}
		})

		httpClient.get('api/companies')
		.then(({ data }) => {
			setCompanies(data);

			if(update) {
				setCompanyId(cmsuser.company_id)
			} else if(data.length) {
				setCompanyId(data[0].id);
			}
		})
	}, [])

	const handleRestPass = (setSubmitting) => {
		setSubmitting(true);
		httpClient.get(`api/cmsusers/resetpass/${cmsuser.id}`)
		.then(({ status }) => {
			setSubmitting(false);
			if(status === 1) {
				enqueueSnackbar(
					'Se envío un email a la cuenta del usuario para que pueda resetear su contraseña',
					{ variant: 'success' }
				)
			} else {
				enqueueSnackbar(
					'Ocurrió un error inesperado. Por favor vuelva a intentar más tarde',
					{ variant: 'error' }
				)
			}
			history.push(formatMessage(intl.urlCmsUsers));
		})
	}

	const msgError = [
		'El campo es requerido',
		'Los emails deben coincidir',
		'el email debe ser un email válido',
	];
	const validationSchema = Yup.object().shape({
		active: Yup.boolean().required(msgError[0]),
		name: Yup.string().max(191).required(msgError[0]),
		employee_number: Yup.string().max(191).required(msgError[0]),
		email: Yup.string().max(191).email(msgError[2]).required(msgError[0]),

		confirmemail: Yup.string().max(191)
			.email(msgError[2])
			.required(msgError[0]).oneOf([Yup.ref('email'), null], msgError[1]),
	})

	return (
		<Formik
			initialValues={{
				name: cmsuser.name || '',
				email: cmsuser.email || '',
				confirmemail: cmsuser.email || '',
				active: Boolean(cmsuser.active) || false,
				employee_number: cmsuser.employee_number || '',
			}}
			onSubmit={
				async (values, {
					resetForm,
					setErrors,
					setStatus,
					setSubmitting,
					...res
				}) => {
					let data = {
						...values,
					};

					data.userrole_id = roleId;
					data.company_id = companyId;

					try {
						const url = `api/cmsusers/${(update) ? cmsuser.id + '/edit' : 'create'}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, data)
						.then(response => {
							if(response.status === 1) {
								if(!update) resetForm();

								enqueueSnackbar(
									`Cms user ${(update) ? 'Actualizado' : 'Agregado'} con éxito`,
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlCmsUsers));
							} else {
								printErrors(response, enqueueSnackbar);
							}
						})
						.catch(err => {
							console.error(err);
						})
					} catch(err) {
						console.error(err);
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
				isSubmitting,
				setSubmitting,
				...rest
			}) => {

				return(
					<form
						onSubmit={handleSubmit}
						className={clsx(classes.root, className)}
					>
						<Card>
							<CardContent>
							<Grid
								container
								spacing={3}
							>
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
										label="Núm. De Empleado"
										value={values.employee_number}
										error={Boolean(touched.employee_number && !values.employee_number)}
										helperText={
											(Boolean(touched.employee_number && !values.employee_number))
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
										required
										fullWidth
										name="name"
										label="Nombre"
										variant="outlined"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.name}
										error={Boolean(touched.name && !values.name)}
										helperText={
											(Boolean(touched.name && !values.name))
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
										name="email"
										label="email"
										variant="outlined"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.email}
										error={Boolean(touched.email && errors.email)}
										helperText={
											(Boolean(touched.email && errors.email))
												? errors.email : ''
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
										variant="outlined"
										name="confirmemail"
										onBlur={handleBlur}
										label="confirmemail"
										onChange={handleChange}
										value={values.confirmemail}
										error={Boolean(touched.confirmemail && errors.confirmemail)}
										helperText={
											(Boolean(touched.confirmemail && errors.confirmemail))
												? errors.confirmemail : ''
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
										name="roleId"
										label="Roles"
										value={roleId}
										variant="outlined"
										SelectProps={{ native: true }}
										onChange={ (e) => setRoleId(e.target.value) }
										error={Boolean(touched.roleId && !values.roleId)}
										helperText={
											(Boolean(touched.roleId && !values.roleId))
												? errors.roleId : ''
										}
									>
										{roles.map((el) => (
											<option key={el.id} value={el.id} >
												{el.name}
											</option>
										))}
									</TextField>
								</Grid>

								{ (user.role === 'SUPERADMIN') &&
									<Grid item md={6} xs={12} >
										<TextField
											select
											required
											fullWidth
											label="Company"
											name="company_id"
											value={companyId}
											variant="outlined"
											SelectProps={{ native: true }}
											onChange={ (e) => setCompanyId(e.target.value) }
											error={Boolean(touched.company_id && !values.company_id)}
											helperText={
												(Boolean(touched.company_id && !values.company_id))
													? errors.company_id : ''
											}
										>
											{companies.map((el) => (
												<option key={el.id} value={el.id} >
													{el.name}
												</option>
											))}
										</TextField>
									</Grid>
								}

								<Grid item md={6} xs={12} >
									<Typography variant="h5" color="textPrimary" >
										Activo?
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
											{`${(update) ? 'UPDATED' : 'CREATE'} CMS USER`}
										</Button>
									</Box>
								</Grid>

								{ update &&
									<Grid item className={classes.customButton} md={6} xs={12} >
										<Box mt={4}>
											<Button 
												size="small"
												type="button"
												color="secondary"
												variant="contained"
												disabled={isSubmitting}
												onClick={() => handleRestPass(setSubmitting)}
											>
												RESET PASSWORD
											</Button>
										</Box>
									</Grid>
								}
							</Grid>
						</CardContent>
						</Card>
					</form>
				)
			}}
		</Formik>
	);
};

CmsusersAddEditForm.propTypes = {
	update: PropTypes.bool,
	cmsuser: PropTypes.object,
	className: PropTypes.string,
};

CmsusersAddEditForm.defaultProps = {
	cmsuser: {},
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

const mapDispatchToProps = (dispatch) => ({
	// 
})

export default connectIntl(
	mapStateToProps,
	mapDispatchToProps
)(CmsusersAddEditForm);