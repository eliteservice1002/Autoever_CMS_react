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

const CustomerDetailsView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [customer, setCustomer] = useState(null);

	const getCustomer = useCallback(async () => {
		httpClient.get(`api/appusers/${params.userId}`)
		.then(json => {
			if (json.status) {
				isMountedRef.current && setCustomer(json.data);
			}
		})
		.catch((error) => {
			console.log(error);
		});

	}, [isMountedRef]);

	useEffect(() => {
		getCustomer();
	}, [getCustomer]);

	if (!customer) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.appuserDetail)}
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={formatMessage(intl.appuserDetail)}
					buttonRight={{
						icon: (<EditIcon/>),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlAppuserEdit, { userId: params.userId })
					}}
				/>
				<Box mt={3}>
					<Details customer={customer} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CustomerDetailsView);