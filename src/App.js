import React from 'react';

import {
	jssPreset,
	StylesProvider,
	ThemeProvider
} from '@material-ui/core';

import rtl from 'jss-rtl';
import { create } from 'jss';
import { createTheme } from 'src/theme';
import { Router } from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { createBrowserHistory } from 'history';
import useSettings from 'src/hooks/useSettings';
import routes, { renderRoutes } from 'src/routes';
import ScrollReset from 'src/components/ScrollReset';
import GlobalStyles from 'src/components/GlobalStyles';
import { AuthProvider } from 'src/contexts/JWTAuthContext';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

/* connectIntl */
import { connectIntl } from 'src/contexts/Intl';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();


const App = ({ intl }) => {
	const { settings } = useSettings();

	const theme = createTheme({
		direction: settings.direction,
		responsiveFontSizes: settings.responsiveFontSizes,
		theme: settings.theme
	});

	return (
		<ThemeProvider theme={theme}>
			<StylesProvider jss={jss}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<SnackbarProvider
						dense
						maxSnack={3}
					>
						<Router history={history}>
							<AuthProvider>
								<GlobalStyles />
								<ScrollReset />
								<GoogleAnalytics />
								{renderRoutes(routes, intl)}
							</AuthProvider>
						</Router>
					</SnackbarProvider>
				</MuiPickersUtilsProvider>
			</StylesProvider>
		</ThemeProvider>
	);
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
)(App);