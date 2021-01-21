import React, { useContext } from 'react';
import IntlContext from './IntlContext';

const connectIntl = (mapState, mapDispatch = () => {}) => {
	return WrappedComponent => {
		return (props) => {
			const { store, dispatch } = useContext(IntlContext);
			return (
				<WrappedComponent {...props} {...mapState(store)} {...mapDispatch(dispatch, store)} />
			);
		};
	};
};

const formatMessage = (message, params = null) => {
	let result = '';

	if(typeof message === 'object') {
		result = message.defaultMessage;

		if(params) {
			for(let key in params) {
				let match = new RegExp(`{${key}}`, 'g');
				result = result.replace(match, params[key]);
			}
		}
	}

	return result;
}

export {
	connectIntl,
	formatMessage,
}