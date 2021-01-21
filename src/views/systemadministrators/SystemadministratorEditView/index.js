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
import SysteadminEditForm from '../Form/SystemadminAddEditForm';

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

const SystemadminEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ systemadmin , setSystemadmin ] = useState(null);

	const getSystemadmin = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/systemadmins/${params.userId}`);

			if (isMountedRef.current) {
				setSystemadmin(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getSystemadmin();
	}, [getSystemadmin]);

	if (!systemadmin) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="Systemadministrator Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<SysteadminEditForm update systemadmin={systemadmin} />
				</Container>
			</Box>
		</Page>
	);
};

export default SystemadminEditView;
