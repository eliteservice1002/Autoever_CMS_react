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

/* utils */
import {
	printErrors,
	safeJSONStringify,
} from 'src/utils';
import httpClient from 'src/utils/httpClient';
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

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
	labelInput: {
		alignSelf: 'center',
		textAlign: 'center'
	}
}));

const CategoryAddEditForm = ({ update, category, intl, ...props }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [ nameML, setNameML ] = useState({});
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const {
		urlAPI,
		successMessage,
		successRedirect,
	} = props;

	useEffect(() => {
		if(update) {
			setNameML(category.name || {});
		}
	}, [ update ])

	return (
		<Formik
			initialValues={{
				name: '',
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						let name = safeJSONStringify(nameML);

						if(name.length > 1000) {
							setErrors({ name: formatMessage(intl.maximumCharacters, { characters: 900 }) });
							return;
						}

						const url = `${urlAPI}/${(update)? category.id + '/edit' : 'create'}`
						const method = (update) ? 'put' : 'post';

						httpClient[method](url, { name })
						.then(response => {
							if(response.status === 1) {
								enqueueSnackbar( successMessage, { variant: 'success' } )
								history.push(successRedirect);
							} else {
								printErrors(response, enqueueSnackbar, { ...intl, formatMessage });
								setIsSubmitting(false);
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

				return(
					<form onSubmit={handleSubmit} className={clsx(classes.root)} >
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
										className={clsx(classes.labelInput)}
									>
										{`${formatMessage(intl.name)}:`}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextFieldSwitchLanguage
											propsTextField={{
												name: 'name',
												required: true,
												fullWidth: true,
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={nameML}
											error={errors.name}
											touched={touched.name}
											setValueML={setNameML}
											onChange={handleChange}
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

CategoryAddEditForm.propTypes = {
	update: PropTypes.bool,
	category: PropTypes.object,
	className: PropTypes.string,
	urlAPI: PropTypes.string.isRequired,
	successMessage: PropTypes.string.isRequired,
	successRedirect: PropTypes.string.isRequired,
};

CategoryAddEditForm.defaultProps = {
	category: {}
}


const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoryAddEditForm);
