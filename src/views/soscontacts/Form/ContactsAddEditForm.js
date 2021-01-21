import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
	Box,
	Card,
	Grid,
	Button,
	TextField,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import clsx from 'clsx';
import * as Yup from 'yup';
import Styles from '../style.module.css';
import { useHistory } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

// utils
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

const CustomerEditForm = ({ update, contact, className, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const validationSchema = Yup.object().shape({
		name: Yup.string().max(191).required(),
		name_us: Yup.string().max(191).required(),
		telephone: Yup.number('No es un valor valido').required(),
	})

	return (
		<Formik
			initialValues={{
				name: contact.name || '',
				name_us: contact.name_us || '',
				telephone: contact.telephone || '',
			}}
			onSubmit={
				async (values, {
					resetForm,
					setErrors,
					setStatus,
					setSubmitting,
					...res
				}) => {
					try {
						const method = (update) ? 'put' : 'post';
						const url = `api/soscontacts/${(update) ? contact.id + '/edit' : 'create'}`;

						httpClient[method](url, values)
						.then(response => {
							if(response.status) {
								if(!update) resetForm();

								enqueueSnackbar(
									`SOS Contact ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlSosContacts));
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
				handleBlur,
				handleSubmit,
				handleChange,
				isSubmitting,
				touched,
				values,
			}) => {
				const defaultError = 'El campo es requerido';

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
											name="name"
											label="Nombre"
											variant="outlined"
											onBlur={handleBlur}
											value={values.name}
											onChange={handleChange}
											error={Boolean(touched.name && !values.name)}
											helperText={
												(Boolean(touched.name && !values.name))
													? defaultError : ''
											}
										/>
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<PhoneIcon className={Styles.iconStyle1} />
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<PhoneIcon className={Styles.iconStyle} />
									</Grid>
									<Grid
										item
										md={6}
										xs={12}
									>
										<TextField
											required
											fullWidth
											name="name_us"
											variant="outlined"
											onBlur={handleBlur}
											value={values.name_us}
											label="Nombre(ingles)"
											onChange={handleChange}
											error={Boolean(touched.name_us && !values.name_us)}
											helperText={
												(Boolean(touched.name_us && !values.name_us))
													? defaultError : ''
											}
										/>
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<ShoppingBasketIcon className={Styles.iconStyle1} />
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<ShoppingBasketIcon className={Styles.iconStyle} />
									</Grid>
									<Grid
										item
										md={6}
										xs={12}
									>
										<TextField
											required
											fullWidth
											type="number"
											label="Telefono"
											name="telephone"
											variant="outlined"
											onBlur={handleBlur}
											value={values.telephone}
											onChange={handleChange}
											error={Boolean(touched.telephone && !values.telephone)}
											helperText={
												(Boolean(touched.telephone && !values.telephone))
													? defaultError : ''
											}
										/>
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<FavoriteBorderIcon className={Styles.iconStyle1} />
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<FavoriteBorderIcon className={Styles.iconStyle} />
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<Box mt={2}>
											<Button
												color="secondary"
												variant="contained"
												disabled={isSubmitting}
												onClick={() => history.goBack()}
											>
												Regresar
											</Button>
										</Box>
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<Box mt={2}>
											<Button
												type="submit"
												color="secondary"
												variant="contained"
												disabled={isSubmitting}
											>
												Guardar
											</Button>
										</Box>
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<HomeIcon className={Styles.iconStyle1} />
									</Grid>
									<Grid
										item
										md={3}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<HomeIcon className={Styles.iconStyle} />
									</Grid>
									<Grid item />
								</Grid>
							</CardContent>
						</Card>
					</form>
				)
			}}
		</Formik>
	);
};

CustomerEditForm.propTypes = {
	contact: PropTypes.object,
	className: PropTypes.string
};

CustomerEditForm.defaultProps = {
	contact: {}
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
)(CustomerEditForm);