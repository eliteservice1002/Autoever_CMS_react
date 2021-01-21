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
	},
	btnlanguage: {
		border: '1px solid rgb(52,103,177)',
		marginRight: 5
	}
}));

const CategoryAddEditForm = ({ update, category, intl }) => {

	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ tilteML, setTilteML ] = useState({});

	useEffect(() => {
		if(update) {
			setTilteML(category.title || {});
		}
	}, [update])

	return (
		<Formik
			initialValues={{
				title: '',
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						const url = `api/innovation/categories/${(update)
													? category.id + '/edit' : 'create'}`

						if(safeJSONStringify(tilteML).length > 1000) {
							setErrors({ title: 'La categoría es demasiado larga' });
							return;
						}

						const method = (update) ? 'put' : 'post';
						const response = await httpClient[method](url, { title: tilteML });
						if(response.status) {
							enqueueSnackbar(
								`Categoría ${(update) ? 'Actualizado' : 'Agregada'} con éxito`,
								{ variant: 'success' }
							)
							history.push(formatMessage(intl.urlInnovationBoxCategories));
						} else {
							printErrors(response, enqueueSnackbar);
						}
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
				isSubmitting,
				touched,
				values,
			}) => {
				const defaultError = 'El campo es requerido';

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
										* Título:
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
											valueML={tilteML}
											error={errors.title}
											onChange={handleChange}
											setValueML={setTilteML}
											touched={touched.title}
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

CategoryAddEditForm.propTypes = {
	category: PropTypes.object,
	update: PropTypes.bool,
	className: PropTypes.string,
};

CategoryAddEditForm.defaultProps = {
	category: {}
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
)(CategoryAddEditForm);
