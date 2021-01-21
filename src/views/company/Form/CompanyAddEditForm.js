import React, { useState, useEffect, Fragment, useRef } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { ChromePicker } from 'react-color';
import {
	Box,
	Card,
	Grid,
	Button,
	Checkbox,
	TextField,
	CardMedia,
	Typography,
	makeStyles,
	CardHeader,
	CardContent,
	CardActionArea,
	FormControlLabel
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

/* utils */
import httpClient from 'src/utils/httpClient';
import { formatDate, printErrors, safeJSONStringify } from 'src/utils';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => {
	return {
		root: {
			'& .MuiCardMedia-root': {
				marginBottom: '20px',
			}
		},
		chromePicker: {
			margin: 'auto',
		},
		customButton: {
			textAlign: 'center',
		},
		media: {},
		divide: {},
		activeModules: {},
		labelModules: {},
		labelInput: {
			alignSelf: 'center'
		},
		customImgPreview: {
			width: '140px',
			height: '70px',
			position: 'relative',
			overflow: 'hidden',
		},
		customImgHome: {
			width: '360px',
			height: '260px',
			position: 'relative',
			overflow: 'hidden',
		},
		customLabelDivideFont: {
			fontSize: '1rem',
			fontWeight: '400',
			fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
		}
	}
});

const CompanyEditForm = ({ company, update, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const _fullColorBGRef = useRef(null);
	const isMountedRef = useIsMountedRef();
	const _logoFullColorRef = useRef(null);
	const _logoTransparentRef = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const _transparentColorBGRef = useRef(null);
	const [ modules, setModules ] = useState([]);
	const [ languages, setLanguages ] = useState([]);
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ securityChecks, setSecurityChecks ] = useState([]);
	const [ selectedSecurityCheck, setSelectedSecurityCheck ] = useState([]);

	useEffect(() => {
		httpClient.get('api/languages')
		.then(({ data }) => {
			setLanguages(data);
		})

		httpClient.get('api/companies/security-checks')
		.then(({ data }) => {
			setSecurityChecks(data ?? []);
			if(update && company.security_checks) {
				company.security_checks.forEach((el) => {
					setSelectedSecurityCheck((prevState) => {
						return [...prevState, parseInt(el.id)];
					})
				})
			}
		})
	}, [])

	useEffect(() => {
		if(languages.length && !modules.length) {
			httpClient.get('api/modules')
			.then(({ status, data}) => {
				if(status){
					let multilanguageObj = {};
					languages.forEach((el) => {
						multilanguageObj[el.cod] = '';
					});

					let dataTMP = data.map((el) => {
						let name = {};
						let active = false;

						if(update) {
							let index = company.modules.findIndex(
								(item) => item.id === el.id
							);

							if(index >= 0) {
								name = company.modules[index].name ?? {};
								active = Boolean(company.modules[index].active);
							}
						}

						let newData = {
							...el,
							name,
							active,
							label: el.name,
							module_id: el.id,
						}
						delete newData.id;
						return newData;
					})

					setModules(dataTMP);
				}
			})
			.catch((error) => {
					console.error(error);
			});
		}
	}, [languages]);

	const msgError = [
		'El campo es requerido',
	];
	const validationSchema = Yup.object().shape({
		active: Yup.boolean().required(msgError[0]),
		key: Yup.string().max(191).required(msgError[0]),
		name: Yup.string().max(191).required(msgError[0]),
	})

	const LabelInput = (label, props = {}) => {
		return(
			<Grid 
				item xs={12} sm={5}
				className={clsx(classes.labelInput)}
				{ ...props }
			>
				{label}
			</Grid>
		);
	}

	const handleChangeSecurityCheck = (e) => {
		let { target } = e;
		if(target.checked) {
			setSelectedSecurityCheck((prevState) => {
				return [...prevState, parseInt(target.value)];
			})
		} else {
			setSelectedSecurityCheck((prevState) => {
				return prevState.filter((el) => {
					return el != parseInt(target.value)
				})
			})
		}
	}

	const handleImage = (event, setField) => {
		event.preventDefault();

		let reader = new FileReader();
		let { name, files } = event.target;
		let file = files[0];

		if(file) {
			reader.onloadend = () => {
				setField(name, {
					file,
					url: reader.result,
				})
			}
			reader.readAsDataURL(file)
		} else {
			setField(name, null);
		}
	}

	const renderBackgroundImageSection = (props) => {

		const {
			values,
			errors,
			touched,
			URL_ASSETS,
			handleBlur,
			handleChange,
			setFieldValue,
		} = props;

		return(
			<Grid item xs={12} >
				<Card>
					<CardHeader title="Background Images:" />
					<Divider className={clsx(classes.divide)} />
					<CardContent>
						<CardActionArea onClick={() => { _fullColorBGRef.current.click() }} >
							<input
								type="file"
								accept='image/*'
								ref={_fullColorBGRef}
								name='full_background_path'
								style={{ display: 'none' }}
								onChange={(e) => handleImage(e, setFieldValue)}
							/>
							<CardMedia
								component='img'
								className={classes.media}
								title="full color background image"
								image={
									(
										values.full_background_path &&
										values.full_background_path.url &&
										values.full_background_path.file
									)
										? values.full_background_path.url
										: (company.full_background_path)
										? URL_ASSETS + company.full_background_path
										: '/static/images/480x330.png'
								}
							/>
						</CardActionArea>
						<Button variant="contained" color="primary"
								onClick={() => { _fullColorBGRef.current.click() }}
							>
								Choose full color background
						</Button>
					</CardContent>

					<CardContent>
						<CardActionArea onClick={() => { _transparentColorBGRef.current.click() }} >
							<input
								type="file"
								accept='image/*'
								ref={_transparentColorBGRef}
								name='transparent_background_path'
								style={{ display: 'none' }}
								onChange={(e) => handleImage(e, setFieldValue)}
							/>
							<CardMedia
								component='img'
								className={classes.media}
								title="Transparent color background image"
								image={
									(
										values.transparent_background_path &&
										values.transparent_background_path.url &&
										values.transparent_background_path.file
									)
										? values.transparent_background_path.url
										: (company.transparent_background_path)
										? URL_ASSETS + company.transparent_background_path
										: '/static/images/480x330.png'
								}
							/>
						</CardActionArea>
						<Button variant="contained" color="primary"
								onClick={() => { _transparentColorBGRef.current.click() }}
							>
								Choose Transparent color background
						</Button>
					</CardContent>
				</Card>
			</Grid>
		);
	}

	const renderBrandingSection = (props) => {
		const {
			values,
			errors,
			touched,
			handleBlur,
			handleChange,
			setFieldValue,
		} = props;

		return(
			<Grid item xs={12} >
				<Card>
					<CardHeader title="Branding" />
					<Divider className={clsx(classes.divide)} />
					<CardContent>
						<Grid container justify={'center'} spacing={3} >
							{ LabelInput('Color primary:', {xs:12, sm:12}) }
							<Grid item xs={12} >
								<ChromePicker
									color={values.primary_color}
									className={classes.chromePicker}
									onChangeComplete={(color) => {
										setFieldValue('primary_color', color.hex)
									}}
								/>
							</Grid>
						</Grid>
					</CardContent>

					<Divider/>

					<CardContent>
						<Grid container justify={'center'} spacing={3} >
							{ LabelInput('Color secondary:', {xs:12, sm:12}) }
							<Grid item xs={12} >
								<ChromePicker
									color={values.secondary_color}
									className={classes.chromePicker}
									onChangeComplete={(color) => {
										setFieldValue('secondary_color', color.hex)
									}}
								/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		);
	}

	const serealizeData = (data, update = false) => {
		let formData = new FormData();

		if(update){
			// update...
			// Logic that applies only when editing
		} else {
			// create...
			// Logic that applies only when creating
		}
		// Logic that applies both when creating and editing
		for(const input in data) {
			switch (input) {
				// this is used for when you want
				// to treat a field differently from the rest
				case 'custom_field':
					break;
				case 'modules':
					formData.append(input, safeJSONStringify(data[input]));
					break;
				case 'active':
					formData.append(input, (data[input]) ? 1 : 0);
					break;
				default:
					try {
							data[input] && formData.append(input, data[input]);
					} catch(err) {
						console.error(err)
					}
			}
		}

		return formData;
	}

	return (
		<Formik
			initialValues={{
				key: company.key || '',
				name: company.name || '',
				slogan: company.slogan || '',
				sap_auth_url: company.sap_auth_url || '',
				active: Boolean(company.active) || false,
				sap_payroll_url: company.sap_payroll_url || '',
				sap_payslip_url: company.sap_payslip_url || '',
				primary_color: company.primary_color || '#ad9f32',
				payroll_disclaimer: company.payroll_disclaimer || '',
				sap_attendance_url: company.sap_attendance_url || '',
				secondary_color: company.secondary_color || '#325AAD',
				// Imagenes
				full_logo_path: (company.full_logo_path)
						? { url: company.full_logo_path } : null,
				transparent_logo_path: (company.transparent_logo_path)
						? { url: company.transparent_logo_path } : null,
				full_background_path: (company.full_background_path)
						? { url: company.full_background_path } : null,
				transparent_background_path: (company.transparent_background_path)
						? { url: company.transparent_background_path } : null,
			}}
			validationSchema={validationSchema}
			onSubmit={async (values, { setErrors }) => {
				try {
					setIsSubmitting(true);
					let data = { ...values };
					data.modules = modules.map((el) => {
						let newEl = { ...el };
						delete newEl.label;
						return newEl;
					});

					if(selectedSecurityCheck.length) {
						data.securityChecks = selectedSecurityCheck;
					}

					let errors = {};

					let validateImages = (images, data, update) => {
						let errors = {};
						images.forEach((el) => {
							const [ name, image ] = el;

							if(image && image.file) {
								data[name] = image.file;
							} else {
								delete data[name];
							}
						});
						return { errors, data };
					}

					let resultValidate = validateImages([
						['full_logo_path', data.full_logo_path],
						['full_background_path', data.full_background_path],
						['transparent_logo_path', data.transparent_logo_path],
						['transparent_background_path', data.transparent_background_path],
					], data, update);

					Object.assign(data, resultValidate.data);
					Object.assign(errors, resultValidate.errors);

					if(Object.keys(errors).length) {
						setErrors(errors);
						setIsSubmitting(false);
						return;
					}

					let url = `api/companies/${(update) ? company.id + '/edit' : 'create'}`;

					httpClient.postFile(url, serealizeData(data))
					.then(({ data }) => {
						if(data.status === 1) {
							enqueueSnackbar(
								`Compañia ${(update) ? 'Actualizada' : 'Agregada'} con éxito`,
								{ variant: 'success' }
							)
							history.push(formatMessage(intl.urlCompanies));
						}
					}).catch((err) => {
						console.error(err);
						printErrors(err.response.data, enqueueSnackbar);

						setIsSubmitting(false);
					})
				} catch (err) {
					console.error(err);
					setIsSubmitting(false);
					enqueueSnackbar(
						'Ocurrió un error inesperado. Por favor vuelva a intentar más tarde',
						{ variant: 'error' }
					);
				}
			}}
		>
			{({
				errors,
				values,
				touched,
				handleBlur,
				handleSubmit,
				handleChange,
				setFieldValue,
			}) => {
				const URL_ASSETS = process.env.REACT_APP_BASE_URL;

				return(
					<form className={clsx(classes.root)} onSubmit={handleSubmit} >
						<Grid container spacing={3} >
							<Grid item lg={7} xl={8} xs={12} >
								<Grid container spacing={3} >
									<Grid item xs={12} >
										<Card>
											<CardHeader title="Información General:" />
											<Divider className={clsx(classes.divide)} />
											<CardContent>
												<Grid container spacing={3} >
													{ LabelInput('Nombre: *') }
													<Grid item xs={12} sm={7} >
														<TextField
															required
															fullWidth
															name="name"
															variant="outlined"
															onBlur={handleBlur}
															value={values.name}
															onChange={handleChange}
															error={Boolean(touched.name && !values.name)}
															helperText={
																(Boolean(touched.name && !values.name))
																	? errors.name : ''
															}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('Slogan:') }
													<Grid item xs={12} sm={7} >
														<TextField
															fullWidth
															name="slogan"
															variant="outlined"
															onBlur={handleBlur}
															value={values.slogan}
															onChange={handleChange}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('Clave empresa: *') }
													<Grid item xs={12} sm={7} >
														<TextField
															required
															fullWidth
															name="key"
															variant="outlined"
															value={values.key}
															onBlur={handleBlur}
															onChange={handleChange}
															error={Boolean(touched.key && !values.key)}
															helperText={
																(Boolean(touched.key && !values.key))
																	? errors.key : ''
															}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('Payroll disclaimer:') }
													<Grid item xs={12} sm={7} >
														<TextField
															rows={5}
															fullWidth
															multiline
															variant="outlined"
															onBlur={handleBlur}
															onChange={handleChange}
															name="payroll_disclaimer"
															value={values.payroll_disclaimer}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('ERP auth url:') }
													<Grid item xs={12} sm={7} >
														<TextField
															fullWidth
															variant="outlined"
															name="sap_auth_url"
															onBlur={handleBlur}
															onChange={handleChange}
															value={values.sap_auth_url}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('ERP attendance url:') }
													<Grid item xs={12} sm={7} >
														<TextField
															fullWidth
															variant="outlined"
															onBlur={handleBlur}
															onChange={handleChange}
															name="sap_attendance_url"
															value={values.sap_attendance_url}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('ERP payroll url:') }
													<Grid item xs={12} sm={7} >
														<TextField
															fullWidth
															variant="outlined"
															onBlur={handleBlur}
															name="sap_payroll_url"
															onChange={handleChange}
															value={values.sap_payroll_url}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={3} >
													{ LabelInput('ERP payslip url:') }
													<Grid item xs={12} sm={7} >
														<TextField
															fullWidth
															variant="outlined"
															onBlur={handleBlur}
															name="sap_payslip_url"
															onChange={handleChange}
															value={values.sap_payslip_url}
														/>
													</Grid>
												</Grid>

												{(!securityChecks.length) ? null :
													<Grid container spacing={3} >
														{ LabelInput('Security check:') }
														<Grid item xs={12} sm={7} >
															{securityChecks.map((el) => {
																return(
																	<Grid key={el.id} item xs={12}>
																		<FormControlLabel
																			control={
																				<Checkbox
																					value={el.id}
																					color="primary"
																					onChange={handleChangeSecurityCheck}
																					checked={selectedSecurityCheck.includes(el.id)}
																				/>
																			}
																			label={el.name}
																		/>
																	</Grid>
																);
															})}
														</Grid>
													</Grid>
												}

												<Grid container spacing={3} >
													{ LabelInput('Activo:') }
													<Grid item xs={12} sm={7} >
														<FormControlLabel
															control={
																<Checkbox
																	color="primary"
																	name="active"
																	onChange={handleChange}
																	checked={Boolean(values.active)}
																/>
															}
															label="Si"
														/>
													</Grid>
												</Grid>
											</CardContent>
										</Card>
									</Grid>

									<Grid item xs={12} >
										<Card>
											<CardHeader title="Configuración de módulos" />
											<Divider className={clsx(classes.divide)} />
											<CardContent>
												{modules.map((el) => {
													const ID = el.module_id

													const setValueML = (getState) => {
														let state = getState();
														setModules((prevState) => {
															let newState = [ ...prevState ];
															let index = prevState.findIndex(
																(item) => item.module_id === ID
															);

															if(index >= 0) {
																Object.assign(newState[index].name, state);
															}
															return newState;
														})
													}

													const handleChangeModules = (e) => {
														setModules((prevState) => {
															let newState = [ ...prevState ];
															let index = prevState.findIndex(
																(item) => item.module_id === ID
															);

															if(index >= 0) {
																newState[index].active = !newState[index].active
															}

															return newState;
														})
													}

													return(
														<Grid key={el.module_id} container spacing={3} alignItems="center" >
															{ LabelInput(el.label, {
																sm:3, xs:8,
																className:  classes.labelModules
															}) }
															<Grid className={classes.activeModules} item xs={4} sm={2} >
																<FormControlLabel
																	control={
																		<Checkbox
																			color="primary"
																			checked={el.active}
																			onChange={handleChangeModules}
																			name={`active-${el.module_id}`}
																		/>
																	}
																	label="Activar"
																/>
															</Grid>
															<Grid item xs={12} sm={7} >
																<TextFieldSwitchLanguage
																	propsTextField={{
																		fullWidth: true,
																		name: 'modules',
																		onBlur: handleBlur,
																		variant: 'outlined',
																	}}
																	valueML={el.name}
																	onChange={handleChange}
																	setValueML={setValueML}
																/>
															</Grid>
														</Grid>
													);
												})}
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</Grid>

							<Grid item lg={5} xl={4} xs={12} >
								<Grid container spacing={3} >
									{renderBrandingSection({
										errors,
										values,
										touched,
										handleBlur,
										handleChange,
										setFieldValue,
									})}

									<Grid item xs={12} >
										<Card>
											<CardHeader title="Logos:" />
											<Divider className={clsx(classes.divide)} />
											<CardContent>
												<CardActionArea onClick={() => { _logoFullColorRef.current.click() }} >
													<input
														type="file"
														accept='image/*'
														name='full_logo_path'
														ref={_logoFullColorRef}
														style={{ display: 'none' }}
														onChange={(e) => handleImage(e, setFieldValue)}
													/>
													<CardMedia
														component='img'
														title="Logo full color"
														className={classes.media}
														image={
															(
																values.full_logo_path &&
																values.full_logo_path.url &&
																values.full_logo_path.file
															)
																? values.full_logo_path.url
																: (company.full_logo_path)
																? URL_ASSETS + company.full_logo_path
																: '/static/images/240x150.png'
														}
													/>
												</CardActionArea>
												<Button variant="contained" color="primary"
														onClick={() => { _logoFullColorRef.current.click() }}
													>
														Choose full color logo
												</Button>
											</CardContent>

											<CardContent>
												<CardActionArea onClick={() => { _logoTransparentRef.current.click() }} >
													<input
														type="file"
														accept='image/*'
														ref={_logoTransparentRef}
														style={{ display: 'none' }}
														name='transparent_logo_path'
														onChange={(e) => handleImage(e, setFieldValue)}
													/>
													<CardMedia
														component='img'
														className={classes.media}
														title="Transparent color logo"
														image={
															(
																values.transparent_logo_path &&
																values.transparent_logo_path.url &&
																values.transparent_logo_path.file
															)
																? values.transparent_logo_path.url
																: (company.transparent_logo_path)
																? URL_ASSETS + company.transparent_logo_path
																: '/static/images/240x150.png'
														}
													/>
												</CardActionArea>
												<Button variant="contained" color="primary"
														onClick={() => { _logoTransparentRef.current.click() }}
													>
														Choose transparent color logo
												</Button>
											</CardContent>
										</Card>
									</Grid>

									{renderBackgroundImageSection({
										errors,
										values,
										touched,
										URL_ASSETS,
										handleBlur,
										handleChange,
										setFieldValue,
									})}
								</Grid>
							</Grid>

							<Grid container alignItems={'center'} justify={'center'} spacing={3} >
								<Grid item lg={7} xl={8} xs={12} >
										<Button
											type="submit"
											color="primary"
											variant="contained"
											disabled={isSubmitting}
										>
											Guardar
										</Button>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)
			}}
		</Formik>
	);
};

CompanyEditForm.propTypes = {
	company: PropTypes.object,
	className: PropTypes.string,
};

CompanyEditForm.defaultProps = {
	company: {}
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CompanyEditForm);