import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import SystemadminAddForm from '../Form/SystemadminAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const SystemadminAddView = () => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title="System admin Add"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<SystemadminAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default SystemadminAddView;
