import React, { useState, useEffect } from 'react';

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
	useTheme,
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

const Results = ({
	intl,
	news,
	className,
	deleteNew,
	deleteNews,
}) => {
	const theme = useTheme();
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedNews, setSelectedNews ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllNews = (event) => {
		setSelectedNews(event.target.checked
			? news.map((n) => n.id)
			: []);
	};

	const handleSelectOneNew = (event, newId) => {
		if (!selectedNews.includes(newId)) {
			setSelectedNews((prevSelected) => [...prevSelected, newId]);
		} else {
			setSelectedNews((prevSelected) => prevSelected.filter((id) => id !== newId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredNews = applyFilters(news, query, filters);
	const sortedNews = applySort(filteredNews, sort);
	const paginatedNews = applyPagination(sortedNews, page, limit);
	const enableBulkOperations = selectedNews.length > 0;
	const selectedSomeNews = selectedNews.length > 0 && selectedNews.length < news.length;
	const selectedAllNews = selectedNews.length === news.length;

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
							checked={selectedAllNews}
							onChange={handleSelectAllNews}
							indeterminate={selectedSomeNews}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={() => handleDeleteAllSelected(
								selectedNews,
								deleteNews,
								setSelectedNews,
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
										checked={selectedAllNews}
										onChange={handleSelectAllNews}
										indeterminate={selectedSomeNews}
									/>
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.title)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.date)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.expirationDate)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.published)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.actions)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedNews.map((n) => {
								const isNewSelected = selectedNews.includes(n.id);

								return (
									<TableRow
										hover
										key={n.id}
										selected={isNewSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isNewSelected}
												onChange={(event) => handleSelectOneNew(event, n.id)}
												value={isNewSelected}
											/>
										</TableCell>

										<TableCell align="center">
											{n.title}
										</TableCell>

										<TableCell align="center">
											{Moment(n.created_at).format('DD/MM/YYYY hh:mm')}
										</TableCell>

										<TableCell align="center">
											{(n.publication_expire) ? Moment(n.expiration_date).format('DD/MM/YYYY hh:mm') : 'N/A'}
										</TableCell>

										<TableCell align="center">
										{formatMessage(intl[(n.publication_publish) ? 'yes' : 'no'])}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlNewsDetail, { newId: n.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlNewsEdit, { newId: n.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												onClick={() => handleDelete(
													n.id,
													deleteNew,
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
				count={filteredNews.length}
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
	news: PropTypes.array.isRequired
};

Results.defaultProps = {
	news: []
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