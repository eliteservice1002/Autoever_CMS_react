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
	handleDelete,
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
	events,
	className,
	deleteEvent,
	deleteEvents,
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedEvents, setSelectedEvents ] = useState([]);
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

	const handleSelectAllEvents = (e) => {
		setSelectedEvents(e.target.checked
			? events.map((event) => event.id)
			: []);
	};

	const handleSelectOneEvent = (event, eventId) => {
		if (!selectedEvents.includes(eventId)) {
			setSelectedEvents((prevSelected) => [...prevSelected, eventId]);
		} else {
			setSelectedEvents((prevSelected) => prevSelected.filter((id) => id !== eventId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredEvents = applyFilters(events, query, filters, ['title']);
	const sortedEvents = applySort(filteredEvents, sort);
	const paginatedEvents = applyPagination(sortedEvents, page, limit);
	const enableBulkOperations = selectedEvents.length > 0;
	const selectedSomeEvents = selectedEvents.length > 0 && selectedEvents.length < events.length;
	const selectedAllEvents = selectedEvents.length === events.length;

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
							checked={selectedAllEvents}
							onChange={handleSelectAllEvents}
							indeterminate={selectedSomeEvents}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={() => handleDeleteAllSelected(
								selectedEvents,
								deleteEvents,
								setSelectedEvents,
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
										checked={selectedAllEvents}
										onChange={handleSelectAllEvents}
										indeterminate={selectedSomeEvents}
									/>
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.title)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.category)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.eventStartDate)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.promotedToHome)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedEvents.map((event) => {
								const isEventSelected = selectedEvents.includes(event.id);

								return (
									<TableRow
										hover
										key={event.id}
										selected={isEventSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												value={isEventSelected}
												checked={isEventSelected}
												onChange={(event) => handleSelectOneEvent(event, event.id)}
											/>
										</TableCell>

										<TableCell align="center">
											{event.title}
										</TableCell>

										<TableCell align="center">
											{event.category.name}
										</TableCell>

										<TableCell align="center">
											{event.start_date}
										</TableCell>

										<TableCell align="center">
											{formatMessage(intl[(event.promoted_to_home) ? 'yes' : 'no'])}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlEventsDetail, { eventId: event.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlEventsEdit, { eventId: event.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													event.id,
													deleteEvent,
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
				count={filteredEvents.length}
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
	events: PropTypes.array.isRequired
};

Results.defaultProps = {
	events: []
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