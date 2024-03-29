import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import AppuserAddForm from '../Form/AppuserAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const CustomerEditView = () => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title="App Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<AppuserAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default CustomerEditView;
