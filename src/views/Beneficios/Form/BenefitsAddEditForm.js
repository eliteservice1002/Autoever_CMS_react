import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
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
import * as Yup from 'yup';
import axios from 'axios';
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
	imgPreview: {
		width: 80,
		marginTop: '2vh'
	},
	imgPreview1: {
		width: 180,
		marginTop: '2vh'
	}
}));


const BenefitsAddEditForm = ({ benefit, update, intl, currentLanguage }) => {
	const classes = useStyles();
	const history = useHistory();
	const _logoFileRef = useRef(null);
	const _mainPictureFileRef = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const [ promoML, setPromoML ] = useState({});
	const [ categoryId, setCategoryId ] = useState('');
	const [ categories, setCategories ] = useState([]);
	const [ descriptionML, setDescriptionML ] = useState({});
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	useEffect(() => {
		if(update) {
			setPromoML(benefit.promo || {});
			setDescriptionML(benefit.description || {});
		}
	}, [ update ])

	useEffect(() => {
		httpClient.get('api/benefits/categories')
		.then(({ data }) => {
			setCategories(data);

			if(update) {
				setCategoryId((benefit.benefit_category_id)
					? benefit.benefit_category_id : data[0].id
				)
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
		trade: Yup.string().max(191, msgError[1]).required(msgError[0]),
	})

	const handleImage = (event, setField) => {
		event.preventDefault();

		let reader = new FileReader();
		let { name, files } = event.target;
		let file = files[0];

		if(file) {
			reader.onloadend = () => {
				setField(name, {
					file,
					url: reader.result,
				})
			}
			reader.readAsDataURL(file)
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
				case 'expires':
				case 'published':
				case 'promoted_to_home':
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

		return formData;
	}

	return (
		<Formik
			initialValues={{
				promo: '',
				description:'',
				trade: benefit.trade || '',
				expires: benefit.expires || false,
				published: Boolean(benefit.published) || false,
				expiration_date: benefit.expiration_date || '',
				promoted_to_home: Boolean(benefit.promoted_to_home) || false,
				// Images
				logo_path: (benefit.logo_path)
						? { url: benefit.logo_path } : null,
				main_picture_path: (benefit.main_picture_path)
						? { url: benefit.main_picture_path } : null,
			}}
			onSubmit={
				async (values, {
					resetForm,
					setErrors,
					setStatus,
					...res
				}) => {
					try {
						setIsSubmitting(true);
						let data = { ...values };
						data.benefit_category_id = categoryId;

						if(data.expiration_date) {
							data.expiration_date = formatDate(data.expiration_date);
						} else {
							delete data.expiration_date
						}

						let errors = {};

						if(data.logo_path && data.logo_path.file) {
							data.logo_path = data.logo_path.file;
						} else if(!update) {
							errors.logo_path = true;
						} else {
							delete data.logo_path;
						}

						if(data.main_picture_path && data.main_picture_path.file) {
							data.main_picture_path = data.main_picture_path.file;
						} else if(!update) {
							errors.main_picture_path = true;
						} else {
							delete data.main_picture_path;
						}

						data.promo = safeJSONStringify(promoML);
						data.description = safeJSONStringify(descriptionML);

						if(data.promo.length > 1000) {
							errors.promo = formatMessage(intl.maximumCharacters, { characters: 900 });
						}

						if(data.description.length > 1000) {
							errors.description = formatMessage(intl.maximumCharacters, { characters: 900 });
						}

						if(Object.keys(errors).length) {
							setErrors(errors);
							setIsSubmitting(false);
							return;
						}

						let url = `api/benefits/${(update) ? benefit.id + '/edit' : 'create'}`

						httpClient.postFile(url, serealizeData(data))
						.then(({ data }) => {
							if(data.status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update) ? 'successUpdatedBenefit' : 'successAddedBenefit']),
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlBenefits));
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
				values,
				touched,
				handleBlur,
				handleSubmit,
				handleChange,
				setFieldValue,
				...rest
			}) => {
				const URL_ASSETS = process.env.REACT_APP_BASE_URL;
				const imagePreview = '/static/images/Image-preview.svg';

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
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{formatMessage(intl.tradeName)}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextField
											required
											fullWidth
											name="trade"
											variant="outlined"
											onBlur={handleBlur}
											value={values.trade}
											onChange={handleChange}
											error={Boolean(touched.trade && errors.trade)}
											helperText={
												(Boolean(touched.trade && errors.trade))
													? errors.trade : ''
											}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.promotion)}:`}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<TextFieldSwitchLanguage
											propsTextField={{
												required: true,
												name: 'promo',
												fullWidth: true,
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={promoML}
											error={errors.promo}
											onChange={handleChange}
											touched={touched.promo}
											setValueML={setPromoML}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{formatMessage(intl.category)}
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
											name="benefit_category_id"
											SelectProps={{ native: true }}
											onChange={ (e) => setCategoryId(e.target.value) }
											error={Boolean(touched.benefit_category_id && errors.benefit_category_id)}
											helperText={
												(Boolean(touched.benefit_category_id && errors.benefit_category_id))
													? errors.benefit_category_id : ''
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
										{`${formatMessage(intl.tradeLogo)}:`}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<div className="previewComponent">
											<input className="fileInput"
												type="file"
												accept='image/*'
												name='logo_path'
												ref={_logoFileRef}
												style={{ display: 'none' }}
												onChange={(e) => handleImage(e, setFieldValue)}
											/>
											<div className={classes.imgPreview}>
												<img
													alt="thumb"
													style={{ width: '100%', height: '100%' }}
													src={
														(
															values.logo_path &&
															values.logo_path.url &&
															values.logo_path.file
														)
															? values.logo_path.url
															: (benefit.logo_path)
															? URL_ASSETS + benefit.logo_path
															: imagePreview
													}
												/>
												<p style={{color:'red'}}>
													{
														(errors.logo_path) ? formatMessage(intl.theFieldIsRequired) : ''
													}
												</p>
											</div>
											<Button variant="contained" color="primary"
												onClick={() => { _logoFileRef.current.click() }}
												style={{ marginTop: 10 }}
											>
												{formatMessage(intl.chooseFile)}
										</Button>
										</div>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{formatMessage(intl.mainPicture)}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<div className="previewComponent">
											<input className="fileInput"
												type="file"
												accept='image/*'
												name='main_picture_path'
												ref={_mainPictureFileRef}
												style={{ display: 'none' }}
												onChange={(e) => handleImage(e, setFieldValue)}
											/>
											<div className={classes.imgPreview1}>
												<img
													alt="thumb"
													style={{ width: '100%', height: '100%' }}
													src={
														(
															values.main_picture_path &&
															values.main_picture_path.url &&
															values.main_picture_path.file
														)
															? values.main_picture_path.url
															: (benefit.main_picture_path)
															? URL_ASSETS + benefit.main_picture_path
															: imagePreview
													}
													/>
													<p style={{color:'red'}}>
														{
															(errors.main_picture_path)
															? formatMessage(intl.theFieldIsRequired) : ''
														}
													</p>
											</div>
											<Button variant="contained" color="primary"
												onClick={() => { _mainPictureFileRef.current.click() }}
												style={{ marginTop: 10 }}
											>
												{formatMessage(intl.chooseFile)}
										</Button>
										</div>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.description)}:`}
									</Grid>
									<Grid item md={7} xs={7} >
										<TextFieldSwitchLanguage
											propsTextField={{
												required: true,
												fullWidth: true,
												onBlur: handleBlur,
												variant: 'outlined',
												name: 'description',
											}}
											valueML={descriptionML}
											onChange={handleChange}
											error={errors.description}
											touched={touched.description}
											setValueML={setDescriptionML}
										/>
									</Grid>

									<Grid
										item
										md={10}
										xs={10}
										style={{ textAlign: 'left', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.Publication)}:`}
									</Grid>
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.promotedToHomeQuestion)}`}
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
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.publishedQuestion)}`}
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
											label={formatMessage(intl.yes)}
										/>
									</Grid>
									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'center' }}
									>
										{`${formatMessage(intl.ExpiresQuestion)}`}
									</Grid>
									<Grid
										item
										md={7}
										xs={7}
									>
										<FormControlLabel
											control={
												<Checkbox
													name="expires"
													color="primary"
													onChange={handleChange}
													checked={Boolean(values.expires)}
												/>
											}
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									{ (!Boolean(values.expires)) ? null :
										<Fragment>
											<Grid
											item
											md={4}
											xs={4}
											style={{ textAlign: 'center', alignSelf: 'center' }}
										>
											{`${formatMessage(intl.expirationDate)}:`}
										</Grid>
										<Grid
											item
											md={7}
											xs={7}
										>
												<TextField
													required
													fullWidth
													type='datetime-local'
													name='expiration_date'
													onChange={handleChange}
													defaultValue={(update) ? formatDate(benefit.expiration_date) : ''}
													InputLabelProps={{
														shrink: true,
													}}
												/>
										</Grid>
										</Fragment>
									}
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

BenefitsAddEditForm.propTypes = {
	benefit: PropTypes.object,
	className: PropTypes.string,
};

BenefitsAddEditForm.defaultProps = {
	benefit: {},
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(BenefitsAddEditForm);