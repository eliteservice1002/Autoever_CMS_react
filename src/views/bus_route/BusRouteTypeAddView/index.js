import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import BusRouteTypeAddForm from '../Form/BusRouteTypeAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const BusRouteTypeAdd = () => {
	const classes = useStyles();

	return (
		<Page
			title="BusRouteType Edit"
			className={classes.root}
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<BusRouteTypeAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default BusRouteTypeAdd;
