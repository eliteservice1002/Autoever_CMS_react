import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const RestricGuard = ({ children, roles, intl }) => {
	const { user } = useAuth();

	if (!roles.includes(user.role)) {
		return <Redirect to={ formatMessage(intl.urlDashboard) } />;
	}

	return (
		<Fragment>
			{children}
		</Fragment>
	);
};

RestricGuard.propTypes = {
	children: PropTypes.node
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
)(RestricGuard);