import React, { Fragment } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	Box,
	Card,
	Grid,
	Button,
	TextField,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

// utils
import { formatDate, formatLanguageToString } from 'src/utils';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
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

const NoticiaInfo = ({ noticias, intl, currentLanguage }) => {
	const classes = useStyles();
	const URL_ASSETS = process.env.REACT_APP_BASE_URL;

	return (
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
								variant: 'outlined',
							}}
							valueML={noticias.title || {}}
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
								variant: 'outlined',
							}}
							valueML={noticias.content || {}}
						/>
					</Grid>

					{ (!noticias.categories.length) ? null : (
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
									{
										noticias.categories.map((cat) => {
											return(
												<FormControlLabel
													key={cat.id}
													control={
														<Checkbox
															value={cat.id}
															checked={true}
															color="primary"
														/>
													}
													style={{ width: '100%' }}
													label={formatLanguageToString(cat.name, currentLanguage)}
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
					<Grid
						item
						md={7}
						xs={7}
					>
						<div>
							<div className={classes.imgPreview}>
								<img
									alt="thumb"
									src={URL_ASSETS + noticias.img_path}
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
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
							<TextField
								disabled
								fullWidth
								variant="outlined"
								name="archive_path"
								value={noticias.archive_path}
							/>
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
										checked={Boolean(noticias.publication_home)}
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
									checked={Boolean(noticias.publication_publish)}
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
									checked={Boolean(noticias.publication_expire)}
								/>
							}
							label={formatMessage(intl.yes)}
						/>
					</Grid>

					{ (!Boolean(noticias.expiration_date) || !noticias.publication_expire) ? null :
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
									defaultValue={(noticias.expiration_date) ? formatDate(noticias.expiration_date) : ''}
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</Grid>
						</Fragment>
					}
					<Grid item md={4} xs={12} style={{ textAlign: 'center' }} ></Grid>
					<Grid item />
				</Grid>
			</CardContent>
		</Card>
	);
};

NoticiaInfo.propTypes = {
	className: PropTypes.string,
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(NoticiaInfo);