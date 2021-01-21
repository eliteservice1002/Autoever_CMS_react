import axios from 'src/utils/axios';
import httpClient from 'src/utils/httpClient';
import {
	CHANGE_LANGUAGE,
} from 'src/constants.js';

/*
 * @param {Object} payload
 * @param {Function} dispatch
*/
export const changeLanguage = async (language, dispatch, store) => {
	let df = store.intl.languageList.EN;
	let messages = store.intl.languageList[language.cod];

	if(typeof messages !== 'object') {
		messages = df;
	} else if(Object.keys(messages).length !== Object.keys(df).length) {
		// Faltan traduciones en el lenguaje seleccionado
		// completarlo con el lenguaje por defecto
		for(let i in df) {
			if(!messages[i] || !messages[i].defaultMessage) {
				messages[i] = df[i];
			}
		}
	}

	let languageTmp = findCurrentLanguage(language, messages);

	if(messages && languageTmp) {
		dispatch({
			type: CHANGE_LANGUAGE,
			payload: {
				messages,
				language: languageTmp,
			}
		})
	}
}

const findCurrentLanguage = (old, data) => {
	for(let i in data) {
		if(data[i].key == old.key) {
			var currentLanguage = {
				...data[i],
				cod: old.cod,
			}
			break;
		}
	}
	return currentLanguage;
}