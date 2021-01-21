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
import CategoryEditForm from '../Form/CategoryAddEditForm';

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

const CategoryEditView = () => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ category, setCategory ] = useState(null);

	const getCategory = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/categories/${params.categoryId}`);

			if (isMountedRef.current) {
				setCategory(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCategory();
	}, [getCategory]);

	if (!category) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="Category Edit"
		>
			<Container maxWidth={false}>
				<Header goBack/>
			</Container>
			<Box mt={3}>
				<Container maxWidth="lg">
					<CategoryEditForm update category={category} />
				</Container>
			</Box>
		</Page>
	);
};

export default CategoryEditView;
