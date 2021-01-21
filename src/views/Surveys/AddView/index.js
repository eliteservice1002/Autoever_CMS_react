import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import SurveysAddForm from '../Form/SurveysAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const SurveysEditView = ({ intl }) => {
	const classes = useStyles();

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.addSurveys)}
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<SurveysAddForm />
				</Container>
			</Box>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(SurveysEditView);
