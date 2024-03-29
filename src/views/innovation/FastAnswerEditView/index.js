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
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import FastAnswerEditForm from '../Form/FastAnswerAddEditForm';

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

const FastAnswerEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ fastAnswer, setFastAnswer ] = useState(null);

	const getFastAnswer = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/fast_answers/${params.fastAnswerId}`);

			if (isMountedRef.current) {
				setFastAnswer(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getFastAnswer();
	}, [getFastAnswer]);

	if (!fastAnswer) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="fast Answer Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<FastAnswerEditForm update fastAnswer={fastAnswer} />
				</Container>
			</Box>
		</Page>
	);
};

export default FastAnswerEditView;
