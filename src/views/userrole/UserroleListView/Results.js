import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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
	getComparator,
	applyPagination,
	sortOptionsDefault,
	descendingComparator,
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

const Results = ({ intl, userroles, deleteRole, deleteRoles }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedUserroles, setSelectedUserroles ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (e) => {
		e.persist();
		setQuery(e.target.value);
	};

	const handleSortChange = (e) => {
		e.persist();
		setSort(e.target.value);
	};

	const handleSelectAllUserroles = (event) => {
		setSelectedUserroles(event.target.checked
			? userroles.map((userrole) => userrole.id)
			: []);
	};

	const handleSelectOneUserrole = (event, userroleId) => {
		if (!selectedUserroles.includes(userroleId)) {
			setSelectedUserroles((prevSelected) => [...prevSelected, userroleId]);
		} else {
			setSelectedUserroles((prevSelected) => prevSelected.filter((id) => id !== userroleId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredUserroles = applyFilters(userroles, query, filters, ['id', 'name']);
	const sortedUserroles = applySort(filteredUserroles, sort);
	const paginatedUserroles = applyPagination(sortedUserroles, page, limit);
	const enableBulkOperations = selectedUserroles.length > 0;
	const selectedSomeUserroles = selectedUserroles.length > 0 && selectedUserroles.length < userroles.length;
	const selectedAllUserroles = selectedUserroles.length === userroles.length;
	
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
								<SvgIcon fontSize="small" color="action" >
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
					label="Sort By"
					name="sort"
					onChange={handleSortChange}
					select
					SelectProps={{ native: true }}
					value={sort}
					variant="outlined"
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
							checked={selectedAllUserroles}
							onChange={handleSelectAllUserroles}
							indeterminate={selectedSomeUserroles}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={() => handleDeleteAllSelected(
								selectedUserroles,
								deleteRoles,
								setSelectedUserroles,
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
										checked={selectedAllUserroles}
										indeterminate={selectedSomeUserroles}
										onChange={handleSelectAllUserroles}
									/>
								</TableCell>

								<TableCell>
									{formatMessage(intl.name)}
								</TableCell>

								<TableCell>
									{formatMessage(intl.description)}
								</TableCell>

								<TableCell align="right">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedUserroles.map((userrole) => {
								const isUserroleSelected = selectedUserroles.includes(userrole.id);

								return (
									<TableRow
										hover
										key={userrole.id}
										selected={isUserroleSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isUserroleSelected}
												onChange={(event) => handleSelectOneUserrole(event, userrole.id)}
												value={isUserroleSelected}
											/>
										</TableCell>

										<TableCell>
												{userrole.name}
										</TableCell>

										<TableCell>
												{userrole.description}
										</TableCell>

										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlUserRolesEdit, { userId: userrole.id }) }
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>

											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													userrole.id,
													deleteRole,
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
				page={page}
				component="div"
				rowsPerPage={limit}
				onChangePage={handlePageChange}
				count={filteredUserroles.length}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	userroles: PropTypes.array
};

Results.defaultProps = {
	userroles: []
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