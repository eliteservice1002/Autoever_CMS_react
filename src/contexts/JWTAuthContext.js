import React, {
	createContext,
	useEffect,
	useReducer
} from 'react';
// import jwtDecode from 'jwt-decode';
import SplashScreen from 'src/components/SplashScreen';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom'
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const initialAuthState = {
	isAuthenticated: false,
	isInitialised: false,
	user: null
};

// const isValidToken = (accessToken) => {
//   if (!accessToken) {
//     return false;
//   }

//   const decoded = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;

//   return decoded.exp > currentTime;
// };

const setSession = (accessToken) => {
	if (accessToken) {
		localStorage.setItem('accessToken', accessToken);
	} else {
		localStorage.removeItem('accessToken');
	}
};

const setSession2FA = (accessToken) => {
	if (accessToken) {
		localStorage.setItem('accessToken2FA', accessToken);
	} else {
		localStorage.removeItem('accessToken2FA');
	}
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'INITIALISE': {
			const { isAuthenticated, user} = action.payload;

			return {
				...state,
				isAuthenticated,
				isInitialised: true,
				user
			};
		}
		case 'LOGIN': {
			const { user } = action.payload;

			return {
				...state,
				isAuthenticated: true,
				user
			};
		}
		case 'LOGOUT': {
			return {
				...state,
				isAuthenticated: false,
				user: null
			};
		}
		case 'REGISTER': {
			const { user } = action.payload;

			return {
				...state,
				isAuthenticated: true,
				user
			};
		}
		default: {
			return { ...state };
		}
	}
};

const AuthContext = createContext({
	...initialAuthState,
	method: 'JWT',
	login_2fa: () => Promise.resolve(),
	login: () => Promise.resolve(),
	logout: () => { },
	register: () => Promise.resolve()
});

export const AuthProviderWrapper = ({ children, intl }) => {
	const [state, dispatch] = useReducer(reducer, initialAuthState);
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const login_2fa = async (secret) => {
		httpClient.post('api/login2fa', {secret: secret, token_2fa: window.localStorage.getItem('accessToken2FA')})
		.then(json => {
				if(json.status){
					const { user } = json;
					setSession(window.localStorage.getItem('accessToken2FA'))
					setSession2FA(null)
					dispatch({
						type: 'LOGIN',
						payload: {
							user
						}
					});
				}
				else {
					enqueueSnackbar(json.msg, {
						variant: 'danger',
					})
				}
		})
		.catch((error) => {
			enqueueSnackbar(error, {
				variant: 'danger',
			})
		});
	};

	const login = async (email, password) => {
		httpClient.post('api/login', {
			email: email,
			password: password
		})
		.then(json => {
				if(json.status){
					const { accessToken, user } = json;
					if(user.google2fa_enable) {
						setSession2FA(accessToken)
						history.push(formatMessage(intl.url2faLogin))
					}
					else {
						setSession(accessToken)
						dispatch({
							type: 'LOGIN',
							payload: {
								user
							}
						});
					}
				}
				else {
					enqueueSnackbar(json.msg, {
						variant: 'danger',
					})
				}
		})
		.catch((error) => {
			enqueueSnackbar(error, {
				variant: 'danger',
			})
		});
	};

	const logout = () => {
		setSession(null);
		setSession2FA(null);
		dispatch({ type: 'LOGOUT' });
	};

	const register = async (email, name, password) => {
		const response = await axios.post('/api/account/register', {
			email,
			name,
			password
		});
		const { accessToken, user } = response.data;

		window.localStorage.setItem('accessToken', accessToken);

		dispatch({
			type: 'REGISTER',
			payload: {
				user
			}
		});
	};

	useEffect(() => {
		const initialise = async () => {
			try {
				const accessToken = window.localStorage.getItem('accessToken');

				if (accessToken) {
					setSession(accessToken);
					httpClient.get('api/userinfo')
						.then(json => {
							if (json.status) {
								const { user } = json;
								dispatch({
									type: 'INITIALISE',
									payload: {
										isAuthenticated: true,
										user
									}
								});
							}
							else {
								dispatch({
									type: 'INITIALISE',
									payload: {
										isAuthenticated: false,
										user: null
									}
								});
							}
						})
						.catch((err) => {
							console.error(err);
							dispatch({
								type: 'INITIALISE',
								payload: {
									isAuthenticated: false,
									user: null
								}
							});
						});
				} else {
					dispatch({
						type: 'INITIALISE',
						payload: {
							isAuthenticated: false,
							user: null
						}
					});
				}
			} catch (err) {
				console.error(err);
				dispatch({
					type: 'INITIALISE',
					payload: {
						isAuthenticated: false,
						user: null
					}
				});
			}
		};

		initialise();
	}, []);

	if (!state.isInitialised) {
		return <SplashScreen />;
	}

	return (
		<AuthContext.Provider
			value={{
				...state,
				method: 'JWT',
				login,
				login_2fa,
				logout,
				register
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
});

export const AuthProvider = connectIntl(mapStateToProps)(AuthProviderWrapper);

export default AuthContext;
