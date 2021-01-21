import React from 'react';

import clsx from 'clsx';
import FaqsInfo from './FaqsInfo';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({ faqs }) => {
	const classes = useStyles();

	return (
		<Grid
			container
			spacing={3}
			className={clsx(classes.root)}
		>
			<Grid item lg={12} md={12} xl={12} xs={12} >
				<FaqsInfo faqs={faqs} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	faqs: PropTypes.object.isRequired
};

export default Details;
