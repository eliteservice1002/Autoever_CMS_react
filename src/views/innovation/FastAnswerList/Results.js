import React, { useState } from 'react';
import clsx from 'clsx';
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
	TextField,
	TableBody,
	TableCell,
	TableHead,
	IconButton,
	makeStyles,
	InputAdornment,
	TablePagination,
} from '@material-ui/core';
import {
	Edit as EditIcon,
	Search as SearchIcon
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

const Results = ({ fastAnswers, deleteFastAnswer, deleteFastAnswers, intl }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedFastAnswer, setSelectedFastAnswers ] = useState([]);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAll = (event) => {
		setSelectedFastAnswers(event.target.checked
			? fastAnswers.map((fastAnswer) => fastAnswer.id)
			: []);
	};

	const handleSelectOne = (event, faId) => {
		if (!selectedFastAnswer.includes(faId)) {
			setSelectedFastAnswers((prevSelected) => [...prevSelected, faId]);
		} else {
			setSelectedFastAnswers((prevSelected) => prevSelected.filter((id) => id !== faId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if (!window.confirm(`Se borrara permanentemente ¿quieres continuar?`)) return;
		deleteFastAnswer(id);
		enqueueSnackbar(
			`Eliminado con exito`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {

		if (!window.confirm(
			'Estás a punto de borrar permanentemente estos elementos ¿quieres continuar?'
		)) return;

		deleteFastAnswers(selectedFastAnswer);

		enqueueSnackbar(
			`Eliminado con exito`,
			{ variant: 'success' }
		)
		setSelectedFastAnswers([]);
	}

	const filteredFastAnswers = applyFilters(fastAnswers, query, filters, ['title', 'id']);
	const sortedFastAnswers = applySort(filteredFastAnswers, sort);
	const paginatedFastAnswers = applyPagination(sortedFastAnswers, page, limit);
	const enableBulkOperations = selectedFastAnswer.length > 0;
	const selectedSomeFastAnswers = selectedFastAnswer.length > 0 && selectedFastAnswer.length < fastAnswers.length;
	const selectedAllFastAnswers = selectedFastAnswer.length === fastAnswers.length;

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
									fontSize="small"
									color="action"
								>
									<SearchIcon />
								</SvgIcon>
							</InputAdornment>
						)
					}}
					onChange={handleQueryChange}
					placeholder="Search fast answer"
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
							checked={selectedAllFastAnswers}
							onChange={handleSelectAll}
							indeterminate={selectedSomeFastAnswers}
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
										onChange={handleSelectAll}
										checked={selectedAllFastAnswers}
										indeterminate={selectedSomeFastAnswers}
									/>
								</TableCell>
								<TableCell>
									Answer
								</TableCell>
								<TableCell align="right">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedFastAnswers.map((fastAnswer) => {
								const isSelected = selectedFastAnswer.includes(fastAnswer.id);

								return (
									<TableRow
										hover
										key={fastAnswer.id}
										selected={isSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isSelected}
												onChange={(event) => handleSelectOne(event, fastAnswer.id)}
												value={isSelected}
											/>
										</TableCell>
										<TableCell>
											{fastAnswer.answer}
										</TableCell>
										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlFastAnswersEdit, { fastAnswerId: fastAnswer.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(fastAnswer.id)}
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
				count={filteredFastAnswers.length}
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
	fastAnswers: PropTypes.array.isRequired
};

Results.defaultProps = {
	fastAnswers: []
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