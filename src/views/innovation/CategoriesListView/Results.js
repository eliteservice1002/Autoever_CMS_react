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

const Results = ({ categories, deleteCategory, deleteCategories, intl }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedCategories, setSelectedCategories ] = useState([]);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllCategories = (event) => {
		setSelectedCategories(event.target.checked
			? categories.map((category) => category.id)
			: []);
	};

	const handleSelectOneCategory = (event, categoryId) => {
		if (!selectedCategories.includes(categoryId)) {
			setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
		} else {
			setSelectedCategories((prevSelected) => prevSelected.filter((id) => id !== categoryId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if (!window.confirm(`se eliminara la categoría con ID #${id} ¿quiere continuar?`)) return;
		deleteCategory(id);
		enqueueSnackbar(
			`Se elimino la categoría con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if (!window.confirm(
			`se eliminaran las categorías con ID #${selectedCategories.join(' #')} ` +
			'¿quiere continuar?'
		)) return;

		deleteCategories(selectedCategories);

		enqueueSnackbar(
			`Se eliminaron las categorías con ID #${selectedCategories.join(' #')}`,
			{ variant: 'success' }
		)
	}

	const filteredCategories = applyFilters(categories, query, filters, ['title', 'id']);
	const sortedCategories = applySort(filteredCategories, sort);
	const paginatedCategories = applyPagination(sortedCategories, page, limit);
	const enableBulkOperations = selectedCategories.length > 0;
	const selectedSomeCategories = selectedCategories.length > 0 && selectedCategories.length < categories.length;
	const selectedAllCategories = selectedCategories.length === categories.length;

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
					placeholder="Search Category"
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
							checked={selectedAllCategories}
							onChange={handleSelectAllCategories}
							indeterminate={selectedSomeCategories}
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
										checked={selectedAllCategories}
										indeterminate={selectedSomeCategories}
										onChange={handleSelectAllCategories}
									/>
								</TableCell>
								<TableCell>
									title
								</TableCell>
								<TableCell align="right">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedCategories.map((category) => {
								const isCategorySelected = selectedCategories.includes(category.id);

								return (
									<TableRow
										hover
										key={category.id}
										selected={isCategorySelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isCategorySelected}
												onChange={(event) => handleSelectOneCategory(event, category.id)}
												value={isCategorySelected}
											/>
										</TableCell>
										<TableCell>
											{category.title}
										</TableCell>
										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlInnovationBoxCategoriesDetail, {
													categoryId: category.id
												}) }
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlInnovationBoxCategoriesEdit, {
													categoryId: category.id
												}) }
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(category.id)}
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
				count={filteredCategories.length}
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
	categories: PropTypes.array.isRequired
};

Results.defaultProps = {
	categories: []
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