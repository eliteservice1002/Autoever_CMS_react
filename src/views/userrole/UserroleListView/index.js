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

const UserroleListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ userroles, setUserroles ] = useState([]);

	const deleteRoles = (selectedRoles) => {
		let temp = [];
		const eliminatedList = [];
		userroles.forEach((role) => {
			if(!selectedRoles.includes(role.id)) {
				temp.push(role)
			} else {
				eliminatedList.push(deleteRole(role.id));
			}
		})
		return eliminatedList;
	}

	const deleteRole = (id) => {
		httpClient.delete(`api/userroles/${id}`);
		setUserroles((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getUserroles = useCallback(async () => {
		try {
			const response = await httpClient.get('api/userroles');

			if (isMountedRef.current) {
				setUserroles(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getUserroles();
	}, [getUserroles]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.userRoles)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.userRoles)}
					buttonRight={{ to: formatMessage(intl.urlUserRolesAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.setting),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						userroles={userroles}
						deleteRole={deleteRole}
						deleteRoles={deleteRoles}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(UserroleListView);