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
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import FaqsEditForm from '../Form/FaqsAddEditForm';
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

const FaqsEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ faqs, setFaqs ] = useState(null);

	const getFaqs = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/faqs/${params.faqsId}`);

			if (isMountedRef.current) {
				setFaqs(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getFaqs();
	}, [getFaqs]);

	if (!faqs) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="FAQS Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<FaqsEditForm update faqs={faqs} />
				</Container>
			</Box>
		</Page>
	);
};

export default FaqsEditView;
