import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Card,
	Table,
	Divider,
	TableRow,
	TableBody,
	TableCell,
	makeStyles,
	Typography,
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

const EventInfo = ({ intl, currentLanguage, event, className }) => {
	const classes = useStyles();

	return (
		<Card className={clsx(classes.root, className)} >
			<CardHeader title="Event info" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.title)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{formatLanguageToString(event.title, currentLanguage)}
							</Typography>
						</TableCell>

					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.startDate)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{event.start_date}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.endingDate)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{event.expiration_date}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.location)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{event.location}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.category)}
						</TableCell>

						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{formatLanguageToString(event.category.name, currentLanguage)}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.promotedToHome)}
						</TableCell>

						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(event.promoted_to_home)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.published)}
						</TableCell>

						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(event.published)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

EventInfo.propTypes = {
	className: PropTypes.string,
	event: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(EventInfo);