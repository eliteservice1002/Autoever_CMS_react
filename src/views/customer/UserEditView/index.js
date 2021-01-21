import React, {
	useState,
	useEffect,
	useCallback
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import AppuserEditForm from '../Form/AppuserAddEditForm';

/* utils */
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const CustomerEditView = ({ match }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ appuser, setAppuser ] = useState(null);

	const getAppuser = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/appusers/${params.userId}`);

			if (isMountedRef.current) {
				setAppuser(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getAppuser();
	}, [getAppuser]);

	if (!appuser) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="App Edit"
		>
			<Container maxWidth={false}>
				<Header />
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<AppuserEditForm update appuser={appuser} />
				</Container>
			</Box>
		</Page>
	);
};

export default CustomerEditView;
