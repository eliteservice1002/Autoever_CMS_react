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

const FastAnwerListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ fastAnswers, setFastAnswer ] = useState([]);

	const deleteFastAnswers = (selectedFastAnswers) => {
		let temp = [];
		const eliminatedList = [];
		fastAnswers.forEach((fs) => {
			if (!selectedFastAnswers.includes(fs.id)) {
				temp.push(fs)
			} else {
				eliminatedList.push(deleteFastAnswer(fs.id));
			}
		})

		return eliminatedList;
	}

	const deleteFastAnswer = (id) => {
		httpClient.delete(`api/innovation/fast_answers/${id}`);
		setFastAnswer((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getFastAnswers = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/fast_answers`);

			if (isMountedRef.current) {
				setFastAnswer(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getFastAnswers();
	}, [getFastAnswers]);

	return (
		<Page
			className={classes.root}
			title="Innovation Box fast Answers"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='Innovation Box fast Answers'
					buttonRight={{ to: formatMessage(intl.urlFastAnswersAdd) }}
				/>
				<Box mt={3}>
					<Results
						fastAnswers={fastAnswers}
						deleteFastAnswer={deleteFastAnswer}
						deleteFastAnswers={deleteFastAnswers}
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
)(FastAnwerListView);