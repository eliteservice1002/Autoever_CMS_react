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
	Button,
	TextField,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


/* utils */
import httpClient from 'src/utils/httpClient';
import { formatDate, printErrors } from 'src/utils';

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

const EventAddEditForm = ({ event, update, className }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ categoryId, setCategoryId ] = useState('');
	const [ categories, setCategories ] = useState([]);

	useEffect(() => {
		httpClient.get('api/event/categories')
		.then(({ data }) => {
			setCategories(data);

			if(update) {
				setCategoryId(event.event_category_id)
			} else if(data.length) {
				setCategoryId(data[0].id);
			}
		})
	}, [])

	const validationSchema = Yup.object().shape({
		start_date: Yup.date().required(),
		expiration_date: Yup.date().required(),
		title_es: Yup.string().max(191).required(),
		title_en: Yup.string().max(191).required(),
		location: Yup.string().max(191).required(),
	})

	return (
		<Formik
			initialValues={{
				title_es: event.title_es || '',
				title_en: event.title_en || '',
				location: event.location || '',
				start_date: event.start_date || '',
				published: event.published || false,
				expiration_date: event.expiration_date || '',
				promoted_to_home: event.promoted_to_home || false,
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
					data.event_category_id = categoryId;
					data.start_date = formatDate(values.start_date);
					data.expiration_date = formatDate(values.expiration_date);

					try {
						const url = `api/event/${(update) ? event.id + '/edit' : 'create'}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, data)
						.then(response => {
							if(response.status) {
								if(!update) resetForm();

								enqueueSnackbar(
									`Event ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
									{ variant: 'success' }
								)
								history.goBack();
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
				...rest
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
										* Título:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="title_es"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.title_es}
											error={Boolean(touched.title_es && !values.title_es)}
											helperText={
												(Boolean(touched.title_es && !values.title_es))
													? defaultError : ''
											}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Título (inglés):
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="title_en"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.title_en}
											error={Boolean(touched.title_en && !values.title_en)}
											helperText={
												(Boolean(touched.title_en && !values.title_en))
													? defaultError : ''
											}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Categoría:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											select
											required
											fullWidth
											variant="outlined"
											value={categoryId}
											name="event_category_id"
											SelectProps={{ native: true }}
											onChange={ (e) => setCategoryId(e.target.value) }
											error={Boolean(touched.event_category_id && !values.event_category_id)}
											helperText={
												(Boolean(touched.event_category_id && !values.event_category_id))
													? defaultError : ''
											}
										>
											{categories.map((el) => (
												<option
													key={el.id}
													value={el.id}
												>
													{el.category_es}
												</option>
											))}
										</TextField>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Fecha de inicio:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name='start_date'
											type='datetime-local'
											onChange={handleChange}
											defaultValue={(update) ? formatDate(event.start_date) : ''}
											error={Boolean(touched.start_date && !values.start_date)}
											helperText={
												(Boolean(touched.start_date && !values.start_date))
													? defaultError : ''
											}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Fecha de fin:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name='expiration_date'
											type='datetime-local'
											onChange={handleChange}
											defaultValue={(update) ? formatDate(event.expiration_date) : ''}
											error={Boolean(touched.expiration_date && !values.expiration_date)}
											helperText={
												(Boolean(touched.expiration_date && !values.expiration_date))
													? defaultError : ''
											}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Ubicación:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="location"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.location}
											error={Boolean(touched.location && !values.location)}
											helperText={
												(Boolean(touched.location && !values.location))
													? defaultError : ''
											}
										/>
									</Grid>

									<Grid
										item
										md={10}
										xs={10}
										style={{ textAlign: 'left', alignSelf: 'center', marginTop: 30 }}
									>
										Publicación:
									</Grid>
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										Promoted to Home?:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<FormControlLabel
											control={
												<Checkbox
													color="primary"
													name="promoted_to_home"
													onChange={handleChange}
													checked={Boolean(values.promoted_to_home)}
												/>
											}
											label="Si"
										/>
									</Grid>
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										Publicado:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<FormControlLabel
											control={
												<Checkbox
													color="primary"
													name="published"
													onChange={handleChange}
													checked={Boolean(values.published)}
												/>
											}
											label="Si"
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

EventAddEditForm.propTypes = {
	update: PropTypes.bool,
	event: PropTypes.object,
	className: PropTypes.string,
};

EventAddEditForm.defaultProps = {
	event: {},
}

export default EventAddEditForm;
