import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Card,
	Table,
	Avatar,
	Divider,
	TableRow,
	TableBody,
	TableCell,
	Typography,
	makeStyles,
	CardHeader,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

/* utils */
import { formatLanguageToString } from 'src/utils';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const BenefitInfo = ({ benefit, intl, currentLanguage }) => {
	const classes = useStyles();
	const URL_ASSETS = process.env.REACT_APP_BASE_URL;

	return (
		<Card className={clsx(classes.root)} >
			<CardHeader title={formatMessage(intl.benefitDetails)} />

			<Divider />

			<Table>
				<TableBody>
					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.tradeName)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{benefit.trade}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{`${formatMessage(intl.promotion)}`}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{(benefit.promo)
									? formatLanguageToString(benefit.promo, currentLanguage) : '-'
								}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.category)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{(benefit.category)
									? formatLanguageToString(benefit.category.name, currentLanguage) : '-'
								}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{`${formatMessage(intl.description)}`}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{(benefit.description)
									? formatLanguageToString(benefit.description, currentLanguage) : '-'
								}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{`${formatMessage(intl.tradeLogo)}`}
						</TableCell>

						<TableCell>
							<Avatar
								className={classes.avatar}
								src={URL_ASSETS + benefit.logo_path}
							>
							</Avatar>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.mainPicture)}
						</TableCell>

						<TableCell>
							<Avatar
								className={classes.avatar}
								src={URL_ASSETS + benefit.main_picture_path}
							>
							</Avatar>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.promotedToHome)}
						</TableCell>

						<TableCell>
							<Checkbox
								checked={Boolean(benefit.promoted_to_home)}
								color="primary"
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.published)}
						</TableCell>

						<TableCell>
							<Checkbox
								checked={Boolean(benefit.published)}
								color="primary"
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.ExpiresQuestion)}
						</TableCell>

						<TableCell>
							<Checkbox
								checked={Boolean(benefit.expires)}
								color="primary"
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.expirationDate)}
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{(benefit.expiration_date) ?
									benefit.expiration_date : 'N/A'
								}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

BenefitInfo.propTypes = {
	className: PropTypes.string,
	benefit: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(BenefitInfo);