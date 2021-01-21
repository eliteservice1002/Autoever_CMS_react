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
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

/* utils */
import {
	formatDate,
	printErrors,
	safeJSONStringify,
	formatLanguageToString,
} from 'src/utils';
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
	},
	gridLabel: {
		textAlign: 'center',
		alignSelf: 'center',
	},
	gridLabelGroup: {
		marginLeft: 50,
		textAlign: 'left',
		alignSelf: 'center',
	}
}));

const EventAddEditForm = ({ event, update, intl, currentLanguage, className }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ titleML, setTitleML ] = useState({});
	const [ categoryId, setCategoryId ] = useState('');
	const [ categories, setCategories ] = useState([]);
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	useEffect(() => {
		if(update) {
			setTitleML(event.title || {});
		}
	}, [ update ])

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

	const msgError = [
		formatMessage(intl.theFieldIsRequired),
		formatMessage(intl.maximumCharacters, { characters: 191 }),
	];
	const validationSchema = Yup.object().shape({
		start_date: Yup.date().required(msgError[1]),
		expiration_date: Yup.date().required(msgError[1]),
		location: Yup.string().max(191, msgError[1]).required(msgError[1]),
	})

	return (
		<Formik
			initialValues={{
				title: '',
				location: event.location || '',
				start_date: event.start_date || '',
				published: event.published || false,
				expiration_date: event.expiration_date || '',
				promoted_to_home: event.promoted_to_home || false,
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						let data = { ...values };
						data.event_category_id = categoryId;
						data.start_date = formatDate(values.start_date);
						data.expiration_date = formatDate(values.expiration_date);

						data.title = safeJSONStringify(titleML);

						if(data.title.length > 1000) {
							setErrors({title: formatMessage(intl.maximumCharacters, { characters: 900 }) });
							return;
						}

						const url = `api/event/${(update) ? event.id + '/edit' : 'create'}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, data)
						.then((response) => {
							if(response && response.status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update) ? 'successUpdatedEvent' : 'successAddedEvent']),
									{ variant: 'success' }
								);

								history.push(formatMessage(intl.urlEvents));

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
				handleBlur,
				handleSubmit,
				handleChange,
				touched,
				values,
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
									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`* ${formatMessage(intl.title)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextFieldSwitchLanguage
											propsTextField={{
												name: 'title',
												required: true,
												fullWidth: true,
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={titleML}
											error={errors.title}
											onChange={handleChange}
											touched={touched.title}
											setValueML={setTitleML}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`* ${formatMessage(intl.category)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextField
											select
											required
											fullWidth
											variant="outlined"
											value={categoryId}
											name="event_category_id"
											SelectProps={{ native: true }}
											onChange={ (e) => setCategoryId(e.target.value) }
											error={Boolean(touched.event_category_id && errors.event_category_id)}
											helperText={
												(Boolean(touched.event_category_id && errors.event_category_id))
													? errors.event_category_id : ''
											}
										>
											{categories.map((el) => (
												<option
													key={el.id}
													value={el.id}
												>
													{formatLanguageToString(el.name, currentLanguage)}
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
										{`* ${formatMessage(intl.startDate)}:`}
									</Grid>

									<Grid item md={7} xs={7} className={clsx(classes.gridLabel)} >
										<TextField
											required
											fullWidth
											name='start_date'
											type='datetime-local'
											onChange={handleChange}
											defaultValue={(update) ? formatDate(event.start_date) : ''}
											error={Boolean(touched.start_date && errors.start_date)}
											helperText={
												(Boolean(touched.start_date && errors.start_date))
													? errors.start_date : ''
											}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`* ${formatMessage(intl.endingDate)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextField
											required
											fullWidth
											name='expiration_date'
											type='datetime-local'
											onChange={handleChange}
											defaultValue={(update) ? formatDate(event.expiration_date) : ''}
											error={Boolean(touched.expiration_date && errors.expiration_date)}
											helperText={
												(Boolean(touched.expiration_date && errors.expiration_date))
													? errors.expiration_date : ''
											}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`* ${formatMessage(intl.location)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextField
											required
											fullWidth
											name="location"
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

									<Grid item md={10} xs={10} className={clsx(classes.gridLabelGroup)} >
										{`${formatMessage(intl.publication)}:`}
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`${formatMessage(intl.promotedToHomeQuestion)}`}
									</Grid>

									<Grid item md={7} xs={7} >
										<FormControlLabel
											control={
												<Checkbox
													color="primary"
													name="promoted_to_home"
													onChange={handleChange}
													checked={Boolean(values.promoted_to_home)}
												/>
											}
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`${formatMessage(intl.published)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<FormControlLabel
											control={
												<Checkbox
													color="primary"
													name="published"
													onChange={handleChange}
													checked={Boolean(values.published)}
												/>
											}
											label={formatMessage(intl.yes)}
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
												{formatMessage(intl.goBack)}
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
												{formatMessage(intl.save)}
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

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(EventAddEditForm);