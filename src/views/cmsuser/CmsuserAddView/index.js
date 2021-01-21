import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import CmsuserAddForm from '../Form/CmsusersAddEditForm';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const CmsuserAdd = () => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title="Cms user Add"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<CmsuserAddForm />
				</Container>
			</Box>
		</Page>
	);
};

export default CmsuserAdd;