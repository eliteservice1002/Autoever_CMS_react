import React from 'react';
import CategoriesListView from 'src/views/Categories/ListView';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const CategoriesBenefits = ({ intl }) => {
	return(
		<CategoriesListView
			urlAPI='api/benefits/categories'
			urlIntlEdit={intl.urlBenefitsCategoriesEdit}
			actualPage={formatMessage(intl.benefitsCategories)}
			buttonRight={{ to: formatMessage(intl.urlBenefitsCategoriesAdd) }}
			crumbs={[
				{
					label: formatMessage(intl.appContents),
				},
				{
					to: formatMessage(intl.urlBenefits),
					label: formatMessage(intl.listOfBenefits),
				}
			]}
		/>
	)
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoriesBenefits);