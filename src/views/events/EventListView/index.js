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

const EventListView = ({ intl, currentLanguage }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ events, setEvents ] = useState([]);

	const deleteEvents = (selectedEvents) => {
		let temp = [];
		const eliminatedList = [];
		events.forEach((event) => {
			if(!selectedEvents.includes(event.id)) {
				temp.push(event)
			} else {
				eliminatedList.push(deleteEvent(event.id));
			}
		})
		return eliminatedList;
	}

	const deleteEvent = (id) => {
		httpClient.delete(`api/event/${id}`);
		setEvents((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getEvents = useCallback(async () => {
		try {
			const response = await httpClient.get('api/event');

			if (isMountedRef.current) {
				setEvents(
					response.data.map((el) => {
						return {
							...el,
							title: formatLanguageToString(el.title, currentLanguage),
							category: {
								...el.category,
								name: formatLanguageToString(el.category.name, currentLanguage),
							}
						}
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef, currentLanguage]);

	useEffect(() => {
		getEvents();
	}, [getEvents]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.eventsList)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.eventsList)}
					buttonRight={{ to: formatMessage(intl.urlEventsAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						events={events}
						deleteEvent={deleteEvent}
						deleteEvents={deleteEvents}
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

export default connectIntl(mapStateToProps)(EventListView);