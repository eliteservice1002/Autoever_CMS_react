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
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));

const BusRouteTypeListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ busRouteTypes, setBusRouteType ] = useState([]);

	const deleteBusRouteTypes = (selectedBusRouteType) => {
		let temp = [];
		const eliminatedList = [];
		busRouteTypes.forEach((busRouteType) => {
			if(!selectedBusRouteType.includes(busRouteType.id)) {
				temp.push(busRouteType)
			} else {
				eliminatedList.push(deleteBusRouteType(busRouteType.id));
			}
		})

		return eliminatedList;
	}

	const deleteBusRouteType = (id) => {
		httpClient.delete(`api/bus_route/type/${id}`);
		setBusRouteType((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}
	
	const getBusRouteType = useCallback(async () => {
		try {
			const response = await httpClient.get('api/bus_route/type');

			if (isMountedRef.current) {
				setBusRouteType(response.data);
			} else {
				alert("Data loading failed!") ;
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getBusRouteType();
	}, [getBusRouteType]);

	return (
		<Page
			className={classes.root}
			title="BusRouteType"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='BusRouteType'
					buttonRight={{ to: formatMessage(intl.urlBusRoutesTypeAdd) }}
				/>
				<Box mt={3}>
					<Results
						busRouteTypes={busRouteTypes}
						deleteBusRouteType={deleteBusRouteType}
						deleteBusRouteTypes={deleteBusRouteTypes}
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
)(BusRouteTypeListView);