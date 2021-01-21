import React, { useState } from 'react';
import clsx from 'clsx';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Card,
	Table,
	Button,
	SvgIcon,
	Checkbox,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TextField,
	makeStyles,
	IconButton,
	InputAdornment,
	TablePagination,
} from '@material-ui/core';
import {
	Edit as EditIcon,
	Search as SearchIcon,
} from 'react-feather';
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

/* utils */
import {
	applySort,
	handleDelete,
	applyFilters,
	applyPagination,
	sortOptionsDefault,
	handleDeleteAllSelected,
} from 'src/utils/defaultTableSettings';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {},
	queryField: {
		width: 500
	},
	bulkOperations: {
		position: 'relative'
	},
	bulkActions: {
		paddingLeft: 4,
		paddingRight: 4,
		marginTop: 6,
		position: 'absolute',
		width: '100%',
		zIndex: 2,
		backgroundColor: theme.palette.background.default
	},
	bulkAction: {
		marginLeft: theme.spacing(2)
	},
	avatar: {
		height: 42,
		width: 42,
		marginRight: theme.spacing(1)
	}
}));

const Results = ({ intl, appusers, deleteAppuser, deleteAppusers }) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ filters, setFilters ] = useState({});
	const [ selectedAppusers, setSelectedAppusers ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllAppuser = (event) => {
		setSelectedAppusers(event.target.checked
			? appusers.map((appuser) => appuser.id)
			: []);
	};

	const handleSelectOneAppuser = (event, appuserId) => {
		if (!selectedAppusers.includes(appuserId)) {
			setSelectedAppusers((prevSelected) => [...prevSelected, appuserId]);
		} else {
			setSelectedAppusers((prevSelected) => prevSelected.filter((id) => id !== appuserId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredAppuser = applyFilters(appusers, query, filters, ['id', 'name']);
	const sortedAppuser = applySort(filteredAppuser, sort);
	const paginatedAppusers = applyPagination(sortedAppuser, page, limit);
	const enableBulkOperations = selectedAppusers.length > 0;
	const selectedSomeAppusers = selectedAppusers.length > 0 && selectedAppusers.length < appusers.length;
	const selectedAllAppusers = selectedAppusers.length === appusers.length;

	return (
		<Card className={clsx(classes.root)} >
			<Box
				p={2}
				minHeight={56}
				display="flex"
				alignItems="center"
			>
				<TextField
					className={classes.queryField}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SvgIcon
									color="action"
									fontSize="small"
								>
									<SearchIcon />
								</SvgIcon>
							</InputAdornment>
						)
					}}
					value={query}
					variant="outlined"
					onChange={handleQueryChange}
					placeholder={formatMessage(intl.search)}
				/>

				<Box flexGrow={1} />
				{/*
					<TextField
						select
						name="sort"
						value={sort}
						variant="outlined"
						onChange={handleSortChange}
						SelectProps={{ native: true }}
						label={formatMessage(intl.sortBy)}
					>
						{sortOptionsDefault.map((option) => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</TextField>
				*/}
			</Box>
			{enableBulkOperations && (
				<div className={classes.bulkOperations}>
					<div className={classes.bulkActions}>
						<Checkbox
							checked={selectedAllAppusers}
							onChange={handleSelectAllAppuser}
							indeterminate={selectedSomeAppusers}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
								onClick={() => handleDeleteAllSelected(
								selectedAppusers,
								deleteAppusers,
								setSelectedAppusers,
								enqueueSnackbar,
								{ ...intl, formatMessage}
							)}
						>
							{formatMessage(intl.deleteAll)}
						</Button>
					</div>
				</div>
			)}
			<PerfectScrollbar>
				<Box minWidth={700}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedAllAppusers}
										onChange={handleSelectAllAppuser}
										indeterminate={selectedSomeAppusers}
									/>
								</TableCell>
								<TableCell align="center">
									{formatMessage(intl.employeeNumber)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.name)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.location)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.departament)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.registrationDate)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.status)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedAppusers.map((appuser) => {
								const isAppuserSelected = selectedAppusers.includes(appuser.id);

								return (
									<TableRow
										hover
										key={appuser.id}
										selected={isAppuserSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isAppuserSelected}
												onChange={(event) => handleSelectOneAppuser(event, appuser.id)}
												value={isAppuserSelected}
											/>
										</TableCell>

										<TableCell align="center">
											{appuser.employee_number}
										</TableCell>

										<TableCell align="center">
											{appuser.name}
										</TableCell>

										<TableCell align="center">
											{appuser.location}
										</TableCell>

										<TableCell align="center">
											{appuser.department}
										</TableCell>

										<TableCell align="center">
											{Moment(Moment.utc(appuser.created_at)).local().format('DD/MM/YYYY hh:mm')}
										</TableCell>

										<TableCell align="center">
											{appuser.status}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlAppuserDetail, { userId: appuser.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlAppuserEdit, { userId: appuser.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												onClick={() => handleDelete(
													appuser.id,
													deleteAppuser,
													enqueueSnackbar,
													{ ...intl, formatMessage}
												)}
											>
												<SvgIcon fontSize="small">
													<HighlightOffIcon />
												</SvgIcon>
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
			<TablePagination
				component="div"
				count={filteredAppuser.length}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handleLimitChange}
				page={page}
				rowsPerPage={limit}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Card>
	);
};

Results.propTypes = {
	appusers: PropTypes.array,
	className: PropTypes.string,
};

Results.defaultProps = {
	appusers: []
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
)(Results);