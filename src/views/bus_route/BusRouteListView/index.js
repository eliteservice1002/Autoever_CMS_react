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

const BusRouteListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ busRoutes, setBusRoutes ] = useState([]);

	const deleteBusRoutes = (selectedBusRoutes) => {
		let temp = [];
		const eliminatedList = [];
		busRoutes.forEach((busRoute) => {
			if(!selectedBusRoutes.includes(busRoute.id)) {
				temp.push(busRoute)
			} else {
				eliminatedList.push(deleteBusRoute(busRoute.id));
			}
		})
		return eliminatedList;
	}

	const deleteBusRoute = (id) => {
		httpClient.delete(`api/bus_route/${id}`);
		setBusRoutes((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getBusRoutes = useCallback(async () => {
		try {
			const response = await httpClient.get('api/bus_route');

			if (isMountedRef.current) {
				setBusRoutes(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getBusRoutes();
	}, [getBusRoutes]);

	return (
		<Page
			className={classes.root}
			title="BusRoutes List"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='BusRoutes List'
					buttonRight={{ to: formatMessage(intl.urlBusRoutesAdd) }}
					crumbs={[
						{
							label: 'App Contents',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						busRoutes={busRoutes}
						deleteBusRoute={deleteBusRoute}
						deleteBusRoutes={deleteBusRoutes}
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
)(BusRouteListView);