import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
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
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';
import httpClient from 'src/utils/httpClient';

/* utils */
import {
	applySort,
	applyFilters,
	getComparator,
	applyPagination,
	sortOptionsDefault,
	descendingComparator,
} from 'src/utils/defaultTableSettings';
import { formatLanguageToString } from 'src/utils';

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
	},
	btndialogClose: {
		textAlign: 'right',
		marginBottom: 10
	},
	btndialogclose: {
		cursor: 'pointer'
	},
	btndialogenviar: {
		backgroundColor: 'rgb(52,103,177)',
		color: '#fff',
		width: 140
	},
	dialogselect: {
		width: 400
	}
}));

const Results = ({
	innovations,
	className,
	deleteInnovation,
	deleteInnovations,
}) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const isMountedRef = useIsMountedRef();
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const [ open, setOpen ] = useState(false);
	const {  enqueueSnackbar  } = useSnackbar();
	const [ isSending, setIsSending ] = useState(false);
	const [ fastanswers, setFastanswers ] = useState([]);
	const [ notification, setNotification ] = useState({});
	const [ fastanswerSelect, setFastanswerSelect ] = useState('');
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);
	const [ selectedInnovations, setSelectedInnovations ] = useState([]);

	useEffect(() => {
		httpClient.get(`api/innovation/fast_answers`)
		.then(({ data }) => {
			setFastanswers(data);
		})
	}, []);

	useEffect(() => {
		if(isSending) {
			if(!notification.answer) {
				enqueueSnackbar(
					'Select an answer',
					{ variant: 'warning' }
				)
				setIsSending(false);
			} else {
				httpClient.post('api/innovation/fast_answers/send', notification)
				.then((response) => {
					console.log(response);
					enqueueSnackbar(
						response.msg,
						{ variant: 'success' }
					)
					setOpen(false);
					setIsSending(false);
				})
			}
		}
	}, [isSending, fastanswerSelect])

	const handleQueryChange = (e) => {
		e.persist();
		setQuery(e.target.value);
	};

	const handleSortChange = (e) => {
		e.persist();
		setSort(e.target.value);
	};

	const handleSelectAllInnovations = (e) => {
		setSelectedInnovations(e.target.checked
			? innovations.map((innovation) => innovation.id)
			: []);
	};

	const handleSelectOneEvent = (event, eventId) => {
		if (!selectedInnovations.includes(eventId)) {
			setSelectedInnovations((prevSelected) => [...prevSelected, eventId]);
		} else {
			setSelectedInnovations((prevSelected) => prevSelected.filter((id) => id !== eventId));
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const handleDelete = (id) => {
		if (!window.confirm(`se eliminara el registro con ID #${id} ¿quiere continuar?`)) return;
		deleteInnovation(id);
		enqueueSnackbar(
			`Se elimino el registro con ID #${id}`,
			{ variant: 'success' }
		)
	}

	const handleDeleteAllSelected = (id) => {
		if (!window.confirm(
			`se eliminaran los registros con ID #${selectedInnovations.join(' #')} ` +
			'¿quiere continuar?'
		)) return;

		deleteInnovations(selectedInnovations);

		enqueueSnackbar(
			`Se eliminaron los registro con ID #${selectedInnovations.join(' #')}`,
			{ variant: 'success' }
		)
		setSelectedInnovations([]);
	}

	const handlePushNotification = (innovation) => {
		setOpen(true);
		setNotification((prevState) => {
			return {
				...prevState,
				innovation_id: innovation.id,
				employee_number: innovation.employee_number,
			}
		})
	}

	const handleChangeAnswerSelected = (e) => {
		let { value } = e.target;

		let current = fastanswers.find((el) => {
			return el.id == value;
		});

		setFastanswerSelect(current.id);

		setNotification((prevState) => {
			return {
				...prevState,
				answer: current.answer
			}
		})
	}

	const filteredInnovations = applyFilters(innovations, query, filters, ['suggestion', 'id']);
	const sortedInnovations = applySort(filteredInnovations, sort);
	const paginatedInnovations = applyPagination(sortedInnovations, page, limit);
	const enableBulkOperations = selectedInnovations.length > 0;
	const selectedSomeInnovations = selectedInnovations.length > 0 && selectedInnovations.length < innovations.length;
	const selectedAllInnovations = selectedInnovations.length === innovations.length;

	const handleClose = () => {
		setOpen(false);
		setNotification({});
	};

	return (
		<Card className={clsx(classes.root, className)} >
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<div className={classes.btndialogClose}>
						<CloseIcon
							className={classes.btndialogclose}
							onClick={handleClose}
						/>
					</div>
					<TextField
						select
						required
						fullWidth
						variant="outlined"
						name="fast_answers"
						label="Fast Answers"
						value={fastanswerSelect}
						SelectProps={{ native: true }}
						onChange={handleChangeAnswerSelected}
					>
						<option> Select an answer </option>
						{fastanswers.map((el, index) => (
							<option key={index} value={el.id} >
								{el.answer}
							</option>
						))}
					</TextField>
				</DialogContent>
				<DialogActions style={{ alignSelf: 'center' }}>
					<Button
						color="primary"
						disabled={isSending}
						onClick={() => setIsSending(true)}
						className={classes.btndialogenviar}
					>
						Enviar
					</Button>
				</DialogActions>
			</Dialog>
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
					placeholder="Search Innovations"
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
							checked={selectedAllInnovations}
							onChange={handleSelectAllInnovations}
							indeterminate={selectedSomeInnovations}
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
										checked={selectedAllInnovations}
										onChange={handleSelectAllInnovations}
										indeterminate={selectedSomeInnovations}
									/>
								</TableCell>
								<TableCell align="center">
									Date
								</TableCell>
								<TableCell align="center">
									Employee Number
								</TableCell>
								<TableCell align="center">
									Employee Name
								</TableCell>
								<TableCell align="center">
									Category
								</TableCell>
								<TableCell align="center">
									Coment
								</TableCell>
								<TableCell align="center">
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedInnovations.map((innovation) => {
								const isInnovationselected = selectedInnovations.includes(innovation.id);

								return (
									<TableRow
										hover
										key={innovation.id}
										selected={isInnovationselected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												value={isInnovationselected}
												checked={isInnovationselected}
												onChange={(event) => handleSelectOneEvent(event, innovation.id)}
											/>
										</TableCell>
										<TableCell align="center">
											{innovation.created_at.substr(0, 10)} {innovation.created_at.substr(11, 8)}
										</TableCell>
										<TableCell align="center" style={{ cursor: 'pointer' }}>
											{innovation.employee_number}
										</TableCell>
										<TableCell align="center">
											{innovation.employee_name}
										</TableCell>
										<TableCell align="center">
											{formatLanguageToString(innovation.category.title)}
										</TableCell>
										<TableCell align="center">
											{innovation.suggestion}
										</TableCell>

										<TableCell align="center">
											<IconButton
												onClick={() => handlePushNotification(innovation)}
											>
												<SvgIcon fontSize="small">
													<ChatBubbleOutlineIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												component={RouterLink}
												to={`/management/innovation/${innovation.id}/detail`}
											>
												<SvgIcon fontSize="small">
													<SearchIcon />
												</SvgIcon>
											</IconButton>
											<IconButton
												to="#"
												component={RouterLink}
												onClick={() => handleDelete(innovation.id)}
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
				count={filteredInnovations.length}
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
	innovations: PropTypes.array
};

Results.defaultProps = {
	innovations: []
};

export default Results;
