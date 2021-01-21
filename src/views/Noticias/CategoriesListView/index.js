import React from 'react';
import CategoriesListView from 'src/views/Categories/ListView';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const CategoriesNews = ({ intl }) => {
	return(
		<CategoriesListView
			urlAPI='api/news/categories'
			urlIntlEdit={intl.urlNewsCategoriesEdit}
			actualPage={formatMessage(intl.newsCategory)}
			buttonRight={{ to: formatMessage(intl.urlNewsCategoriesAdd) }}
			crumbs={[
				{
					label: formatMessage(intl.appContents),
				},
				{
					to: formatMessage(intl.urlNews),
					label: formatMessage(intl.newsList),
				}
			]}
		/>
	)
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoriesNews);