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

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const InnovationListView = () => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ innovations, setInnovations ] = useState([]);

	const deleteInnovations = (selectedinnovations) => {
		let temp = [];
		const eliminatedList = [];
		innovations.forEach((innovation) => {
			if(!selectedinnovations.includes(innovation.id)) {
				temp.push(innovation)
			} else {
				eliminatedList.push(deleteInnovation(innovation.id));
			}
		})
		return eliminatedList;
	}

	const deleteInnovation = (id) => {
		httpClient.delete(`api/innovation/${id}`);
		setInnovations((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getInnovations = useCallback(async () => {
		try {
			const response = await httpClient.get('api/innovation');

			if (isMountedRef.current) {
				setInnovations(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getInnovations();
	}, [getInnovations]);

	return (
		<Page
			className={classes.root}
			title="Innovation List"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='Innovation Box List'
					crumbs={[
						{
							label: 'App Contents',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						innovations={innovations}
						deleteInnovation={deleteInnovation}
						deleteInnovations={deleteInnovations}
					/>
				</Box>
			</Container>
		</Page>
	);
};

export default InnovationListView;
