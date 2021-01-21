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
	Search as SearchIcon,
} from 'react-feather';
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

/* utils */
import {
	applySort,
	applyFilters,
	applyPagination,
	sortOptionsDefault,
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
	systemadmins,
	deleteSystemadmin,
	deleteSystemadmins,
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ filters, setFilters ] = useState({});
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedSystemadmins, setSelectedSystemadmins ] = useState([]);

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSelectAllSystemadmins = (event) => {
		setSelectedSystemadmins(
			event.target.checked
			? systemadmins.map((el) => el.id) : []
		);
	};

	const handleSelectOneSytemadmin = (event, systemadminId) => {
		if (!selectedSystemadmins.includes(systemadminId)) {
			setSelectedSystemadmins((prevSelected) => (
				[...prevSelected, systemadminId]
			));
		} else {
			setSelectedSystemadmins((prevSelected) => (
				prevSelected.filter((id) => id !== systemadminId)
			));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara el System user con ID #${id} ¿quiere continuar?`)) return;
		deleteSystemadmin(id);
		enqueueSnackbar(
			`Se elimino el System user con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = () => {
		if(!window.confirm(
			`se eliminaran los System user con ID #${selectedSystemadmins.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteSystemadmins(selectedSystemadmins);

		enqueueSnackbar(
			`Se eliminaron los System user con ID #${selectedSystemadmins.join(' #')}`,
			{ variant: 'success' }
		)

		setSelectedSystemadmins([]);
	}

	const filteredSystemadmins = applyFilters(systemadmins, query, filters, ['id', 'name']);
	const sortedSystemadmins = applySort(filteredSystemadmins, sort);
	const paginatedSystemadministrators = applyPagination(sortedSystemadmins, page, limit);
	const enableBulkOperations = selectedSystemadmins.length > 0;
	const selectedSomeSystemadmins = selectedSystemadmins.length > 0 && selectedSystemadmins.length < systemadmins.length;
	const selectedAllSystemadmins = selectedSystemadmins.length === systemadmins.length;
	
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
					value={query}
					variant="outlined"
					onChange={handleQueryChange}
					placeholder="Search System admin"
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
							checked={selectedAllSystemadmins}
							onChange={handleSelectAllSystemadmins}
							indeterminate={selectedSomeSystemadmins}
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
										checked={selectedAllSystemadmins}
										indeterminate={selectedSomeSystemadmins}
										onChange={handleSelectAllSystemadmins}
									/>
								</TableCell>
								<TableCell>
									ID
								</TableCell>
								<TableCell>
									Nombre
								</TableCell>
								<TableCell>
									Email
								</TableCell>
								<TableCell>
									Company
								</TableCell>
								<TableCell align="right">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedSystemadministrators.map((systemadmin) => {
								const isSystemadminSelected = selectedSystemadmins.includes(systemadmin.id);
								return (
									<TableRow
										hover
										key={systemadmin.id}
										selected={isSystemadminSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isSystemadminSelected}
												onChange={(event) => handleSelectOneSytemadmin(event, systemadmin.id)}
												value={isSystemadminSelected}
											/>
										</TableCell>
										<TableCell>
											{systemadmin.id}
										</TableCell>
										<TableCell>
												{systemadmin.name}
										</TableCell>
										<TableCell>
												{systemadmin.email}
										</TableCell>
										<TableCell>
												{systemadmin.company.name}
										</TableCell>
										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlSystemAdminsEdit, { userId: systemadmin.id }) }
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>

											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(systemadmin.id)}
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
				count={filteredSystemadmins.length}
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
	systemadmins: PropTypes.array
};

Results.defaultProps = {
	systemadmins: []
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
