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
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
	Edit as EditIcon,
	Search as SearchIcon
} from 'react-feather';

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

const Results = ({
	intl,
	className,
	securityChecks,
	deleteSecurityCheck,
	deleteSecurityChecks,
	...rest
}) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedData, setSelectedData ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllData = (event) => {
		setSelectedData(event.target.checked
			? securityChecks.map((el) => el.id)
			: []);
	};

	const handleSelectOne = (event, itemId) => {
		if (!selectedData.includes(itemId)) {
			setSelectedData((prevSelected) => [...prevSelected, itemId]);
		} else {
			setSelectedData((prevSelected) => prevSelected.filter((id) => id !== itemId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredBusRouteTypes = applyFilters(securityChecks, query, filters, ['name']);
	const sortedBusRouteTypes = applySort(filteredBusRouteTypes, sort);
	const paginatedBusRouteTypes = applyPagination(sortedBusRouteTypes, page, limit);
	const enableBulkOperations = selectedData.length > 0;
	const selectedSomeBusRouteTypes = selectedData.length > 0 && selectedData.length < securityChecks.length;
	const selectedAllData = selectedData.length === securityChecks.length;

	return (
		
		<Card className={clsx(classes.root, className)} >
			<Box p={2} minHeight={56} display="flex" alignItems="center" >
				<TextField
					className={classes.queryField}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SvgIcon
									fontSize="small"
									color="action"
								>
									<SearchIcon />
								</SvgIcon>
							</InputAdornment>
						)
					}}
					onChange={handleQueryChange}
					value={query}
					variant="outlined"
					placeholder={formatMessage(intl.search)}
				/>
				<Box flexGrow={1} />
				{/*
				<TextField
					select
					name="sort"
					value={sort}
					label="Sort By"
					variant="outlined"
					onChange={handleSortChange}
					SelectProps={{ native: true }}
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
							checked={selectedAllData}
							onChange={handleSelectAllData}
							indeterminate={selectedSomeBusRouteTypes}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={handleDeleteAllSelected}
							onClick={() => handleDeleteAllSelected(
								selectedData,
								deleteSecurityChecks,
								setSelectedData,
								enqueueSnackbar,
								{ ...intl, formatMessage }
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
										checked={selectedAllData}
										onChange={handleSelectAllData}
										indeterminate={selectedSomeBusRouteTypes}
									/>
								</TableCell>

								<TableCell>
									{formatMessage(intl.name)}
								</TableCell>
								<TableCell align="right">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedBusRouteTypes.map((el) => {
								const isItemSelected = selectedData.includes(el.id);

								return (
									<TableRow
										hover
										key={el.id}
										selected={isItemSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isItemSelected}
												onChange={(event) => handleSelectOne(event, el.id)}
												value={isItemSelected}
											/>
										</TableCell>

										<TableCell>
												{el.name}
										</TableCell>

										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlSecurityChekEdit, {id: el.id})}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													el.id,
													deleteSecurityCheck,
													enqueueSnackbar,
													{ ...intl, formatMessage }
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
				count={filteredBusRouteTypes.length}
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
	className: PropTypes.string,
	securityChecks: PropTypes.array
};

Results.defaultProps = {
	securityChecks: []
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(Results);