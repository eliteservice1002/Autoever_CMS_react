import React from 'react';
import clsx from 'clsx';
import Moment from 'moment';
import PropTypes from 'prop-types';
import {
	Card,
	CardHeader,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	makeStyles
} from '@material-ui/core';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const CustomerInfo = ({ customer, intl }) => {
	const classes = useStyles();
	return (
		<Card className={clsx(classes.root)} >
			<CardHeader title="User info" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.name)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.name}
							</Typography>
						</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.location)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.location}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.departament)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.department}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.employeeNumber)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.employee_number}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.registrationDate)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{Moment(Moment.utc(customer.created_at)).local().format('DD/MM/YYYY hh:mm')}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.status)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.status}
							</Typography>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.activeQuestion)}
						</TableCell>

						<TableCell>
							<Typography variant="body2" color="textSecondary" >
								{customer.active ? formatMessage(intl.yes) : formatMessage(intl.no)}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

CustomerInfo.propTypes = {
	className: PropTypes.string,
	customer: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CustomerInfo);