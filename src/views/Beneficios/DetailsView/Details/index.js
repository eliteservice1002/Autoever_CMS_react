import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import BenefitInfo from './BenefitInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({ benefit, className }) => {
	const classes = useStyles();

	return (
		<Grid className={clsx(classes.root)} container spacing={3} >
			<Grid item lg={12} md={12} xl={12} xs={12} >
				<BenefitInfo benefit={benefit} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	benefit: PropTypes.object.isRequired
};

export default Details;
