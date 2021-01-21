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

const NoticiasDetailsView = ({ match, intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ noticias, setNoticias ] = useState(null);

	const getNoticias = useCallback(async () => {
		httpClient.get(`api/news/${params.newId}`)
			.then(json => {
				if (json.status && isMountedRef.current) {
					setNoticias(json.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, [isMountedRef,params.newId]);

	useEffect(() => {
		getNoticias();
	}, [getNoticias]);

	if (!noticias) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.detailOfTheNews)}
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={formatMessage(intl.detailOfTheNews)}
					buttonRight={{
						icon: (<EditIcon/>),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlNewsEdit, { newId: params.newId })
					}}
				/>
				<Box mt={3}>
					<Details noticias={noticias} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(NoticiasDetailsView);