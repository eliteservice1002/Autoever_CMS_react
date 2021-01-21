import React, { Fragment, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { Redirect, useHistory } from 'react-router-dom';

/* utils */
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const AuthGuard = ({ children, intl }) => {
	const auth = useAuth();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		var timeoutID = null;
		httpClient.get(`api/expires-token`)
		.then(({ expires_in }) => {
			if(expires_in > 0) {
				timeoutID = setTimeout(() => {
					// log out - token expiration
					auth.logout();
					enqueueSnackbar(formatMessage(intl.sessionExpired), {
						variant: 'warning'
					});

					history.push(formatMessage(intl.urlLogin));
				}, (expires_in * 1000))
			}
		})

		return () => {
			clearTimeout(timeoutID);
		}
	}, []);

	if (!auth.isAuthenticated) {
		return <Redirect to={ formatMessage(intl.urlLogin) } />;
	}

	return (
		<Fragment>
			{children}
		</Fragment>
	);
};

AuthGuard.propTypes = {
	children: PropTypes.node
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
});

export default connectIntl(mapStateToProps)(AuthGuard);