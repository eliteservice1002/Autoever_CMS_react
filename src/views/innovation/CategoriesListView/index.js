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

const CategoriesListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ categories, setCategories ] = useState([]);

	const deleteCategories = (selectedCategories) => {
		let temp = [];
		const eliminatedList = [];
		categories.forEach((category) => {
			if (!selectedCategories.includes(category.id)) {
				temp.push(category)
			} else {
				eliminatedList.push(deleteCategory(category.id));
			}
		})

		return eliminatedList;
	}

	const deleteCategory = (id) => {
		httpClient.delete(`api/innovation/categories/${id}`);
		setCategories((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getCategories = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/categories`);

			if (isMountedRef.current) {
				setCategories(
					response.data.map((el) => {
						return {
							...el,
							title: formatLanguageToString(el.title)
						}
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	return (
		<Page
			className={classes.root}
			title="Innovation Box Categories"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='Innovation Box Categories'
					buttonRight={{ to: formatMessage(intl.urlInnovationBoxCategoriesAdd) }}
				/>
				<Box mt={3}>
					<Results
						categories={categories}
						deleteCategory={deleteCategory}
						deleteCategories={deleteCategories}
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
)(CategoriesListView);