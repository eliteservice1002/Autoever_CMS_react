import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
	Box,
	Grid,
	Card,
	Button,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

/* utils */
import httpClient from 'src/utils/httpClient';
import { safeJSONStringify, printErrors } from 'src/utils';

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

const FaqsAddEditForm = ({ faqs, update, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ answerML, setAnswerML ] = useState({});
	const [ questionML, setQuestionML ] = useState({});

	useEffect(() => {
		if(update) {
			setAnswerML(faqs.answer || {});
			setQuestionML(faqs.question || {});
		}
	}, [update])

	return (
		<Formik
			initialValues={{
				answer: '',
				question: '',
				published: Boolean(faqs.published) || false,
				promoted_to_home: Boolean(faqs.promoted_to_home) || false,
			}}
			onSubmit={ async (values, { setErrors }) => {
					try {
						let data = { ...values };

						if(safeJSONStringify(answerML).length > 1000) {
							setErrors({answer: 'La respuesta es demasiado larga'});
							return;
						}

						if(safeJSONStringify(questionML).length > 1000) {
							setErrors({question: 'La pregunta es demasiado larga'});
							return;
						}

						data.answer = answerML;
						data.question = questionML;

						const url = `api/faqs/${(update) ? faqs.id + '/edit' : 'create'}`;
						const method = (update) ? 'put' : 'post';
						const response = await httpClient[method](url, data);
						if(response.status) {
							enqueueSnackbar(
								`FAQs ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
								{ variant: 'success' }
							)
							history.push(formatMessage(intl.urlFaqs));
						} else {
							printErrors(response, enqueueSnackbar);
						}
					} catch(err) {
						console.error(err);
					}
				}
			}
		>
			{({
				errors,
				values,
				touched,
				handleBlur,
				handleSubmit,
				handleChange,
				isSubmitting,
			}) => {
				return(
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
										* Pregunta:
									</Grid>
									<Grid item md={7} xs={7} >
										<TextFieldSwitchLanguage
											propsTextField={{
												required: true,
												fullWidth: true,
												name: 'question',
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={questionML}
											onChange={handleChange}
											error={errors.question}
											setValueML={setQuestionML}
											touched={touched.question}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										* Respuesta:
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextFieldSwitchLanguage
											propsTextField={{
												required: true,
												name: 'answer',
												fullWidth: true,
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={answerML}
											error={errors.answer}
											onChange={handleChange}
											touched={touched.answer}
											setValueML={setAnswerML}
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
													checked={values.promoted_to_home}
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
													checked={values.published}
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

FaqsAddEditForm.propTypes = {
	faqs: PropTypes.object,
	update: PropTypes.bool,
	className: PropTypes.string,
};

FaqsAddEditForm.defaultProps = {
	faqs: {}
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(FaqsAddEditForm);
