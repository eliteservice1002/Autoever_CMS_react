/* eslint-disable no-use-before-define */
import React, { useEffect, Fragment } from 'react';

import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation, matchPath } from 'react-router-dom';
import {
	Box,
	Link,
	List,
	Avatar,
	Drawer,
	Hidden,
	Divider,
	makeStyles,
	Typography,
	ListSubheader,
} from '@material-ui/core';

import {
	Home as HomeIcon,
	Globe as GlobeIcon,
	Settings as SettingsIcon,
} from 'react-feather';

import NavItem from './NavItem';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
	mobileDrawer: {
		width: 256
	},
	desktopDrawer: {
		width: 256,
		top: 64,
		height: 'calc(100% - 64px)'
	},
	avatar: {
		cursor: 'pointer',
		width: 64,
		height: 64
	}
}));

const NavBar = ({ onMobileClose, openMobile, intl, language }) => {
	const { user } = useAuth();
	const classes = useStyles();
	const location = useLocation();

	const sections = [
		{
			items: [
				{
					title: formatMessage(intl.dashboard),
					icon: HomeIcon,
					href: formatMessage(intl.urlDashboard)
				}
			]
		},
		{
			items: [
				{
					title: formatMessage(intl.appContents),
					icon: GlobeIcon,
					roles: ['SYSTEMADMIN','CMSUSER'],
					href: formatMessage(intl.urlAppContents),
					items: [
						{
							title: formatMessage(intl.appuser),
							href: formatMessage(intl.urlAppuserList),
						},
						{
							title: formatMessage(intl.sosContacts),
							href: formatMessage(intl.urlSosContacts)
						},
						{
							title: formatMessage(intl.terminConditions),
							href: formatMessage(intl.urlTerminConditions)
						},
						{
							title: formatMessage(intl.privacyNotice),
							href: formatMessage(intl.urlPrivacyNotice)
						},
						{
							title: formatMessage(intl.benefits),
							href: formatMessage(intl.urlBenefits),
							items: [
								{
									title: formatMessage(intl.list),
									href: formatMessage(intl.urlBenefits),
								},
								{
									title: formatMessage(intl.categories),
									href: formatMessage(intl.urlBenefitsCategories)
								}
							]
						},
						{
							title: formatMessage(intl.busRoutes),
							href: formatMessage(intl.urlBusRoutes),
							items: [
								{
									title: formatMessage(intl.list),
									href: formatMessage(intl.urlBusRoutesList)
								},
								{
									title: formatMessage(intl.type),
									href: formatMessage(intl.urlBusRoutesTypeList)
								}
							]
						},
						{
							title: formatMessage(intl.news),
							href: formatMessage(intl.urlNews),
							items: [
								{
									title: formatMessage(intl.list),
									href: formatMessage(intl.urlNews)
								},
								{
									title: formatMessage(intl.categories),
									href: formatMessage(intl.urlNewsCategories)
								}
							]
						},
						{
							title: formatMessage(intl.events),
							href: formatMessage(intl.urlEvents),
							items: [
								{
									title: formatMessage(intl.list),
									href: formatMessage(intl.urlEvents),
								},
								{
									title: formatMessage(intl.categories),
									href: formatMessage(intl.urlEventsCategories),
								}
							]
						},
						{
							title: formatMessage(intl.innovationBox),
							href: formatMessage(intl.urlInnovationBox),
							items: [
								{
									title: formatMessage(intl.list),
									href: formatMessage(intl.urlInnovationBox),
								},
								{
									title: formatMessage(intl.categories),
									href: formatMessage(intl.urlInnovationBoxCategories),
								},
								{
									title: formatMessage(intl.fastAnswers),
									href: formatMessage(intl.urlFastAnswers),
								}
							]
						},
						{
							title: formatMessage(intl.faqs),
							href: formatMessage(intl.urlFaqs),
						},
						{
							title: formatMessage(intl.requestForHelp),
							href: formatMessage(intl.urlRequestForHelp),
            },
            {
							title: formatMessage(intl.surveys),
							href: formatMessage(intl.urlSurveys),
						},
					]
				},

				{
					title: formatMessage(intl.setting),
					icon: SettingsIcon,
					roles: ['SUPERADMIN', 'SYSTEMADMIN'],
					href: formatMessage(intl.urlSettings),
					items: [
						{
							title: formatMessage(intl.userRoles),
							href: formatMessage(intl.urlUserRoles),
						},
						{
							title: formatMessage(intl.cmsUsers),
							href: formatMessage(intl.urlCmsUsers),
						},
						{
							roles: ['SYSTEMADMIN'],
							title: formatMessage(intl.companyInfo),
							href: formatMessage(intl.urlSettingCompany),
						},
						{
							roles: ['SYSTEMADMIN'],
							title: formatMessage(intl.securityChecks),
							href: formatMessage(intl.urlSecurityCheks),
						},
						{
							roles: ['SYSTEMADMIN'],
							title: formatMessage(intl.cmsAccessLog),
							href: formatMessage(intl.urlCmsAccessLog),
						},
					]
				},
				{
					icon: SettingsIcon,
					roles: ['SUPERADMIN'],
					title: formatMessage(intl.superAdmin),
					href: formatMessage(intl.urlSuperAdmin),
					items: [
						{
							title: formatMessage(intl.companies),
							href: formatMessage(intl.urlCompanies),
						},
						{
							title: formatMessage(intl.systemAdmins),
							href: formatMessage(intl.urlSystemAdmins),
						},
						{
							title: formatMessage(intl.cmsAccessLog),
							href: formatMessage(intl.urlCmsAccessLog),
						},
					]
				},
				{
					icon: SettingsIcon,
					title: formatMessage(intl.twoFactor),
					href: formatMessage(intl.urlSetup2fa),
					items: [
						{
							title: formatMessage(intl.setup2fa),
							href: formatMessage(intl.urlSetup2fa),
						}
					]
				},
			]
		},
	];

	useEffect(() => {
		if (openMobile && onMobileClose) {
			onMobileClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	function renderNavItems({
		items,
		pathname,
		depth = 0
	}) {
		return (
			<List disablePadding>
				{items.reduce(
					(acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
					[]
				)}
			</List>
		);
	}

	function reduceChildRoutes({
		acc,
		pathname,
		item,
		depth
	}) {
		const key = item.title + depth;

		if (item.roles && !item.roles.includes(user.role)) {
			// The current user does not have the required permissions
			return acc;
		}

		if (item.items) {
			const open = matchPath(pathname, {
				path: item.href,
				exact: false
			});

			acc.push(
				<NavItem
					depth={depth}
					icon={item.icon}
					info={item.info}
					key={key}
					open={Boolean(open)}
					title={item.title}
				>
					{renderNavItems({
						depth: depth + 1,
						pathname,
						items: item.items,
					})}
				</NavItem>
			);
		} else {
			acc.push(
				<NavItem
					depth={depth}
					href={item.href}
					icon={item.icon}
					info={item.info}
					key={key}
					title={item.title}
				/>
			);
		}

		return acc;
	}

	const content = (
		<Box
			height="100%"
			display="flex"
			flexDirection="column"
		>
			<PerfectScrollbar options={{ suppressScrollX: true }}>
				<Hidden lgUp>
					<Box
						p={2}
						display="flex"
						justifyContent="center"
					>
						<RouterLink to="/">
							<Logo color="true" />
						</RouterLink>
					</Box>
				</Hidden>

				<Box p={2}>
					<Box textAlign="center" >
						<Typography variant="body2" color="textSecondary" >
							¡HolaH!
						</Typography>

						<Typography variant="body2" color="textSecondary" >
							{user.name}
						</Typography>
				{/*
						<RouterLink to="/app/account">
							<Avatar
								alt="User"
								className={classes.avatar}
								src={user.avatar}
							/>
						</RouterLink>
					</Box>
					<Box
						mt={2}
						textAlign="center"
					>
						<Link
							component={RouterLink}
							to="/app/account"
							variant="h5"
							color="textPrimary"
							underline="none"
						>
							{user.name}
						</Link>
						<Typography
							variant="body2"
							color="textSecondary"
						>
							Your tier:
							{' '}
							<Link
								component={RouterLink}
								to="/pricing"
							>
								{user.tier || 'Normal'}
							</Link>
						</Typography>
				*/}
					</Box>
				</Box>

				<Divider />

				<Box p={2}>
					{sections.map((section, index) => (
						<List
							key={index}
							subheader={(
								<ListSubheader
									key={section.subheader}
									disableGutters
									disableSticky
								>
									{section.subheader}
								</ListSubheader>
							)}
						>
							{renderNavItems({
								items: section.items,
								pathname: location.pathname,
							})}
						</List>
					))}
				</Box>
			</PerfectScrollbar>
		</Box>
	);
	return (
		<Fragment>
			<Hidden lgUp>
				<Drawer
					anchor="left"
					classes={{ paper: classes.mobileDrawer }}
					onClose={onMobileClose}
					open={openMobile}
					variant="temporary"
				>
					{content}
				</Drawer>
			</Hidden>
			<Hidden mdDown>
				<Drawer
					anchor="left"
					classes={{ paper: classes.desktopDrawer }}
					open
					variant="persistent"
				>
					{content}
				</Drawer>
			</Hidden>
		</Fragment>
	);
};

NavBar.propTypes = {
	openMobile: PropTypes.bool,
	onMobileClose: PropTypes.func,
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	language: store.intl.language,
})

export default connectIntl(mapStateToProps)(NavBar);