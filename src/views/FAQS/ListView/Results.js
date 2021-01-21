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

const Results = ({ faqs, deleteFaq, deleteFaqs, intl }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedFaqs, setSelectedFaqs ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllFaqs = (event) => {
		setSelectedFaqs(event.target.checked
			? faqs.map((faqs) => faqs.id)
			: []);
	};

	const handleSelectOneFaq = (event, faqId) => {
		if (!selectedFaqs.includes(faqId)) {
			setSelectedFaqs((prevSelected) => [...prevSelected, faqId]);
		} else {
			setSelectedFaqs((prevSelected) => prevSelected.filter((id) => id !== faqId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredFaqs = applyFilters(faqs, query, filters, ['id', 'question', 'answer']);
	const sortedFaqs = applySort(filteredFaqs, sort);
	const paginatedFaqs = applyPagination(sortedFaqs, page, limit);
	const enableBulkOperations = selectedFaqs.length > 0;
	const selectedSomeFaqs = selectedFaqs.length > 0 && selectedFaqs.length < faqs.length;
	const selectedAllFaqs = selectedFaqs.length === faqs.length;

	return (
		<Card className={clsx(classes.root)} >
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
							checked={selectedAllFaqs}
							indeterminate={selectedSomeFaqs}
							onChange={handleSelectAllFaqs}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={() => handleDeleteAllSelected(
								selectedFaqs,
								deleteFaqs,
								setSelectedFaqs,
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
										checked={selectedAllFaqs}
										indeterminate={selectedSomeFaqs}
										onChange={handleSelectAllFaqs}
									/>
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.question)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.answer)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedFaqs.map((faq) => {
								const isFaqsSelected = selectedFaqs.includes(faq.id);

								return (
									<TableRow
										hover
										key={faq.id}
										selected={isFaqsSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isFaqsSelected}
												onChange={(event) => handleSelectOneFaq(event, faq.id)}
												value={isFaqsSelected}
											/>
										</TableCell>

										<TableCell align="center">
											{faq.question}
										</TableCell>

										<TableCell align="center">
											{faq.answer}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlFaqsDetail, { faqsId: faq.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlFaqsEdit, { faqsId: faq.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													faq.id,
													deleteFaq,
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
				count={filteredFaqs.length}
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
	faqs: PropTypes.array.isRequired
};

Results.defaultProps = {
	faqs: []
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(Results);