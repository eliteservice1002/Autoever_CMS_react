import React, {
	useState,
	useCallback,
	useEffect
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
import SecurityCheckEditForm from '../Form/SecurityCheckAddEditForm';

/* utils */
import httpClient from 'src/utils/httpClient';

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

const SecurityCheckEditView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ securityCheck, setSecurityCheck ] = useState(null);

	const getSecurityCheck = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/companies/security-checks/${params.id}`);

			if (isMountedRef.current) {
				setSecurityCheck(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getSecurityCheck();
	}, [getSecurityCheck]);

	if (!securityCheck) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.securityCheckEdit)}
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<SecurityCheckEditForm update securityCheck={securityCheck} />
				</Container>
			</Box>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(SecurityCheckEditView);