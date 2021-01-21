import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import BusRouteAddForm from '../Form/BusRouteAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const BusRouteAdd = () => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title="Bus Route Add"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<BusRouteAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default BusRouteAdd;
