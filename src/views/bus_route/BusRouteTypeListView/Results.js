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
	applyFilters,
	getComparator,
	applyPagination,
	sortOptionsDefault,
	descendingComparator,
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
	busRouteTypes,
	deleteBusRouteType,
	deleteBusRouteTypes,
	...rest
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedBusRouteTypes, setSelectedBusRouteTypes ] = useState([]);
	const [ filters ] = useState({
		hasAcceptedMarketing: null,
		isProspect: null,
		isReturning: null
	});

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllBusRouteTypes = (event) => {
		setSelectedBusRouteTypes(event.target.checked
			? busRouteTypes.map((busRouteType) => busRouteType.id)
			: []);
	};

	const handleSelectOneBusRouteType = (event, busRouteTypeId) => {
		if (!selectedBusRouteTypes.includes(busRouteTypeId)) {
			setSelectedBusRouteTypes((prevSelected) => [...prevSelected, busRouteTypeId]);
		} else {
			setSelectedBusRouteTypes((prevSelected) => prevSelected.filter((id) => id !== busRouteTypeId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara la tipo con ID #${id} ¿quiere continuar?`)) return;
		deleteBusRouteType(id);
		enqueueSnackbar(
			`Se elimino la tipo con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if(!window.confirm(
			`se eliminaran las tipo con ID #${selectedBusRouteTypes.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteBusRouteTypes(selectedBusRouteTypes);

		enqueueSnackbar(
			`Se eliminaron las tipo con ID #${selectedBusRouteTypes.join(' #')}`,
			{ variant: 'success' }
		)
	}

	const filteredBusRouteTypes = applyFilters(busRouteTypes, query, filters, ['busRouteType_title']);
	const sortedBusRouteTypes = applySort(filteredBusRouteTypes, sort);
	const paginatedBusRouteTypes = applyPagination(sortedBusRouteTypes, page, limit);
	const enableBulkOperations = selectedBusRouteTypes.length > 0;
	const selectedSomeBusRouteTypes = selectedBusRouteTypes.length > 0 && selectedBusRouteTypes.length < busRouteTypes.length;
	const selectedAllBusRouteTypes = selectedBusRouteTypes.length === busRouteTypes.length;
	
	return (
		
		<Card
			className={clsx(classes.root, className)}
		>
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
									fontSize="small"
									color="action"
								>
									<SearchIcon />
								</SvgIcon>
							</InputAdornment>
						)
					}}
					onChange={handleQueryChange}
					placeholder="Search BusRouteType"
					value={query}
					variant="outlined"
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
							checked={selectedAllBusRouteTypes}
							onChange={handleSelectAllBusRouteTypes}
							indeterminate={selectedSomeBusRouteTypes}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={handleDeleteAllSelected}
						>
							Delete all
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
										checked={selectedAllBusRouteTypes}
										indeterminate={selectedSomeBusRouteTypes}
										onChange={handleSelectAllBusRouteTypes}
									/>
								</TableCell>

								<TableCell>
									Título
								</TableCell>
								<TableCell align="right">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedBusRouteTypes.map((busRouteType) => {
								const isBusRouteTypeSelected = selectedBusRouteTypes.includes(busRouteType.id);

								return (
									<TableRow
										hover
										key={busRouteType.id}
										selected={isBusRouteTypeSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isBusRouteTypeSelected}
												onChange={(event) => handleSelectOneBusRouteType(event, busRouteType.id)}
												value={isBusRouteTypeSelected}
											/>
										</TableCell>

										<TableCell>
												{busRouteType.title}
										</TableCell>
										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBusRoutesTypeDetail, {id: busRouteType.id})}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBusRoutesTypeEdit, {id: busRouteType.id})}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(busRouteType.id)}
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
	busRouteTypes: PropTypes.array.isRequired
};

Results.defaultProps = {
	busRouteTypes: []
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