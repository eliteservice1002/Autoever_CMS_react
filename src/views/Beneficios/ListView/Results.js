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
import { formatLanguageToString } from 'src/utils';

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
	benefits,
	className,
	deleteBenefit,
	deleteBenefits,
	currentLanguage,
}) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedBenefits, setSelectedBenefits ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllBenefits = (event) => {
		setSelectedBenefits(event.target.checked
			? benefits.map((benefit) => benefit.id)
			: []);
	};

	const handleSelectOneBenefit = (event, benefitId) => {
		if (!selectedBenefits.includes(benefitId)) {
			setSelectedBenefits((prevSelected) => [...prevSelected, benefitId]);
		} else {
			setSelectedBenefits((prevSelected) => prevSelected.filter((id) => id !== benefitId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredBenefits = applyFilters(benefits, query, filters);
	const sortedBenefits = applySort(filteredBenefits, sort);
	const paginatedBenefits = applyPagination(sortedBenefits, page, limit);
	const enableBulkOperations = selectedBenefits.length > 0;
	const selectedSomeBenefits = selectedBenefits.length > 0 && selectedBenefits.length < benefits.length;
	const selectedAllBenefits = selectedBenefits.length === benefits.length;

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
							checked={selectedAllBenefits}
							onChange={handleSelectAllBenefits}
							indeterminate={selectedSomeBenefits}
						/>
						<Button
							variant="outlined"
							className={classes.bulkAction}
							onClick={() => handleDeleteAllSelected(
								selectedBenefits,
								deleteBenefits,
								setSelectedBenefits,
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
										checked={selectedAllBenefits}
										indeterminate={selectedSomeBenefits}
										onChange={handleSelectAllBenefits}
									/>
								</TableCell>
								<TableCell align="center">
									{formatMessage(intl.trade)}
								</TableCell>
								<TableCell align="center">
									{formatMessage(intl.category)}
								</TableCell>
								<TableCell align="center">
									{formatMessage(intl.promotion)}
								</TableCell>
								<TableCell align="center">
									{formatMessage(intl.expirationDate)}
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
							{paginatedBenefits.map((benefit) => {
								const isBenefitSelected = selectedBenefits.includes(benefit.id);

								return (
									<TableRow
										hover
										key={benefit.id}
										selected={isBenefitSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isBenefitSelected}
												onChange={(event) => handleSelectOneBenefit(event, benefit.id)}
												value={isBenefitSelected}
											/>
										</TableCell>

										<TableCell align="center">
											{benefit.trade}
										</TableCell>

										<TableCell align="center">
											{(benefit.category)
												? formatLanguageToString(benefit.category.name, currentLanguage) : '-'
											}
										</TableCell>

										<TableCell align="center">
											{benefit.promo}
										</TableCell>

										<TableCell align="center">
											{(benefit.expiration_date) ?
												benefit.expiration_date : 'N/A'
											}
										</TableCell>

										<TableCell align="center">
											{formatMessage(intl[(benefit.promoted_to_home) ? 'yes' : 'no'])}
										</TableCell>

										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBenefitsDetail, { benefitId: benefit.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlBenefitsEdit, { benefitId: benefit.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(
													benefit.id,
													deleteBenefit,
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
				page={page}
				component="div"
				rowsPerPage={limit}
				count={filteredBenefits.length}
				onChangePage={handlePageChange}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string,
	benefits: PropTypes.array.isRequired
};

Results.defaultProps = {
	benefits: []
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(Results);