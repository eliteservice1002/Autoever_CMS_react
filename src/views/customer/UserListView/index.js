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

const CustomerListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ appusers, setAppusers ] = useState([]);

	const deleteAppusers = (selectedAppuser) => {
		let temp = [];
		const eliminatedList = [];
		appusers.forEach((user) => {
			if(!selectedAppuser.includes(user.id)) {
				temp.push(user)
			} else {
				eliminatedList.push(deleteAppuser(user.id));
			}
		})
		return eliminatedList;
	}

	const deleteAppuser = (id) => {
		httpClient.delete(`api/appusers/${id}`);
		setAppusers((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getAppusers = useCallback(async () => {
		try {
			const response = await httpClient.get('api/appusers');

			if (isMountedRef.current) {
				setAppusers(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getAppusers();
	}, [getAppusers]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.appUsers)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.appUsers)}
					buttonRight={{ to: formatMessage(intl.urlAppuserAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						appusers={appusers}
						deleteAppuser={deleteAppuser}
						deleteAppusers={deleteAppusers}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CustomerListView);