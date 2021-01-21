import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
	Box,
	Tab,
	Tabs,
	Grid,
	Card,
	Paper,
	Button,
	TextField,
	makeStyles,
	CardContent,
} from '@material-ui/core';
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
	},
	btnlanguage: {
		border: '1px solid rgb(52,103,177)',
		marginRight: 5
	}
}));

const FastAnswerAddEditForm = ({ update, fastAnswer, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const validationSchema = Yup.object().shape({
		answer: Yup.string().max(191).required('El campo es requerido'),
	})

	return (
		<Formik
			initialValues={{
				answer: fastAnswer.answer || '',
			}}
			validationSchema={validationSchema}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						const url = `api/innovation/fast_answers/${(update)
													? fastAnswer.id + '/edit' : 'create'}`

						const method = (update) ? 'put' : 'post';
						httpClient[method](url, values)
						.then((response) => {
							console.log(response);
							if(response.status === 1) {
								enqueueSnackbar(
									`Fast answer ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlFastAnswers));
							} else {
								printErrors(response, enqueueSnackbar);
							}
						})
						.catch((err) => {
							console.error(err);
							setIsSubmitting(false);
						})
					} catch (err) {
						console.error(err);
						enqueueSnackbar(
							'Ocurrió un error inesperado. Por favor vuelva a intentar más tarde',
							{ variant: 'error' }
						)
					}
				}
			}
		>
			{({
				errors,
				handleBlur,
				handleSubmit,
				handleChange,
				touched,
				values,
			}) => {
				return (
					<form onSubmit={handleSubmit} className={clsx(classes.root)} >
						<Card>
							<CardContent>
								<Grid container spacing={3} >
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Answer:
									</Grid>
									<Grid item md={7} xs={7} >
										<TextField
											required
											fullWidth
											name="answer"
											variant="outlined"
											onBlur={handleBlur}
											value={values.answer}
											onChange={handleChange}
											error={Boolean(touched.answer && !values.answer)}
											helperText={
												(Boolean(touched.answer && !values.answer))
													? errors.answer : ''
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

FastAnswerAddEditForm.propTypes = {
	fastAnswer: PropTypes.object,
	update: PropTypes.bool,
	className: PropTypes.string,
};

FastAnswerAddEditForm.defaultProps = {
	fastAnswer: {}
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
)(FastAnswerAddEditForm);