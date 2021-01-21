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
import CmsuserEditForm from '../Form/CmsusersAddEditForm';

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

const CmsuserEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ cmsuser, setCmsuser ] = useState(null);

	const getCmsuser = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/cmsusers/${params.cmsuserId}`);

			if (isMountedRef.current) {
				setCmsuser(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCmsuser();
	}, [getCmsuser]);

	if (!cmsuser) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="Cmsuser Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<CmsuserEditForm update cmsuser={cmsuser} />
				</Container>
			</Box>
		</Page>
	);
};

export default CmsuserEditView;
