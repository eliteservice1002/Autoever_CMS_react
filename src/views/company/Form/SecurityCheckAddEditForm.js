import React, { useState } from 'react';

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
	center: {
		textAlign: 'center'
	}
}));

const SecurityCheckAddEditForm = ({ update, className, securityCheck, intl }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
		.max(100,formatMessage(intl.maximumCharacters, { characters: 100 }))
		.required(formatMessage(intl.theFieldIsRequired)),
	})

	return (
		<Formik
			initialValues={{
				name: securityCheck.name || '',
			}}
			onSubmit={
				async (values) => {
					setIsSubmitting(true);
					try {
						const url = `api/companies/security-checks/${
							(update)? securityCheck.id + '/edit' : 'create'
						}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, values)
						.then(({ data, status }) => {
							if(status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update)
										? 'successUpdatedSecurityCheck'
										: 'successAddedSecurityCheck'
									]),
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlSecurityCheks));
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
			}) => {
				return(
					<form
						onSubmit={handleSubmit}
						className={clsx(classes.root, className)}
					>
						<Card>
							<CardContent>
								<Grid container spacing={3} >
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`* ${formatMessage(intl.name)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextField
											required
											fullWidth
											name="name"
											variant="outlined"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.name}
											error={Boolean(touched.name && errors.name)}
											helperText={
												(Boolean(touched.name && errors.name))
													? errors.name : ''
											}
										/>
									</Grid>

									<Grid item md={4} xs={12} className={classes.center} ></Grid>

									<Grid item md={2} xs={6} className={classes.center} >
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

									<Grid item md={2} xs={6} className={classes.center} >
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

									<Grid item md={4} xs={12} className={classes.center} ></Grid>
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

SecurityCheckAddEditForm.propTypes = {
	update: PropTypes.bool,
	className: PropTypes.string,
	securityCheck: PropTypes.object,
};

SecurityCheckAddEditForm.defaultProps = {
	securityCheck: {}
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(SecurityCheckAddEditForm);