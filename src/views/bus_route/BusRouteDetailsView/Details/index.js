import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import BusRouteInfo from './BusRouteInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({
	busRoute,
	className,
}) => {
	const classes = useStyles();

	return (
		<Grid
			container
			spacing={3}
			className={clsx(classes.root, className)}
		>
			<Grid
				item
				lg={12}
				md={12}
				xl={12}
				xs={12}
			>
				<BusRouteInfo busRoute={busRoute} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	busRoute: PropTypes.object.isRequired
};

export default Details;
