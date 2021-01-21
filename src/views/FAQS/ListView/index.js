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
import { formatLanguageToString } from 'src/utils';

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

const FaqsListView = ({ intl, currentLanguage }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ faqs, setFaqs ] = useState([]);

	const deleteFaqs = (selectedFaqs) => {
		let temp = [];
		const eliminatedList = [];
		faqs.forEach((faq) => {
			if(!selectedFaqs.includes(faq.id)) {
				temp.push(faq)
			} else {
				eliminatedList.push(deleteFaq(faq.id));
			}
		})
		return eliminatedList;
	}

	const deleteFaq = (id) => {
		httpClient.delete(`api/faqs/${id}`);
		setFaqs((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getFaqs = useCallback(async () => {
		try {
			const response = await httpClient.get('api/faqs');

			if (isMountedRef.current) {
				setFaqs(
					response.data.map((el) => {
						return {
							...el,
							answer: formatLanguageToString(el.answer, currentLanguage),
							question: formatLanguageToString(el.question, currentLanguage),
						};
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef, currentLanguage]);

	useEffect(() => {
		getFaqs();
	}, [getFaqs]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.faqsList)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.faqsList)}
					buttonRight={{ to: formatMessage(intl.urlFaqsAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						faqs={faqs}
						deleteFaq={deleteFaq}
						deleteFaqs={deleteFaqs}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(FaqsListView);