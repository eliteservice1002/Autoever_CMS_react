import React, { useState } from 'react';

import {
	Box,
	AppBar,
	Hidden,
	Switch,
	Toolbar,
	SvgIcon,
	IconButton,
	makeStyles,
	FormControlLabel,
} from '@material-ui/core';
import clsx from 'clsx';
import Search from './Search';
import Account from './Account';
import Language from './Language';
import PropTypes from 'prop-types';
import Logo from 'src/components/Logo';
import { THEMES } from 'src/constants';
import useSettings from 'src/hooks/useSettings';
import { Menu as MenuIcon } from 'react-feather';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		zIndex: theme.zIndex.drawer + 100,
		...theme.name === THEMES.LIGHT ? {
			boxShadow: 'none',
			backgroundColor: theme.palette.primary.main
		} : {},
		...theme.name === THEMES.ONE_DARK ? {
			backgroundColor: theme.palette.background.default
		} : {}
	},
	toolbar: {
		minHeight: 64,
	}
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
	const classes = useStyles();
	const [ values, setValues ] = useState();
	const [ myActive, setMyActive ] = useState(true);
	const { settings, saveSettings } = useSettings();

	const handleChange = (field, value) => {
		setValues({
			direction: settings.direction,
			responsiveFontSizes: settings.responsiveFontSizes,
			[field]: value
		});
		handleSave();
	};

	const handleSave = () => {
		console.log(values);
		if(!values) {
			saveSettings({
				"direction": "ltr",
				"theme":"ONE_DARK",
				"responsiveFontSizes": true,
			});
			console.log('yes')
		}
		else saveSettings(values);
		setMyActive(!myActive)
	};

	return (
		<AppBar
			className={clsx(classes.root, className)}
			{...rest}
		>
			<Toolbar className={classes.toolbar}>
				<Hidden lgUp>
					<IconButton
						color="inherit"
						onClick={onMobileNavOpen}
					>
						<SvgIcon fontSize="small">
							<MenuIcon />
						</SvgIcon>
					</IconButton>
				</Hidden>
				<Hidden mdDown>
					<RouterLink to="/">
						<Logo />
					</RouterLink>
				</Hidden>
				<Box
					ml={2}
					flexGrow={1}
				/>
				<FormControlLabel
					control={(
						<Switch
							checked={myActive}
							edge="start"
							name="theme"
							onChange={(event) => handleChange('theme', event.target.checked ? 'ONE_DARK' : 'LIGHT')}
						/>
					)}
					// label="RTL"
				/>

				<Search />

				<Box ml={2}>
					<Account />
				</Box>
				<Box ml={2}>
					<Language />
				</Box>
			</Toolbar>
		</AppBar>
	);
};
TopBar.propTypes = {
	className: PropTypes.string,
	onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
	onMobileNavOpen: () => {}
};

export default TopBar;
