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
import BusRouteEditForm from '../Form/BusRouteAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

const BusRouteEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ busRoute, setBusRoute ] = useState(null);

	const getBusRoute = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/bus_route/${params.id}`);
		
			if (isMountedRef.current) {
				setBusRoute(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getBusRoute();
	}, [getBusRoute]);

	if (!busRoute) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="BusRoute Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<BusRouteEditForm update busRoute={busRoute} />
				</Container>
			</Box>
		</Page>
	);
};

export default BusRouteEditView;
