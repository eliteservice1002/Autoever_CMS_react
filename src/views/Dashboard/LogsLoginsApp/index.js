import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import Moment from 'moment';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
	Box,
	Card,
	Divider,
	CardHeader,
	makeStyles,
	CardContent,
} from '@material-ui/core';
import Chart from './Chart';
import {  DatePicker } from "@material-ui/pickers";

/* utils */
import { formatDate } from 'src/utils';
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
	root: {},
	chart: {
		height: '100%'
	}
}));

const LogsLoginsApp = ({ intl }) => {
	const classes = useStyles();
	const [ dataValues, setDataValues ] = useState([]);
	const [ dataLabels, setDataLabels ] = useState([]);
	const [ selectedDateTo, setDateTo ] = useState(Moment());
	const [ selectedDateFrom, setDateFrom ] = useState(Moment().subtract(7, 'days'));

	useEffect(() => {
		httpClient.get('api/login-report', {
			data: {
				toDate: Moment(selectedDateTo).utc().format(),
				fromDate: Moment(selectedDateFrom).utc().format(),
			}
		})
		.then(({ data }) => {
			let dataValuesTMP = [];
			let dataLabelsTMP = [];
			for(let key in data) {
				dataLabelsTMP.push(key);
				dataValuesTMP.push(data[key]);
			}

			setDataLabels(dataLabelsTMP);
			setDataValues(dataValuesTMP);
		})
	}, [ selectedDateTo, selectedDateFrom ])

	const handleDateTo = (date) => {
		setDateTo(date);
	}

	const handleDateFrom = (date) => {
		setDateFrom(date);
	}

	return (
		<Card className={clsx(classes.root)} >

			<CardHeader title={formatMessage(intl.LoginsOfTheApp)} />

			<Divider />

			<CardContent>
				<DatePicker
					autoOk
					label='From'
					disableFuture
					variant='inline'
					format='MM-DD-yyyy'
					name='selectedDateFrom'
					inputVariant='outlined'
					value={selectedDateFrom}
					onChange={handleDateFrom}
					invalidDateMessage={formatMessage(intl.invalidDateFormat)}
				/>

				<DatePicker
					autoOk
					label='To'
					disableFuture
					variant='inline'
					format='MM-DD-yyyy'
					name='inputVariant'
					value={selectedDateTo}
					inputVariant='outlined'
					onChange={handleDateTo}
					invalidDateMessage={formatMessage(intl.invalidDateFormat)}
				/>
			</CardContent>

			<Divider />
			<CardContent>
				<PerfectScrollbar>
					<Box height={375} minWidth={500} >
						<Chart
							data={dataValues}
							labels={dataLabels}
							className={classes.chart}
						/>
					</Box>
				</PerfectScrollbar>
			</CardContent>
		</Card>
	);
};

LogsLoginsApp.propTypes = {};

LogsLoginsApp.defaultProps = {};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(LogsLoginsApp);