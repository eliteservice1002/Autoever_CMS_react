import combineReducers from './combineReducers';
import {
	INIT_INTL,
	CHANGE_LANGUAGE,
} from 'src/constants.js';
import languageList from 'src/languages';

const init = {
	languageList,
	messages: languageList.EN,
	language: {
		cod: 'EN',
		...languageList.EN.language_en,
	}
};

const intl = (state = init, action) => {
	switch(action.type) {
		case CHANGE_LANGUAGE:
			return { ...state, ...action.payload };

		case INIT_INTL:
			let newLanguageList = { ...state.languageList };
			for (let cod in newLanguageList) {
				if(state.language.cod !== cod) {
					for(let key in state.messages) {
						if(newLanguageList[cod].hasOwnProperty(key)) {
							newLanguageList[cod][key].key = state.messages[key].key;
						}
					}
				}
			}

			return {
				...state,
				languageList: newLanguageList,
			};

		default:
			return state;
	}
};

const reducer = combineReducers({
	intl,
});

export default reducer;