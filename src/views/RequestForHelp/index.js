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

const ListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ requestsForHelp, setRequestForHelp ] = useState([]);

	const deleteRequestsForHelper = (selectedAppuser) => {
		let temp = [];
		const eliminatedList = [];
		requestsForHelp.forEach((user) => {
			if(!selectedAppuser.includes(user.id)) {
				temp.push(user)
			} else {
				eliminatedList.push(deleteRequestForHelper(user.id));
			}
		})
		return eliminatedList;
	}

	const deleteRequestForHelper = (id) => {
		httpClient.delete(`api/request-for-help/${id}`);
		setRequestForHelp((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getRequestsForHelp = useCallback(async () => {
		try {
			const response = await httpClient.get('api/request-for-help');

			if (isMountedRef.current) {
				console.log(response.data);
				setRequestForHelp(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getRequestsForHelp();
	}, [getRequestsForHelp]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.requestForHelp)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.requestForHelp)}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						requestsForHelp={requestsForHelp}
						deleteRequestForHelper={deleteRequestForHelper}
						deleteRequestsForHelper={deleteRequestsForHelper}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(ListView);