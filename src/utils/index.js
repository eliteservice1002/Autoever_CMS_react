/**
 * [FormatDate description]
 * @param  {string} $date the expected format is:
 * => 2020-08-20T17:07:50+00:00
 * @return {string} the format would be 2020-08-20T14:07:50 (H:M:S)
 */
export function formatDate(date) {
	let t = new Date(date);
	let formattedDate =
		`${t.getFullYear()}-${('0' + (t.getMonth() + 1)).slice(-2)}`+
		`-${('0' + t.getDate()).slice(-2)}T` +
		`${('0' + t.getHours()).slice(-2)}:`+
		`${('0' + t.getMinutes()).slice(-2)}:`+
		`${('0' + t.getSeconds()).slice(-2)}`;
	return formattedDate;
}

export async function printErrors(errors, enqueue, intl = null) {
	console.error(errors);
	if(errors.hasOwnProperty('exception')) {
		enqueue(
			(intl) 
				? intl.formatMessage(intl.serverError)
				: 'An error occurred on the server',
			{ variant: 'error' }
		);
	} else {
		for(let err in errors) {
			await new Promise(resolve => {
				setTimeout(() => {
					try {
						enqueue(errors[err], {
							variant: 'error',
						})
						resolve()
					} catch(err) {
						console.log(err)
					}
				}, 1000)
			})
		}
	}
}

export function safeJSONStringify(s) {
	try {
		return JSON.stringify(s);
	} catch (err) {
		console.error(err);
		return null;
	}
};

export function safeJSONParse(s) {
	try {
		return JSON.parse(s);
	} catch (err) {
		console.error(err);
		return null;
	}
};


export function formatLanguageToString(lang, currentLanguage = null) {
	try {
		let msg = '';
		if(currentLanguage && lang) {
			msg = lang[currentLanguage.cod];
		} else if(lang) {
			msg = lang[Object.keys(lang)[0]];
		}
		return msg;
	} catch (err) {
		console.error(err);
		return '';
	}
}