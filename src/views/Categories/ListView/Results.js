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

const Results = ({ intl, categories, deleteCategory, deleteCategories, urlIntlEdit }) => {
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

	const filteredCategories = applyFilters(categories, query, filters, ['name']);
	const sortedCategories = applySort(filteredCategories, sort);
	const paginatedCategories = applyPagination(sortedCategories, page, limit);
	const enableBulkOperations = selectedCategories.length > 0;
	const selectedSomeCategories = selectedCategories.length > 0 && selectedCategories.length < categories.length;
	const selectedAllCategories = selectedCategories.length === categories.length;
	
	return (
		<Card className={clsx(classes.root)} >
			<Box p={2} display="flex" minHeight={56} alignItems="center" >
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
							checked={selectedAllCategories}
							onChange={handleSelectAllCategories}
							indeterminate={selectedSomeCategories}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={handleDeleteAllSelected}
							onClick={() => handleDeleteAllSelected(
								selectedCategories,
								deleteCategories,
								setSelectedCategories,
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
										checked={selectedAllCategories}
										indeterminate={selectedSomeCategories}
										onChange={handleSelectAllCategories}
									/>
								</TableCell>

								<TableCell>
									{formatMessage(intl.category)}
								</TableCell>

								<TableCell align="right">
									{formatMessage(intl.actions)}
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
												{category.name}
										</TableCell>

										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={formatMessage(urlIntlEdit, {categoryId: category.id})}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													category.id,
													deleteCategory,
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

export default connectIntl(mapStateToProps)(Results);