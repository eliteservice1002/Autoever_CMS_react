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
	Table,
	Switch,
	Button,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TextField,
	Typography,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import { useHistory } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';

/* utils */
import httpClient from 'src/utils/httpClient';
import { formatDate, printErrors } from 'src/utils';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
	root: {},
	customButton: {
		textAlign: 'center',
	}
}));

const UserroleEditForm = ({ userrole, update, intl }) => {
	const { user } = useAuth();
	const classes = useStyles();
	const history = useHistory();
	const [ roles, setRoles ] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [ modules, setModules ] = useState([]);
	const [ companies, setCompanies ] = useState([]);
	const [ companyId, setCompanyId ] = useState('');
	const [ submitted, setSubmitted ] = useState(false);
	const [ active, setActive ] = useState(userrole.active);
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	useEffect(() => {
		httpClient.get('api/modules')
		.then(({ status, data }) => {
			if(status && data) {
				let modulesTMP = data.map((el) => {
					let newData = {
						...el,
						view: false,
						write: false,
						modify: false,
						delete: false,
						module_id: el.id,
					}
					delete newData.id;
					return newData;
				});

				if(update) {
					userrole.modules.forEach((el) => {
						const { permits } = el;
						let index = modulesTMP.findIndex(
							(item) => item.module_id === el.id
						);
						modulesTMP[index].view = Boolean(permits.view);
						modulesTMP[index].write = Boolean(permits.write);
						modulesTMP[index].modify = Boolean(permits.modify);
						modulesTMP[index].delete = Boolean(permits.delete);
					})
				}
				setModules(modulesTMP);
			}
		})

		httpClient.get('api/companies')
		.then(({ data }) => {
			setCompanies(data);

			if(update) {
				setCompanyId(userrole.company_id)
			} else if(data.length) {
				setCompanyId(
					(user.role === 'SUPERADMIN')
					? data[0].id
					: user.company_id
				);
			}
		})
	}, [])

	const handlePermission = (event, index, type) => {
		let modulesTMP = [ ...modules ];
		let itemTMP = { ...modules[index] };
		const newValue = Boolean(event.target.checked);
		if(type === 'all') {
			itemTMP.view = newValue;
			itemTMP.write = newValue;
			itemTMP.modify = newValue;
			itemTMP.delete = newValue;

		} else {
			itemTMP[type] = newValue;
		}
		modulesTMP[index] = itemTMP;
		setModules(modulesTMP);
	}

	const msgError = [
		formatMessage(intl.theFieldIsRequired),
	];
	const validationSchema = Yup.object().shape({
		active: Yup.boolean(),
		name: Yup.string().max(191).required(msgError[0]),
		description: Yup.string().max(191).required(msgError[0]),
	})

	return (
		<Formik
			validationSchema={validationSchema}
			initialValues={{
				name: userrole.name || '',
				description: userrole.description || '',
				active: Boolean(userrole.active) || false,
			}}
			onSubmit={async (values, { resetForm }) => {
				try {
					setIsSubmitting(true);

					let data = { ...values };

					data.modules = modules.map((el) => {
						return {
							view: el.view,
							write: el.write,
							modify: el.modify,
							delete: el.delete,
							module_id: el.module_id,
						}
					});
					data.company_id = companyId;

					const url = `api/userroles/${(update) ? userrole.id + '/edit' : 'create'}`
					const method = (update) ? 'put' : 'post';

					httpClient[method](url, data)
					.then((response) => {
							if(response && response.status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update) ? 'successUpdatedUserRole' : 'successAddedUserRoles']),
									{ variant: 'success' }
								);

								history.push(formatMessage(intl.urlUserRoles));

							} else {
								setIsSubmitting(false);
								console.error(response);
								printErrors(response, enqueueSnackbar, { ...intl, formatMessage });
							}
						})
						.catch((err) => {
							console.error(err);
							printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
							setIsSubmitting(false);
						})
				} catch(err) {
					console.error(err);
				}
			}}
		>
			{({
				errors,
				handleBlur,
				handleSubmit,
				handleChange,
				touched,
				values
			}) => (
				<form className={clsx(classes.root)} onSubmit={handleSubmit} >
					<Card>
						<CardContent>
							<Grid container spacing={3} >
								<Grid item md={4} xs={12} >
									<TextField
										required
										fullWidth
										name="name"
										variant="outlined"
										value={values.name}
										onBlur={handleBlur}
										onChange={handleChange}
										label={formatMessage(intl.name)}
										helperText={touched.name && errors.name}
										error={Boolean(touched.name && errors.name)}
									/>
								</Grid>
								<Grid item md={4} xs={12} >
									<TextField
										fullWidth
										variant="outlined"
										name="description"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.description}
										label={formatMessage(intl.description)}
										helperText={touched.description && errors.description}
										error={Boolean(touched.description && errors.description)}
									/>
								</Grid>

								{ (user.role === 'SUPERADMIN') &&
									<Grid item md={4} xs={12} >
										<TextField
											select
											required
											fullWidth
											name="company_id"
											value={companyId}
											variant="outlined"
											SelectProps={{ native: true }}
											label={formatMessage(intl.company)}
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
										{formatMessage(intl.activeQuestion)}
									</Typography>
									
									<Switch
										edge="start"
										color="secondary"
										name="activestatus"
										checked={ active ? true : false }
										onChange={(event)=> setActive(event.target.checked) }
									/>
								</Grid>
							</Grid>
							<Grid container spacing={3} >
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>
												{formatMessage(intl.module)}
											</TableCell>

											<TableCell>
												{formatMessage(intl.all)}
											</TableCell>

											<TableCell>
												{formatMessage(intl.view)}
											</TableCell>

											<TableCell >
												{formatMessage(intl.create)}
											</TableCell>

											<TableCell >
												{formatMessage(intl.modify)}
											</TableCell>

											<TableCell >
												{formatMessage(intl.delete)}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{modules.map((el, index) => {
											return (
												<TableRow
													hover
													key={el.module_id}
												>
													<TableCell>
														{el.name}
													</TableCell>
													<TableCell>
														<Checkbox
															checked={(
																el.view &&
																el.write &&
																el.modify &&
																el.delete
															)}
															onChange={(event) => {
																handlePermission(event, index,'all')
															}}
														/>
													</TableCell>
													<TableCell >
														<Checkbox
															checked={el.view}
															onChange={(event) => {
																handlePermission(event, index,'view')
															}}
														/>
													</TableCell>
													<TableCell >
														<Checkbox
															checked={el.write}
															onChange={(event) => {
																handlePermission(event, index,'write')
															}}
														/>
													</TableCell>
													<TableCell >
														<Checkbox
															checked={el.modify}
															onChange={(event) => {
																handlePermission(event, index,'modify')
															}}
														/>
													</TableCell>
													<TableCell >
														<Checkbox
															checked={el.delete}
															onChange={(event) => {
																handlePermission(event, index,'delete')
															}}
														/>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</Grid>
							<Grid item xs={12} className={classes.customButton}>
								<Box mt={4}>
									<Button
										variant="contained"
										color="secondary"
										type="submit"
										disabled={isSubmitting}
									>
										{formatMessage(intl.submit)}
									</Button>
								</Box>
							</Grid>
						</CardContent>
					</Card>
				</form>
			)}
		</Formik>
	);
};

UserroleEditForm.propTypes = {
	userrole: PropTypes.object,
	className: PropTypes.string,
};

UserroleEditForm.defaultProps = {
	userrole: {},
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(UserroleEditForm);