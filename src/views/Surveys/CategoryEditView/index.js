import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';

import { useParams } from 'react-router-dom';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import CategoryEditView from 'src/views/Categories/AddEditView';

/* utils */
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const CategoryEdit = ({ intl }) => {
	const params = useParams();
	const isMountedRef = useIsMountedRef();
	const [ category, setCategory ] = useState(null);

	const getCategory = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/news/categories/${params.categoryId}`);

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
		<CategoryEditView
			update={true}
			category={category}
			urlAPI='api/news/categories'
			title={formatMessage(intl.editCategory)}
			successRedirect={formatMessage(intl.urlNewsCategories)}
			successMessage={formatMessage(intl.successUpdatedNewsCategory)}
		/>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoryEdit);