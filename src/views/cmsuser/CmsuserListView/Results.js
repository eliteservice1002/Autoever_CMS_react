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
	cmsusers,
	className,
	deleteCmsuser,
	deleteCmsusers,
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ filters, setFilters ] = useState({});
	const [ selectedCmsusers, setSelectedCmsusers ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	
	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

  const handleSelectAllCmsusers = (event) => {
		setSelectedCmsusers(event.target.checked
			? cmsusers.map((cmsuser) => cmsuser.id)
			: []);
	};

	const handleSelectOneCmsuser = (event, cmsuserId) => {
		if (!selectedCmsusers.includes(cmsuserId)) {
			setSelectedCmsusers((prevSelected) => [...prevSelected, cmsuserId]);
		} else {
			setSelectedCmsusers((prevSelected) => prevSelected.filter((id) => id !== cmsuserId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara el Cms user con ID #${id} ¿quiere continuar?`)) return;
		deleteCmsuser(id);
		enqueueSnackbar(
			`Se elimino el Cms user con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = () => {
		if(!window.confirm(
			`se eliminaran los Cms user con ID #${selectedCmsusers.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteCmsusers(selectedCmsusers);

		enqueueSnackbar(
			`Se eliminaron los Cms user con ID #${selectedCmsusers.join(' #')}`,
			{ variant: 'success' }
		)

		setSelectedCmsusers([]);
	}

	const filteredCmsusers = applyFilters(cmsusers, query, filters, ['id', 'name']);
	const sortedCmsusers = applySort(filteredCmsusers, sort);
	const paginatedCmsusers = applyPagination(sortedCmsusers, page, limit);
	const enableBulkOperations = selectedCmsusers.length > 0;
	const selectedSomeCmsusers = selectedCmsusers.length > 0 && selectedCmsusers.length < cmsusers.length;
	const selectedAllCmsusers = selectedCmsusers.length === cmsusers.length;
	
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
					placeholder="Search Cms user"
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
							checked={selectedAllCmsusers}
							onChange={handleSelectAllCmsusers}
							indeterminate={selectedSomeCmsusers}
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
										checked={selectedAllCmsusers}
										onChange={handleSelectAllCmsusers}
										indeterminate={selectedSomeCmsusers}
									/>
								</TableCell>

								<TableCell>
									Número de empleado
								</TableCell>

								<TableCell>
									Nombre
								</TableCell>

								<TableCell>
									Email
								</TableCell>

								<TableCell>
									Role(s)
								</TableCell>

								<TableCell align="right">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedCmsusers.map((cmsuser) => {
								const isCmsuserSelected = selectedCmsusers.includes(cmsuser.id);

								return (
									<TableRow
										hover
										key={cmsuser.id}
										selected={isCmsuserSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isCmsuserSelected}
												onChange={(event) => handleSelectOneCmsuser(event, cmsuser.id)}
												value={isCmsuserSelected}
											/>
										</TableCell>
										<TableCell>
											{cmsuser.employee_number}
										</TableCell>
										<TableCell>
												{cmsuser.name}
										</TableCell>
										<TableCell>
												{cmsuser.email}
										</TableCell>
										<TableCell>
												{cmsuser.userrole.name}
										</TableCell>
										<TableCell align="right">
											<IconButton
												component={RouterLink}
												to={ formatMessage(intl.urlCmsUsersEdit, { cmsuserId: cmsuser.id }) }
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>

											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(cmsuser.id)}
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
				count={filteredCmsusers.length}
				onChangePage={handlePageChange}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string,
	customers: PropTypes.array.isRequired
};

Results.defaultProps = {
	customers: []
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
