import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import CategoryAddForm from '../Form/CategoryAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const CategoryAdd = () => {
	const classes = useStyles();

	return (
		<Page
			title="Category Edit"
			className={classes.root}
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<CategoryAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default CategoryAdd;
