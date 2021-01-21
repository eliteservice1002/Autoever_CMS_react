import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import Moment from 'moment';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Card,
	Table,
	Button,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	makeStyles,
	TablePagination,
} from '@material-ui/core';

import { useSnackbar } from 'notistack';

/* utils */
import {
	applySort,
	handleDelete,
	applyFilters,
	applyPagination,
	sortOptionsDefault,
	handleDeleteAllSelected,
} from 'src/utils/defaultTableSettings';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {},
}));

const Results = ({ intl, data, className }) => {
	const classes = useStyles();
	const [ filters ] = useState({});
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);
	const [ query, setQuery ] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [ sort, setSort ] = useState(sortOptionsDefault[2].value);

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const filteredData = applyFilters(data, query, filters);
	const sortedData = applySort(filteredData, 'created_at|desc');
	const paginatedData = applyPagination(sortedData, page, limit);

	return (
		<Card className={clsx(classes.root, className)} >
			<PerfectScrollbar>
				<Box minWidth={700}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">
									{formatMessage(intl.ip)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.date)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.httpUserAgent	)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.rol)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.company)}
								</TableCell>

								<TableCell align="center">
									{formatMessage(intl.name)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedData.map((el, key) => {
								return (
									<TableRow hover key={key} >
										<TableCell align="center">
											{el.ip}
										</TableCell>

										<TableCell align="center">
											{Moment(Moment.utc(el.created_at)).local().format('DD/MM/YYYY hh:mm')}
										</TableCell>

										<TableCell align="center">
												{el.HTTP_USER_AGENT}
										</TableCell>

										<TableCell align="center">
											{el.rol}
										</TableCell>

										<TableCell align="center">
											{el.company_name}
										</TableCell>

										<TableCell align="center">
											{el.username}
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
				count={filteredData.length}
				onChangePage={handlePageChange}
				rowsPerPageOptions={[5, 10, 25]}
				onChangeRowsPerPage={handleLimitChange}
			/>
		</Card>
	);
};

Results.propTypes = {
	data: PropTypes.array,
	className: PropTypes.string,
};

Results.defaultProps = {
	data: []
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