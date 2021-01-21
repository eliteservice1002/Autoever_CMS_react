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
import Results from './Results';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

const SecurityCheckListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ securityChecks, setSecurityChecks ] = useState([]);

	const deleteSecurityChecks = (selected) => {
		let temp = [];
		const eliminatedList = [];
		securityChecks.forEach((el) => {
			if(!selected.includes(el.id)) {
				temp.push(el)
			} else {
				eliminatedList.push(deleteSecurityCheck(el.id));
			}
		})

		return eliminatedList;
	}

	const deleteSecurityCheck = (id) => {
		httpClient.delete(`api/companies/security-checks/${id}`);
		setSecurityChecks((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}
	
	const getData = useCallback(async () => {
		try {
			const response = await httpClient.get('api/companies/security-checks');

			if (isMountedRef.current) {
				setSecurityChecks(response.data ?? []);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getData();
	}, [getData]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.securityChecks)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.securityChecks)}
					buttonRight={{ to: formatMessage(intl.urlSecurityChekAdd) }}
				/>
				<Box mt={3}>
					<Results
						securityChecks={securityChecks}
						deleteSecurityCheck={deleteSecurityCheck}
						deleteSecurityChecks={deleteSecurityChecks}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(SecurityCheckListView);