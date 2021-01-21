import React, { useState, useEffect, useRef } from 'react';

import clsx from 'clsx';
import axios from 'axios';
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
import JSZip from 'jszip'


/* utils */
import httpClient from 'src/utils/httpClient';
import { formatDate, printErrors } from 'src/utils';

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

const BusRouteAddEditForm = ({ busRoute, update, className, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const _archiveRef = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const [ typeId, setTypeId ] = useState('');
	const [ types, setTypes ] = useState([]);
	const [ stops, setStops ] = useState([]);
	const [ coordinates, setCoordinates ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	useEffect(() => {
		httpClient.get('api/bus_route/type')
		.then(({ data }) => {
			setTypes(data);

			if(update) {
				setTypeId(busRoute.bus_route_type_id)
			} else if(data.length) {
				setTypeId(data[0].id);
			}
		})
	}, [])

	const handleFile = (e, setField) => {
		setCoordinates('');
		e.preventDefault();

		let { name, files } = e.target
		let file = files[0]
		let extension = file.name.split('.').pop()
		let tempStops = []
		if(extension != 'kmz') {
			enqueueSnackbar(
				`Tipo de archivo invalido`,
				{ variant: 'danger' }
			)
			return;
		}
		var zip = new JSZip()
		zip.loadAsync(file).then(function(contents) {
			Object.keys(contents.files).forEach(function(filename) {
				zip.file(filename).async('nodebuffer').then(function(content) {
					var xmlString = new TextDecoder('utf-8').decode(content);
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(xmlString,'text/xml');
					var folderDocs = xmlDoc.getElementsByTagName('Folder');
					var folderDoc = folderDocs[0];

					// Coordinates
					try {
						let coordinatesTMP = folderDoc
							.querySelector('Placemark LineString coordinates').childNodes[0].nodeValue;
						setCoordinates(coordinatesTMP);
					} catch(err) {
						console.error(err);
					}

					folderDoc.getElementsByTagName('Placemark').forEach((stopItem) => {
						if(!stopItem.getElementsByTagName('ExtendedData').length) return;

						var tempStop = {};
						var dataDoc = stopItem.getElementsByTagName('ExtendedData')[0];
						var finalDoc = dataDoc.getElementsByTagName('Data');

						tempStop.title = stopItem.getElementsByTagName('name')[0].childNodes[0].nodeValue
						finalDoc.forEach((dataItem) => {
							switch(dataItem.getAttribute('name')) {
								case 'REREFENCIA':
									tempStop.reference = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
								case 'HORARIO 1':
								case 'HORARIO  1':
									tempStop.shift1 = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
								case 'HORARIO 2':
								case 'HORARIOS 2':
									tempStop.shift2 = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
								case 'HORARIO 3':
								case 'HORARIOS  3':
									tempStop.shift3 = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
								case 'LATITUD':
									tempStop.lat = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
								case 'LONGITUD':
									tempStop.lng = dataItem.getElementsByTagName('value')[0].childNodes[0].nodeValue
									break;
							}
						})
						tempStops.push(tempStop)
					})
				});
			});
		});
	
		setStops(tempStops)

		if(file) {
			setField(name, {
				file,
				filename: file.name,
			})
		} else {
			setField(name, null);
		}
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
				case 'published':
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
		formData.append('coordinates', coordinates);
		formData.append('stops',JSON.stringify(stops));

		return formData;
	}

	const validationSchema = Yup.object().shape({
		title: Yup.string().max(191).required(),
		bus_location_shift1_key: Yup.string().max(191).required(),
		kmz_file: Yup.string().max(191).required(),
	})

	return (
		<Formik
			initialValues={{
				title: busRoute.title || '',
				bus_route_type_id: busRoute.bus_route_type_id || '',
				kmz_file: (busRoute.kmz_file)
						? { filename: busRoute.kmz_file } : null,
				bus_location_shift1_key: busRoute.bus_location_shift1_key || '',
				bus_location_shift2_key: busRoute.bus_location_shift2_key || '',
				bus_location_shift3_key: busRoute.bus_location_shift3_key || '',
				published: busRoute.published || false,
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						let data = { ...values };
						data.bus_route_type_id = typeId;

						let errors = {};

						if(data.kmz_file && data.kmz_file.file) {
							data.kmz_file = data.kmz_file.file;
						} else if(!update) {
							errors.kmz_file = true;
						} else {
							delete data.kmz_file;
						}

						if(Object.keys(errors).length) {
							setErrors(errors);
							setIsSubmitting(false);
							return;
						}

						let url = `api/bus_route/${(update) ? busRoute.id + '/edit' : 'create'}`
						httpClient.postFile(url, serealizeData(data))
						.then(({ data }) => {
							if(data.status === 1) {
								enqueueSnackbar(
									`Bus Route ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlBusRoutesList));
							}
						})
						.catch((err) => {
							console.error(err);
							printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
							setIsSubmitting(false);
						})
					} catch(err) {
						console.error(err);
						enqueueSnackbar(
							'Ocurrió un error inesperado. Por favor vuelva a intentar más tarde',
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
				setFieldValue,
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
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Tipo:
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
											value={typeId}
											name="bus_route_type_id"
											SelectProps={{ native: true }}
											onChange={ (e) => setTypeId(e.target.value) }
										>
											{types.map((el) => (
												<option
													key={el.id}
													value={el.id}
												>
													{el.title}
												</option>
											))}
										</TextField>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
									>
										* Archivo(kmz):
									</Grid>
									<Grid item md={7} xs={7} >
										<div className="previewComponent">
											<input className="fileInput"
												type="file"
												accept='.kmz'
												ref={_archiveRef}
												name='kmz_file'
												style={{ display: 'none' }}
												onChange={(e) => handleFile(e, setFieldValue)}
											/>
											<TextField
												required
												disabled
												fullWidth
												variant="outlined"
												name="kmz_file"
												value={
													(
															values.kmz_file &&
															values.kmz_file.filename &&
															values.kmz_file.file
														)
															? values.kmz_file.filename
															: (busRoute.kmz_file)
															? busRoute.kmz_file
															: ''
												}
												error={Boolean(touched.kmz_file && !values.kmz_file)}
												helperText={
													(Boolean(touched.kmz_file && !values.kmz_file))
														? defaultError : ''
												}
											/>
											<Button variant="contained" color="primary"
												onClick={() => { _archiveRef.current.click() }}
												style={{ marginTop: 10 }}
											>
												Choose file
										</Button>
										</div>
									</Grid>

									<Grid
										item
										md={10}
										xs={10}
										style={{ textAlign: 'left', alignSelf: 'center', marginTop: 30 }}
									>
										Bus location key:
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Clave Turno 1:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="bus_location_shift1_key"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.bus_location_shift1_key}
											error={Boolean(touched.bus_location_shift1_key && !values.bus_location_shift1_key)}
											helperText={
												(Boolean(touched.bus_location_shift1_key && !values.bus_location_shift1_key))
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
										Clave Turno 2:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											fullWidth
											name="bus_location_shift2_key"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.bus_location_shift2_key}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										Clave Turno 3:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											fullWidth
											name="bus_location_shift3_key"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.bus_location_shift3_key}
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

BusRouteAddEditForm.propTypes = {
	update: PropTypes.bool,
	busRoute: PropTypes.object,
	className: PropTypes.string,
};

BusRouteAddEditForm.defaultProps = {
	busRoute: {},
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
)(BusRouteAddEditForm);