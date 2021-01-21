import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import {
	Box,
	Menu,
	Hidden,
	Avatar,
	MenuItem,
	ButtonBase,
	makeStyles,
	Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';

/* intl */
import { safeJSONStringify } from 'src/utils/';
import { changeLanguage } from 'src/actions/languageAction';
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	popover: {
		width: 200
	},
	avatar: {
		height: 32,
		width: 32,
		marginRight: theme.spacing(1)
	}
}));

const Language = ({ intl, currentLanguage, changeLanguage, fillLanguageList }) => {
	const ref = useRef(null);
	const classes = useStyles();
	const [ isOpen, setOpen ] = useState(false);

	/**
	 * Lenguajes habilitados para el CMS.
	 * Cada una de las propiedades del objeto intl inicial
	 * por ejemplo => 'intl.language_en' debe existir en el objeto
	 * de lenguaje seleccionado por defecto el cual es definido en => 'src/reducers/intl.js'
	 * y que cada una de los valores de la propiedad 'cod' de los objetos del array 'availableLanguages'
	 * de lenguajes habilitados corresponda con la clave del idioma al que pertenece
	 * en 'src/languages/index.js'
	 * @type {array[object]}
	**/
	const [ availableLanguages, setAvailableLanguages ] = useState([
		{
			cod: 'ES',
			...intl.language_es
		},
		{
			cod: 'EN',
			...intl.language_en
		},
		{
			cod: 'KO',
			...intl.language_ko
		}
	]);

	useEffect(() => {
		setAvailableLanguages([
			{
				cod: 'ES',
				...intl.language_es
			},
			{
				cod: 'EN',
				...intl.language_en
			},
			{
				cod: 'KO',
				...intl.language_ko
			}
		]);
	},[ currentLanguage ])

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleClick = (language) => {
		handleClose();
		changeLanguage(language);
	}

	return (
		<Fragment>
			<Box
				display="flex"
				alignItems="center"
				component={ButtonBase}
				onClick={handleOpen}
				ref={ref}
			>
				<Avatar className={classes.avatar}>
					<LanguageIcon />
				</Avatar>

				<Hidden smDown>
					<Typography
						variant="h6"
						color="inherit"
					>
						{formatMessage(currentLanguage)}
					</Typography>
				</Hidden>
			</Box>

			<Menu
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				keepMounted
				open={isOpen}
				anchorEl={ref.current}
				getContentAnchorEl={null}
				PaperProps={{ className: classes.popover }}
			>
			{
				availableLanguages.map((l) => {
					if(
						l.key == currentLanguage.key
						|| !l.hasOwnProperty('defaultMessage')
					) return null;

					return(
						<MenuItem key={l.key} onClick={() => handleClick(l)} >
							{formatMessage(l)}
						</MenuItem>
					)
				})
			}
			</Menu>
		</Fragment>
	);
}

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
});

const mapDispatchToProps = (dispatch, store) => ({
	changeLanguage: (language) => dispatch(changeLanguage(language, dispatch, store))
})

export default connectIntl(
	mapStateToProps,
	mapDispatchToProps,
)(Language);
