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

const CmsuserListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ cmsusers, setCmsusers ] = useState([]);

	const deleteCmsusers = (selectedCmsusers) => {
		let temp = [];
		const eliminatedList = [];
		cmsusers.forEach((user) => {
			if(!selectedCmsusers.includes(user.id)) {
				temp.push(user)
			} else {
				eliminatedList.push(deleteCmsuser(user.id));
			}
		})
		return eliminatedList;
	}

	const deleteCmsuser = (id) => {
		httpClient.delete(`api/cmsusers/${id}`);
		setCmsusers((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getCmsusers = useCallback(async () => {
		try {
			const response = await httpClient.get('api/cmsusers');

			if (isMountedRef.current) {
				setCmsusers(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCmsusers();
	}, [getCmsusers]);

	return (
		<Page
			className={classes.root}
			title="CMS Users"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='Usuarios CMS'
					buttonRight={{ to: formatMessage(intl.urlCmsUsersAdd) }}
					crumbs={[
						{
							label: 'Configuration',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						cmsusers={cmsusers}
						deleteCmsuser={deleteCmsuser}
						deleteCmsusers={deleteCmsusers}
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
)(CmsuserListView);