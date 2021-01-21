import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Results from './Results';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const CustomerListView = () => {
	const classes = useStyles();
	return (
		<Page
			className={classes.root}
			title="Terms and conditioins List"
		>
			<Container maxWidth={false}>
				<Header actualPage='Terminos y condiciones' />
				<Box mt={3}>
					<Results />
				</Box>
			</Container>
		</Page>
	);
};

export default CustomerListView;
