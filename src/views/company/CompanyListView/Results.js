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

const Results = ({ companies, deleteCompany, deleteCompanies, intl }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedCompanies, setSelectedCompanies ] = useState([]);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllCompanies = (event) => {
		setSelectedCompanies(event.target.checked
			? companies.map((company) => company.id)
			: []);
	};

	const handleSelectOneCompany = (event, companyId) => {
		if (!selectedCompanies.includes(companyId)) {
			setSelectedCompanies((prevSelected) => [...prevSelected, companyId]);
		} else {
			setSelectedCompanies((prevSelected) => prevSelected.filter((id) => id !== companyId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara un FAQs con ID #${id} ¿quiere continuar?`)) return;
		deleteCompany(id);
		enqueueSnackbar(
			`Se elimino UN FAQs con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if(!window.confirm(
			`se eliminaran las FAQs con ID #${selectedCompanies.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteCompanies(selectedCompanies);

		enqueueSnackbar(
			`Se eliminaron las FAQs con ID #${selectedCompanies.join(' #')}`,
			{ variant: 'success' }
		)
		setSelectedCompanies([]);
	}

	const filteredCompanies = applyFilters(companies, query, filters);
	const sortedCompanies = applySort(filteredCompanies, 'id|desc');
	const paginatedCompanies = applyPagination(sortedCompanies, page, limit);
	const enableBulkOperations = selectedCompanies.length > 0;
	const selectedSomeCompanies = selectedCompanies.length > 0 && selectedCompanies.length < companies.length;
	const selectedAllCompanies = selectedCompanies.length === companies.length;
	
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
					placeholder="Search company"
					onChange={handleQueryChange}
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
							checked={selectedAllCompanies}
							onChange={handleSelectAllCompanies}
							indeterminate={selectedSomeCompanies}
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
										checked={selectedAllCompanies}
										onChange={handleSelectAllCompanies}
										indeterminate={selectedSomeCompanies}
									/>
								</TableCell>

								<TableCell>
									Nombre
								</TableCell>

								<TableCell>
									Slogan
								</TableCell>

								<TableCell >
									Clave
								</TableCell>

								<TableCell >
									Active
								</TableCell>

								<TableCell >
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedCompanies.map((company) => {
								const isCustomerSelected = selectedCompanies.includes(company.id);

								return (
									<TableRow
										hover
										key={company.id}
										selected={isCustomerSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isCustomerSelected}
												onChange={(event) => handleSelectOneCompany(event, company.id)}
												value={isCustomerSelected}
											/>
										</TableCell>
										<TableCell>
											{company.name}
										</TableCell>
										<TableCell>
											{company.slogan}
										</TableCell>
										<TableCell>
											{company.key}
										</TableCell>
										<TableCell>
											{ company.active ? 'Si' : 'NO' }
										</TableCell>
										<TableCell>
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlCompaniesEdit, { companyId: company.id }) }
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>

											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(company.id)}
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
				page={page}
				rowsPerPage={limit}
				onChangePage={handlePageChange}
				count={filteredCompanies.length}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	companies: PropTypes.array,
	className: PropTypes.string,
};

Results.defaultProps = {
	companies: []
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