import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Tab,
	Tabs,
	TextField,
	makeStyles,
} from '@material-ui/core';

/* utils */
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => {
	return {
		root: {
			'& .MuiTab-root': {
				minWidth: 'auto',
			},
			'& .MuiTabs-flexContainer': {
				justifyContent: 'flex-end'
			},
		}
	}
});

const TextFieldSwitchLanguage = ({
	error,
	touched,
	valueML,
	onChange,
	setValueML,
	propsTextField,
}) => {
	const classes = useStyles();
	const [ languages, setLanguages ] = useState([]);
	const [ languageCod, setLanguageCod ] = useState(null);

	useEffect(() => {
		httpClient.get('api/languages')
		.then(({ data }) => {
			setLanguages(data);
			setLanguageCod(data[0].cod);
		})
	}, [])

	const handleMultiLanguage = (e, prevValue, setValue, onChange) => {
		let { value } = e.target;
		let l = languages.find((el) => el.cod == languageCod);

		if(propsTextField.required) {
			try {
				if(!value.trim() && !Boolean(prevValue[languageCod])) return;
			} catch(err) {
				console.error(err);
				return;
			}
		}

		setValue((prevState) => {
			return {
				...prevState,
				[l.cod]: value
			};
		});
	}

	const handleChangeTab = (event, newValue) => {
		setLanguageCod(newValue);
	};

	const isError = () => {
		let countNotEmpty = 0;
		for(let i in  valueML) {
			valueML[i] && countNotEmpty++;
		}
		return !Boolean(countNotEmpty);
	}

	return((!languageCod) ? null :
		<div className={classes.root} >
			<Tabs
				textColor='primary'
				value={languageCod}
				indicatorColor='primary'
				onChange={handleChangeTab}
				aria-label='language tabs'
			>
				{languages.map((el) => {
					return(
						<Tab
							key={el.id}
							label={el.cod}
							value={el.cod}
							title={el.title}
							variant='fullWidth'
						/>
					);
				})}
			</Tabs>
		<TextField
			{ ...propsTextField }
			value={valueML[languageCod] || ''}
			error={Boolean(touched && isError())}
			onChange={(e) => handleMultiLanguage(e, valueML, setValueML, onChange)}
			helperText={ (Boolean(touched && !Object.keys(valueML).length) || error) ? error : '' }
		/>
		</div>
	)
}

TextFieldSwitchLanguage.defaultProps = {
	setValueML: () => {},
}

export default TextFieldSwitchLanguage;