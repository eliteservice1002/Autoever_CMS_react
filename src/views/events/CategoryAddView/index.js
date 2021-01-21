import React from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import CategoryAddView from 'src/views/Categories/AddEditView';

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

const CategoryAdd = ({ intl }) => {
	const classes = useStyles();

	return (
		<CategoryAddView
			urlAPI='api/event/categories'
			title={formatMessage(intl.addCategory)}
			successRedirect={formatMessage(intl.urlEventsCategories)}
			successMessage={formatMessage(intl.successAddedEventCategory)}
		/>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoryAdd);