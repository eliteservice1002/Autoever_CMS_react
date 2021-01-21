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

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const BusRouteTypeInfo = ({
	busRouteType,
	className,
}) => {
	const classes = useStyles();

	return (
		<Card className={clsx(classes.root, className)} >
			<CardHeader title="BusRouteType info" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Categoría
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRouteType.title}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

BusRouteTypeInfo.propTypes = {
	className: PropTypes.string,
	busRouteType: PropTypes.object.isRequired
};

export default BusRouteTypeInfo;
