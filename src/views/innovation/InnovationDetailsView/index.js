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
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const EventDetailsView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [innovation, setInnovation] = useState(null);

	const getInnovation = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/${params.innovationId}`);

			if (isMountedRef.current) {
				setInnovation(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getInnovation();
	}, [getInnovation]);

	if (!innovation) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={`Innovation Box - View & reply`}
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={'Innovation Box - View & reply'}
					buttonRight={{
						icon: (<EditIcon />),
						label: formatMessage(intl.edit),
						to: `/management/events/${params.eventId}/edit`,
					}}
				/>
				<Box mt={3}>
					<Details innovation={innovation} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(EventDetailsView);