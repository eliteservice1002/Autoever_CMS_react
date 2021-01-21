import React, { useEffect } from 'react';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
	fade,
	makeStyles,
	useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		position: 'relative'
	}
}));

const Chart = ({ labels, className, data: dataProp }) => {
	const theme = useTheme();
	const classes = useStyles();

	const data = {
		labels,
		datasets: [
			{
				data: dataProp,
				backgroundColor: theme.palette.secondary.main,
			},
		],
	};

	const options = {
		responsive: true,
		animation: false,
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		layout: {
			padding: 0
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						display: false,
						drawBorder: false
					},
					ticks: {
						padding: 20,
						fontColor: theme.palette.text.secondary
					}
				}
			],
			yAxes: [
				{
					gridLines: {
						borderDash: [2],
						drawBorder: false,
						color: theme.palette.divider,
						zeroLineColor: theme.palette.divider
					},
					ticks: {
						min: 0,
						padding: 20,
						maxTicksLimit: 5,
						beginAtZero: true,
						fontColor: theme.palette.text.secondary,
						callback: (value) => {
							if((value >= 1000)) {
								value = (value / 1000).toFixed(2);
								let decimales = value.slice(-2);

								if(decimales === '00') {
									decimales = '';
								}

								value = `${value.slice(0,-3)}${(decimales) ? '.' + decimales : ''}K`;
							}

							return value;
						}
					}
				}
			]
		},
		tooltips: {
			yPadding: 20,
			xPadding: 20,
			caretSize: 10,
			mode: 'index',
			enabled: true,
			borderWidth: 1,
			intersect: false,
			borderColor: theme.palette.divider,
			titleFontColor: theme.palette.text.primary,
			bodyFontColor: theme.palette.text.secondary,
			footerFontColor: theme.palette.text.secondary,
			backgroundColor: theme.palette.background.dark,
			callbacks: {
				title: (title) => {},
				label: (tooltipItem) => {
					let { yLabel } = tooltipItem;
					let value = `Views: ${yLabel}`;

					if(yLabel >= 1000) {
						value = (yLabel / 1000).toFixed(2);
						let decimales = value.slice(-2);

						if(decimales === '00') {
							decimales = '';
						}

						value = `Views: ${value.slice(0,-3)}${(decimales) ? '.' + decimales : ''}K`;
					}

					return value;
				}
			}
		}
	};

	return (
		<div className={clsx(classes.root, className)} >
			<Bar data={data} options={options} />
		</div>
	);
};

Chart.propTypes = {
	className: PropTypes.string,
	data: PropTypes.array.isRequired,
	labels: PropTypes.array.isRequired
};

export default Chart;
