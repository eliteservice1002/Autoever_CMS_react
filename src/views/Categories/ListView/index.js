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
import PropTypes from 'prop-types';
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
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));

const CategoriesListView = ({ currentLanguage, ...props }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ categories, setCategories ] = useState([]);

	const {
		urlAPI,
		crumbs,
		actualPage,
		urlIntlEdit,
		buttonRight,
	} = props;

	const deleteCategories = (selectedCategories) => {
		let temp = [];
		const eliminatedList = [];
		categories.forEach((category) => {
			if(!selectedCategories.includes(category.id)) {
				temp.push(category)
			} else {
				eliminatedList.push(deleteCategory(category.id));
			}
		})

		return eliminatedList;
	}

	const deleteCategory = (id) => {
		httpClient.delete(`${urlAPI}/${id}`);
		setCategories((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}
	
	const getCategories = useCallback(async () => {
		try {
			const response = await httpClient.get(urlAPI);

			if (isMountedRef.current) {
				setCategories(
					response.data.map((el) => {
						return {
							...el,
							name: formatLanguageToString(el.name, currentLanguage),
						};
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef, currentLanguage]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	return (
		<Page title={actualPage} className={classes.root} >
			<Container maxWidth={false}>
				<Header
					crumbs={crumbs}
					actualPage={actualPage}
					buttonRight={buttonRight}
				/>
				<Box mt={3}>
					<Results
						categories={categories}
						urlIntlEdit={urlIntlEdit}
						deleteCategory={deleteCategory}
						deleteCategories={deleteCategories}
					/>
				</Box>
			</Container>
		</Page>
	);
};

CategoriesListView.PropsType = {
	crumbs: PropTypes.array.isRequired,
	urlAPI: PropTypes.string.isRequired,
	actualPage: PropTypes.string.isRequired,
	buttonRight: PropTypes.object.isRequired,
	urlIntlEdit: PropTypes.object.isRequired,
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(CategoriesListView);