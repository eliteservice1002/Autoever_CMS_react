import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import NoticiaInfo from './NoticiaInfo';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({ noticias }) => {
	const classes = useStyles();

	return (
		<Grid className={clsx(classes.root)} container spacing={3} >
			<Grid item lg={12} md={12} xl={12} xs={12} >
				<NoticiaInfo noticias={noticias} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
};

export default Details;
