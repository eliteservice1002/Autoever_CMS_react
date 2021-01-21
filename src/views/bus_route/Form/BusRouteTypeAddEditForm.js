import React from 'react';

import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
	Box,
	Grid,
	Card,
	Button,
	TextField,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import { useHistory } from 'react-router';


/* utils */
import httpClient from 'src/utils/httpClient';

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

const BusRouteTypeAddEditForm = ({
	update,
	busRouteType,
	className,
}) => {

	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const validationSchema = Yup.object().shape({
		title: Yup.string().max(191).required(),
	})

	const printErrors = async (errors) => {
		for(let err in errors) {
			await new Promise(resolve => {
				setTimeout(() => {
					try {
						enqueueSnackbar(errors[err], {
							variant: 'error',
						})
						resolve()
					} catch(err) {
						console.log(err)
					}
				}, 1000)
			})
		}
	}


	return (
		<Formik
			initialValues={{
				title: busRouteType.title || '',
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
						const url = `api/bus_route/type/${
							(update)? busRouteType.id + '/edit' : 'create'
						}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, values)
						.then(response => {
							if(response.status) {
								if(!update) resetForm();

								enqueueSnackbar(
									`Tipo ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
									{ variant: 'success' }
								)
							} else {
								printErrors(response);
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
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Titulo:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="title"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.title}
											error={Boolean(touched.title && !values.title)}
											helperText={
												(Boolean(touched.title && !values.title))
													? defaultError : ''
											}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={12}
										style={{ textAlign: 'center' }}
									></Grid>
									<Grid
										item
										md={2}
										xs={6}
										style={{ textAlign: 'center' }}
									>
										<Box mt={2}>
											<Button
												color="secondary"
												variant="contained"
												onClick={() => history.goBack()}
											>
												Regresar
											</Button>
										</Box>
									</Grid>
									<Grid
										item
										md={2}
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
										md={4}
										xs={12}
										style={{ textAlign: 'center' }}
									></Grid>
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

BusRouteTypeAddEditForm.propTypes = {
	busRouteType: PropTypes.object,
	update: PropTypes.bool,
	className: PropTypes.string,
};

BusRouteTypeAddEditForm.defaultProps = {
	busRouteType: {}
}

export default BusRouteTypeAddEditForm;
