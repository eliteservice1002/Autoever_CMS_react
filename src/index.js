import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import 'prismjs/prism';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'nprogress/nprogress.css';
import 'src/__mocks__';
import 'src/assets/css/prism.css';
import 'src/mixins/chartjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { enableES5 } from 'immer';
import * as serviceWorker from 'src/serviceWorker';
import store from 'src/store';
import { SettingsProvider } from 'src/contexts/SettingsContext';
import App from 'src/App';
import IntlProvider from "./contexts/IntlProvider";
import intl from "./reducers/intl";

enableES5();
localStorage.setItem('settings','{"direction":"ltr","responsiveFontSizes":true,"theme":"LIGHT"}')
ReactDOM.render(
  <IntlProvider reducer={intl} >
	  <Provider store={store}>
	    <SettingsProvider>
	      <App />
	    </SettingsProvider>
	  </Provider>
  </IntlProvider>,
  document.getElementById('root')
);

serviceWorker.register();
