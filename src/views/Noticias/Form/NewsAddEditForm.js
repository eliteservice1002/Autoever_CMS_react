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
	},
	imgPreview: {
		maxWidth: '200px'
	}
}));

const NewsAddEditForm = ({ news, update, intl, currentLanguage }) => {
	const classes = useStyles();
	const history = useHistory();
	const _imgageRef = useRef(null);
	const _archiveRef = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const [ titleML, setTitleML ] = useState({});
	const [ contentML, setContentML ] = useState({});
	const [ categories, setCategories ] = useState([]);
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ selectedCategories, setSelectedCategories ] = useState([]);

	useEffect(() => {
		if(update) {
			setTitleML(news.title || {});
			setContentML(news.content || {});
		}
	}, [ update ])

	useEffect(() => {
		httpClient.get('api/news/categories')
		.then(({ data }) => {
			setCategories(data);
			if(update && news.categories) {
				news.categories.forEach((el) => {
					setSelectedCategories((prevState) => {
						return [...prevState, parseInt(el.id)];
					})
				})
			}
		})
	}, [])

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
				case 'publication_home':
				case 'publication_expire':
				case 'publication_publish':
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

	const handleChangeCategory = (e) => {
		let { target } = e;
		if(target.checked) {
			setSelectedCategories((prevState) => {
				return [...prevState, parseInt(target.value)];
			})
		} else {
			setSelectedCategories((prevState) => {
				return prevState.filter((el) => {
					return el != parseInt(target.value)
				})
			})
		}
	}

	const handleFile = (e, setField) => {
		e.preventDefault();

		let { name, files } = e.target;
		let file = files[0];

		if(file) {
			setField(name, {
				file,
				filename: file.name,
			})
		} else {
			setField(name, null);
		}
	}

	return (
		<Formik
			initialValues={{
				title: '',
				content: '',
				img_path: (news.img_path)
						? { url: news.img_path } : null,
				archive_path: (news.archive_path)
						? { filename: news.archive_path } : null,
				publication_home: Boolean(news.publication_home) || false,
				publication_expire: Boolean(news.publication_expire) || false,
				publication_publish: Boolean(news.publication_publish) || false,
			}}
			onSubmit={
				async (values, { setErrors }) => {
					try {
						setIsSubmitting(true);
						let data = { ...values };

						data.categories = selectedCategories;

						let errors = {};

						if(!selectedCategories.length) {
							errors.categories = formatMessage(intl.selectOneCategory);
						}

						if(data.expiration_date) {
							data.expiration_date = formatDate(data.expiration_date);
						} else {
							delete data.expiration_date;
						}

						if(data.img_path && data.img_path.file) {
							data.img_path = data.img_path.file;
						} else if(!update) {
							errors.img_path = true;
						} else {
							delete data.img_path;
						}

						if(data.archive_path && data.archive_path.file) {
							data.archive_path = data.archive_path.file;
						} else {
							delete data.archive_path;
						}
						
						data.title = safeJSONStringify(titleML);
						data.content = safeJSONStringify(contentML);

						if(data.title.length > 1000) {
							errors.title = formatMessage(intl.maximumCharacters, { characters: 900 });
						}

						if(Object.keys(errors).length) {
							setErrors(errors);
							setIsSubmitting(false);
							return;
						}

						let url = `api/news/${(update) ? news.id + '/edit' : 'create'}`;

						let response = await httpClient.postFile(url, serealizeData(data))
						.then(({ data }) => {
							if(data.status === 1) {
								enqueueSnackbar(
									formatMessage(intl[(update) ? 'successUpdatedNews' : 'successAddedNews']),
									{ variant: 'success' }
								)
								history.push(formatMessage(intl.urlNews));
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
		>
			{({
				errors,
				values,
				touched,
				handleBlur,
				handleSubmit,
				handleChange,
				setFieldValue,
			}) => {
				const URL_ASSETS = process.env.REACT_APP_BASE_URL;
				const imagePreview = '/static/images/Image-preview.svg';

				return(
					<form onSubmit={handleSubmit} className={clsx(classes.root)} >
						<Card>
							<CardContent>
								<Grid container spacing={3} >
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
										{`* ${formatMessage(intl.content)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<TextFieldSwitchLanguage
											propsTextField={{
												rows: 5,
												required: true,
												name: 'content',
												fullWidth: true,
												multiline: true,
												onBlur: handleBlur,
												variant: 'outlined',
											}}
											valueML={contentML}
											error={errors.content}
											onChange={handleChange}
											touched={touched.content}
											setValueML={setContentML}
										/>
									</Grid>

									{ (!categories.length) ? null : (
											<Fragment>
												<Grid
													item
													md={4}
													xs={4}
													style={{ textAlign: 'center', alignSelf: 'flex-start' }}
												>
													{`* ${formatMessage(intl.category)}:`}
												</Grid>
												<Grid item md={7} xs={7} >
													<p style={{color:'red'}}>
														{(errors.categories) ? errors.categories : ''}
													</p>
													{
														categories.map((cat) => {
															return(
																<FormControlLabel
																	key={cat.id}
																	control={
																		<Checkbox
																			value={cat.id}
																			color="primary"
																			onChange={handleChangeCategory}
																			checked={selectedCategories.includes(cat.id)}
																		/>
																	}
																	label={formatLanguageToString(cat.name, currentLanguage)}
																	style={{ width: '100%' }}
																/>
															)
														})
													}
												</Grid>
											</Fragment>
										)}

									<Grid item md={10} xs={10} className={clsx(classes.gridLabelGroup)} >
										{`${formatMessage(intl.media)}:`}
									</Grid>

									<Grid
										item
										md={4}
										xs={4}
										style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
									>
										{`${formatMessage(intl.image)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<div>
											<input
												type="file"
												name='img_path'
												accept='image/*'
												ref={_imgageRef}
												style={{ display: 'none' }}
												onChange={(e) => handleImage(e, setFieldValue)}
											/>
											<div className={classes.imgPreview}>
												<img
													style={{maxWidth:'300px'}}
													alt="thumb"
													src={
														(
															values.img_path &&
															values.img_path.url &&
															values.img_path.file
														)
															? values.img_path.url
															: (news.img_path)
															? URL_ASSETS + news.img_path
															: imagePreview
													}
												/>
												<p style={{color:'red'}}>
													{
														(errors.img_path) ? formatMessage(intl.imageRequired) : ''
													}
												</p>
											</div>
											<Button variant="contained" color="primary"
												onClick={() => { _imgageRef.current.click() }}
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
										style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
									>
										{`${formatMessage(intl.attachedFile)}:`}
									</Grid>

									<Grid item md={7} xs={7} >
										<div>
											<input
												type="file"
												accept='.pdf'
												ref={_archiveRef}
												name='archive_path'
												style={{ display: 'none' }}
												onChange={(e) => handleFile(e, setFieldValue)}
											/>
											<TextField
												disabled
												fullWidth
												variant="outlined"
												name="archive_path"
												value={
													(
															values.archive_path &&
															values.archive_path.filename &&
															values.archive_path.file
														)
															? values.archive_path.filename
															: (news.archive_path)
															? news.archive_path
															: ''
												}
											/>
											<Button variant="contained" color="primary"
												onClick={() => { _archiveRef.current.click() }}
												style={{ marginTop: 10 }}
											>
												{formatMessage(intl.chooseFile)}
										</Button>
										</div>
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
													name="publication_home"
													onChange={handleChange}
													checked={Boolean(values.publication_home)}
												/>
											}
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{`${formatMessage(intl.publishedQuestion)}`}
									</Grid>

									<Grid item md={7} xs={7} >
										<FormControlLabel
											control={
												<Checkbox
													color="primary"
													name="publication_publish"
													onChange={handleChange}
													checked={Boolean(values.publication_publish)}
												/>
											}
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
										{formatMessage(intl.ExpiresQuestion)}
									</Grid>

									<Grid item md={7} xs={7} >
										<FormControlLabel
											control={
												<Checkbox
													name="publication_expire"
													color="primary"
													onChange={handleChange}
													checked={Boolean(values.publication_expire)}
												/>
											}
											label={formatMessage(intl.yes)}
										/>
									</Grid>

									{ (!Boolean(values.publication_expire)) ? null :
										<Fragment>
											<Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
												{`${formatMessage(intl.expirationDate)}:`}
											</Grid>

											<Grid item md={7} xs={7} >
												<TextField
													required
													fullWidth
													type='datetime-local'
													name='expiration_date'
													onChange={handleChange}
													defaultValue={(update) ? formatDate(news.expiration_date) : ''}
													InputLabelProps={{
														shrink: true,
													}}
												/>
											</Grid>
										</Fragment>
									}

									<Grid item md={2} xs={6} style={{ textAlign: 'center' }} >
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

									<Grid item md={2} xs={6} style={{ textAlign: 'center' }} >
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
									<Grid item md={4} xs={12} style={{ textAlign: 'center' }} ></Grid>
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

NewsAddEditForm.propTypes = {
	update: PropTypes.bool,
	news: PropTypes.object,
	className: PropTypes.string,
};

NewsAddEditForm.defaultProps = {
	news: {},
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(NewsAddEditForm);
