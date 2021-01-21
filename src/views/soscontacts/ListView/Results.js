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

const Results = ({
	intl,
	className,
	contacts,
	deleteContact,
	deleteContacts,
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ selectedContacs, setSelectedContacs ] = useState([]);
	const [ sort, setSort ] = useState(sortOptionsDefault[0].value);
	const [ filters ] = useState({
		hasAcceptedMarketing: null,
		isProspect: null,
		isReturning: null
	});

	const handleQueryChange = (event) => {
		event.persist();
		setQuery(event.target.value);
	};

	const handleSortChange = (event) => {
		event.persist();
		setSort(event.target.value);
	};

	const handleSelectAllContacs = (event) => {
		setSelectedContacs(event.target.checked
			? contacts.map((contact) => contact.id)
			: []);
	};

	const handleSelectOneContact = (event, contactId) => {
		if (!selectedContacs.includes(contactId)) {
			setSelectedContacs((prevSelected) => [...prevSelected, contactId]);
		} else {
			setSelectedContacs((prevSelected) => prevSelected.filter((id) => id !== contactId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredContacts = applyFilters(contacts, query, filters);
	const sortedContacs = applySort(filteredContacts, sort);
	const paginatedContacs = applyPagination(sortedContacs, page, limit);
	const enableBulkOperations = selectedContacs.length > 0;
	const selectedSomeContacts = selectedContacs.length > 0 && selectedContacs.length < contacts.length;
	const selectedAllContacs = selectedContacs.length === contacts.length;

	const handleDelete = (id) => {
		if(!window.confirm(`se eliminara un SOS contacto con ID #${id} ¿quiere continuar?`)) return;
		deleteContact(id);
		enqueueSnackbar(
			`Se elimino UN SOS contacto con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if(!window.confirm(
			`se eliminaran los SOS contactos con ID #${selectedContacs.join(' #')} `+
			'¿quiere continuar?'
		)) return;

		deleteContacts(selectedContacs);

		enqueueSnackbar(
			`Se eliminaron los SOS contactos con ID #${selectedContacs.join(' #')}`,
			{ variant: 'success' }
		)
	}

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
					placeholder="Search SOS Contacts"
					value={query}
					variant="outlined"
				/>
				<Box flexGrow={1} />
				{/*
				<TextField
					label="Sort By"
					name="sort"
					onChange={handleSortChange}
					select
					SelectProps={{ native: true }}
					value={sort}
					variant="outlined"
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
							checked={selectedAllContacs}
							indeterminate={selectedSomeContacts}
							onChange={handleSelectAllContacs}
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
										checked={selectedAllContacs}
										indeterminate={selectedSomeContacts}
										onChange={handleSelectAllContacs}
									/>
								</TableCell>
								<TableCell align="center">
									ID
								</TableCell>
								<TableCell align="center">
									Nombre
								</TableCell>
								<TableCell align="center">
									Telefono
								</TableCell>
								<TableCell align="center">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedContacs.map((contact) => {
								const isCcontactSelected = selectedContacs.includes(contact.id);

								return (
									<TableRow
										hover
										key={contact.id}
										selected={isCcontactSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isCcontactSelected}
												onChange={(event) => handleSelectOneContact(event, contact.id)}
												value={isCcontactSelected}
											/>
										</TableCell>
										<TableCell align="center">
											{contact.id}
										</TableCell>
										<TableCell align="center">
											{contact.name}
										</TableCell>
										<TableCell align="center">
											{contact.telephone}
										</TableCell>
										<TableCell align="center">
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlSosContactsDetail, { contactId: contact.id })}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={formatMessage(intl.urlSosContactsEdit, { contactId: contact.id })}
											>
												<SvgIcon fontSize="small">
													<EditIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												onClick={() => { handleDelete(contact.id) }}
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
				count={filteredContacts.length}
				onChangePage={handlePageChange}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string,
	contacts: PropTypes.array.isRequired
};

Results.defaultProps = {
	contacts: []
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