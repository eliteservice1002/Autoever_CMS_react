import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import CategoryInfo from './CategoryInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({
	category,
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
				<CategoryInfo category={category} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	category: PropTypes.object.isRequired
};

export default Details;
