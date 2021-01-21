import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router-dom';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import CompanyEditForm from '../Form/CompanyAddEditForm';

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

const CompanyEditView = () => {
	const params = useParams();
	const { user } = useAuth();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ company, setCompany ] = useState(null);

	const getCompany = useCallback(async () => {
		try {

			let companyId = (user.role === 'SYSTEMADMIN')
				? user.company.id : params.companyId;

			const response = await httpClient.get(`api/companies/${companyId}`);

			if (isMountedRef.current) {
				setCompany(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCompany();
	}, [getCompany]);

	if (!company) {
		return null;
	}

	return (
		<Page className={classes.root} >
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<CompanyEditForm update company={company} />
				</Container>
			</Box>
		</Page>
	);
};

export default CompanyEditView;
