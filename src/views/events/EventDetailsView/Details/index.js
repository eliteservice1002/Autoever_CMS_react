import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EventInfo from './EventInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({
	event,
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
				<EventInfo event={event} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	event: PropTypes.object.isRequired
};

export default Details;
