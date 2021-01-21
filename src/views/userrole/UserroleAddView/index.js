import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import UserrolesAddForm from '../Form/UserrolesAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const UserroleAddView = () => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title="Userrole Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<UserrolesAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default UserroleAddView;
