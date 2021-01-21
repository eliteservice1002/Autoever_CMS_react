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

const SystemadministratorListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ systemadmins, setSystemadmins ] = useState([]);

	const deleteSystemadmins = (selectedSystemadmins) => {
		let temp = [];
		const eliminatedList = [];
		systemadmins.forEach((user) => {
			if(!selectedSystemadmins.includes(user.id)) {
				temp.push(user)
			} else {
				eliminatedList.push(deleteSystemadmin(user.id));
			}
		})
		return eliminatedList;
	}

	const deleteSystemadmin = (id) => {
		httpClient.delete(`api/systemadmins/${id}`);
		setSystemadmins((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getSysteadmins = useCallback(async () => {
		try {
			const response = await httpClient.get('api/systemadmins');

			if (isMountedRef.current) {
				setSystemadmins(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getSysteadmins();
	}, [getSysteadmins]);

	return (
		<Page
			className={classes.root}
			title="System Users"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='System admin'
					buttonRight={{ to: formatMessage(intl.urlSystemAdminsAdd) }}
					crumbs={[
						{
							label: 'Super Admin',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						systemadmins={systemadmins}
						deleteSystemadmin={deleteSystemadmin}
						deleteSystemadmins={deleteSystemadmins}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

const mapDispatchToProps = (dispatch) => ({
	// 
})

export default connectIntl(
	mapStateToProps,
	mapDispatchToProps
)(SystemadministratorListView);