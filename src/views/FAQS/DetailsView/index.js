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

const FaqsDetailsView = ({ intl }) => {
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
			title="FAQS Details"
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={'FAQs Details'}
					buttonRight={{
						icon: (<EditIcon/>),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlFaqsEdit, { faqsId: params.faqsId }),
					}}
				/>
				<Box mt={3}>
					<Details faqs={faqs} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(FaqsDetailsView);