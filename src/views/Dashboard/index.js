import React from 'react';
import {
	Grid,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import LogsLoginsApp from './LogsLoginsApp';
import LogsLoginsCms from './LogsLoginsCms';
import LogsViewsPerModule from './LogsViewsPerModule';
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

const Dashboard = ({ intl }) => {
	const { user } = useAuth();
	const classes = useStyles();

	return (
		<Page className={classes.root} title={formatMessage(intl.dashboard)} >
			<Container maxWidth={false}>
				<Header actualPage={formatMessage(intl.dashboard)} />

				<Grid container spacing={3} >
					<Grid item xs={12} >
						<LogsLoginsApp />
					</Grid>

					<Grid item xs={12} >
						<LogsViewsPerModule />
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(Dashboard);