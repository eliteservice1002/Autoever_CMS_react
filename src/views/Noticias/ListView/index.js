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

const NewsListView = ({ intl, currentLanguage }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ news, setNews ] = useState([]);

	const deleteNews = (selectedNews) => {
		let temp = [];
		const eliminatedList = [];
		news.forEach((n) => {
			if(!selectedNews.includes(n.id)) {
				temp.push(n)
			} else {
				eliminatedList.push(deleteNew(n.id));
			}
		})
		return eliminatedList;
	}

	const deleteNew = (id) => {
		httpClient.delete(`api/news/${id}`);
		setNews((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getNews = useCallback(async () => {
		try {
			const response = await httpClient.get('api/news');

			if (isMountedRef.current) {
				setNews(
					response.data.map((el) => {
						return {
							...el,
							title: formatLanguageToString(el.title, currentLanguage),
							content: formatLanguageToString(el.content, currentLanguage),
						}
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef, currentLanguage]);

	useEffect(() => {
		getNews();
	}, [getNews]);


	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.newsList)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.newsList)}
					buttonRight={{ to: formatMessage(intl.urlNewsAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						news={news}
						deleteNew={deleteNew}
						deleteNews={deleteNews}
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

export default connectIntl(mapStateToProps)(NewsListView);