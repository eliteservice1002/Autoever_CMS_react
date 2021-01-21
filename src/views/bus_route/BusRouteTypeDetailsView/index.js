import React, {
	useCallback,
	useState,
	useEffect
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Details from './Details';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon } from 'react-feather';
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

const BusRouteDetailsView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ busRouteType, setBusRouteType ] = useState(null);

	const getBusRouteType = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/bus_route/type/${params.id}`);

			if (isMountedRef.current) {
				setBusRouteType(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getBusRouteType();
	}, [getBusRouteType]);

	if (!busRouteType) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="BusRouteType Details"
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={'BusRouteType Details'}
					buttonRight={{
						icon: (<EditIcon/>),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlBusRoutesTypeEdit, {id: params.id}),
					}}
				/>
				<Box mt={3}>
					<Details busRouteType={busRouteType} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(BusRouteDetailsView);