import React from 'react';
import CategoriesListView from 'src/views/Categories/ListView';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const CategoriesEvents = ({ intl }) => {
	return(
		<CategoriesListView
			urlAPI='api/event/categories'
			urlIntlEdit={intl.urlEventsCategoriesEdit}
			actualPage={formatMessage(intl.eventsCategory)}
			buttonRight={{ to: formatMessage(intl.urlEventsCategoriesAdd) }}
			crumbs={[
				{
					label: formatMessage(intl.appContents),
				},
				{
					to: formatMessage(intl.urlEvents),
					label: formatMessage(intl.eventsList),
				}
			]}
		/>
	)
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoriesEvents);