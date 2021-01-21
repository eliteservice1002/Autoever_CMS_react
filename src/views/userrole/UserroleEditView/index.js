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
import UserrolesEditForm from '../Form/UserrolesAddEditForm';

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

const UserroleEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ userrole, setUserrole ] = useState(null);

	const getUserRole = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/userroles/${params.userId}`);

			if (isMountedRef.current) {
				setUserrole(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getUserRole();
	}, [getUserRole]);

	if (!userrole) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="Userrole Edit"
		>
			<Container maxWidth={false}>
				<Header goBack />
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<UserrolesEditForm update userrole={userrole} />
				</Container>
			</Box>
		</Page>
	);
};

export default UserroleEditView;
