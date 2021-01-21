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

const Results = ({ intl, requestsForHelp, deleteRequestForHelper, deleteRequestsForHelper }) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ filters, setFilters ] = useState({});
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

	const handleSelectAll = (event) => {
		setSelectedData(event.target.checked
			? requestsForHelp.map((appuser) => appuser.id)
			: []);
	};

	const handleSelectOne = (event, elId) => {
		if (!selectedData.includes(elId)) {
			setSelectedData((prevSelected) => [...prevSelected, elId]);
		} else {
			setSelectedData((prevSelected) => prevSelected.filter((id) => id !== elId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filtered = applyFilters(requestsForHelp, query, filters, ['name', 'message', 'employee_number']);
	const sortedData = applySort(filtered, sort);
	const paginatedData = applyPagination(sortedData, page, limit);
	const enableBulkOperations = selectedData.length > 0;
	const selectedSome = selectedData.length > 0 && selectedData.length < requestsForHelp.length;
	const selectedAll = selectedData.length === requestsForHelp.length;

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
							checked={selectedAll}
							onChange={handleSelectAll}
							indeterminate={selectedSome}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
								onClick={() => handleDeleteAllSelected(
								selectedData,
								deleteRequestsForHelper,
								setSelectedData,
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
										onChange={handleSelectAll}
										checked={selectedAll}
										indeterminate={selectedSome}
									/>
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.name)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.email)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.phone)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.date)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.message)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((el) => {
								const isRequestForHelpSelected = selectedData.includes(el.id);

								return (
									<TableRow
										hover
										key={el.id}
										selected={isRequestForHelpSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isRequestForHelpSelected}
												onChange={(event) => handleSelectOne(event, el.id)}
												value={isRequestForHelpSelected}
											/>
										</TableCell>

										<TableCell align="center">
											{el.name}
										</TableCell>

										<TableCell align="center">
											{el.email}
										</TableCell>

										<TableCell align="center">
											{el.phone}
										</TableCell>

										<TableCell align="center">
											{Moment(Moment.utc(el.created_at)).local().format('DD/MM/YYYY hh:mm')}
										</TableCell>

										<TableCell align="center">
											{el.message}
										</TableCell>

										<TableCell align="center">
											<IconButton
												onClick={() => handleDelete(
													el.id,
													deleteRequestForHelper,
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
				count={filtered.length}
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
	requestsForHelp: PropTypes.array,
};

Results.defaultProps = {
	requestsForHelp: []
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(Results);