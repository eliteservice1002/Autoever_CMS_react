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
import NewsEditForm from '../Form/NewsAddEditForm';
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

const NewsEditView = ({ match, intl }) => {
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
	}, [isMountedRef, params.newId]);

	useEffect(() => {
		getNoticias();
	}, [getNoticias]);

	if (!noticias) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.editNews)}
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<NewsEditForm update news={noticias} />
				</Container>
			</Box>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(NewsEditView);