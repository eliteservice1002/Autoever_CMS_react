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
	busRoutes,
	className,
	deleteBusRoute,
	deleteBusRoutes,
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedBusRoutes, setSelectedBusRoutes ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ filters ] = useState({
		hasAcceptedMarketing: null,
		isProspect: null,
		isReturning: null
	});

	const handleQueryChange = (e) => {
		e.persist();
		setQuery(e.target.value);
	};

	const handleSortChange = (e) => {
		e.persist();
		setSort(e.target.value);
	};

	const handleSelectAllBusRoutes = (e) => {
		setSelectedBusRoutes(e.target.checked
			? busRoutes.map((busRoute) => busRoute.id)
			: []);
	};

	const handleSelectOneBusRoute = (busRoute, busRouteId) => {
		if (!selectedBusRoutes.includes(busRouteId)) {
			setSelectedBusRoutes((prevSelected) => [...prevSelected, busRouteId]);
		} else {
			setSelectedBusRoutes((prevSelected) => prevSelected.filter((id) => id !== busRouteId));
		}
	};

	const handlePageChange = (busRoute, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (busRoute) => {
		setLimit(parseInt(busRoute.target.value));
	};

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara el busRouteo con ID #${id} ¿quiere continuar?`)) return;
		deleteBusRoute(id);
		enqueueSnackbar(
			`Se elimino el busRouteo con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if(!window.confirm(
			`se eliminaran los busRouteos con ID #${selectedBusRoutes.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteBusRoutes(selectedBusRoutes);

		enqueueSnackbar(
			`Se eliminaron los busRouteos con ID #${selectedBusRoutes.join(' #')}`,
			{ variant: 'success' }
		)
	}

	const filteredBusRoutes = applyFilters(busRoutes, query, filters, ['title_es']);
	const sortedBusRoutes = applySort(filteredBusRoutes, sort);
	const paginatedBusRoutes = applyPagination(sortedBusRoutes, page, limit);
	const enableBulkOperations = selectedBusRoutes.length > 0;
	const selectedSomeBusRoutes = selectedBusRoutes.length > 0 && selectedBusRoutes.length < busRoutes.length;
	const selectedAllBusRoutes = selectedBusRoutes.length === busRoutes.length;

	return (
		<Card className={clsx(classes.root, className)} >
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
					placeholder="Search BusRoutes"
					value={query}
					variant="outlined"
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
							checked={selectedAllBusRoutes}
							onChange={handleSelectAllBusRoutes}
							indeterminate={selectedSomeBusRoutes}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={handleDeleteAllSelected}
						>
							Delete
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
										checked={selectedAllBusRoutes}
										onChange={handleSelectAllBusRoutes}
										indeterminate={selectedSomeBusRoutes}
									/>
								</TableCell>

								<TableCell align="center">
									Título
								</TableCell>
								<TableCell align="center">
									Tipo
								</TableCell>
								<TableCell align="center">
									Publicado
								</TableCell>
								<TableCell align="center">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedBusRoutes.map((busRoute) => {
								const isBusRouteSelected = selectedBusRoutes.includes(busRoute.id);

								return (
									<TableRow
										hover
										key={busRoute.id}
										selected={isBusRouteSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												value={isBusRouteSelected}
												checked={isBusRouteSelected}
												onChange={(busRoute) => handleSelectOneBusRoute(busRoute, busRoute.id)}
											/>
										</TableCell>

										<TableCell align="center">
											{busRoute.title}
										</TableCell>
										<TableCell align="center">
											{busRoute.type.title}
										</TableCell>
										<TableCell align="center">
											{(busRoute.published) ? 'Si' : 'No'}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBusRoutesDetail, {id: busRoute.id})}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBusRoutesEdit, {id: busRoute.id})}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(busRoute.id)}
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
				count={filteredBusRoutes.length}
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
	busRoutes: PropTypes.array.isRequired
};

Results.defaultProps = {
	busRoutes: []
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