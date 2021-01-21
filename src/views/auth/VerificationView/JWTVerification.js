import React, { useCallback, useEffect } from 'react';

import qs from 'querystringify';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';
import LoadingScreen from 'src/components/LoadingScreen';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const JWTVerification = ({ intl }) => {
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const initalize = useCallback(async () => {
		try {
			const { email, verification_key } = qs.parse(history.location.search);

			httpClient.post('api/verification', {
				email,
				verification_key
			})
			.then(json => {
					enqueueSnackbar(
						json.msg,
						{ variant: (json.status) ? 'success' : 'warning' }
					)
					return history.push(formatMessage(intl.urlLogin));
			})
			.catch((error) => {
				console.error(error);
				enqueueSnackbar(
						'Ocurrió un error inesperado. Por favor vuelva a intentar más tarde',
						{ variant: 'error' }
					)
				return history.push(formatMessage(intl.urlLogin))
			});
		} catch (err) {
			console.error(err);
		}
	}, [history]);

	useEffect(() => {
		initalize();
	}, [initalize]);

	return (
		<div style={{
			width: '100vw',
			height: '100vh',
			position: 'fixed',

		}} >
			<LoadingScreen />
		</div>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
});

export default connectIntl(mapStateToProps)(JWTVerification);