import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
	fade,
	useTheme,
	makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		position: 'relative'
	}
}));

const Chart = ({ labels, className, data: dataProp, ...rest }) => {
	const theme = useTheme();
	const classes = useStyles();

	const data = (canvas) => {
		const ctx = canvas.getContext('2d');
		const gradient = ctx.createLinearGradient(0, 0, 0, 400);

		gradient.addColorStop(0, fade(theme.palette.secondary.main, 0.2));
		gradient.addColorStop(0.9, 'rgba(255,255,255,0)');
		gradient.addColorStop(1, 'rgba(255,255,255,0)');

		return {
			datasets: [
				{
					data: dataProp,
					pointRadius: 6,
					pointBorderWidth: 3,
					backgroundColor: gradient,
					borderColor: theme.palette.secondary.main,
					pointBorderColor: theme.palette.background.default,
					pointBackgroundColor: theme.palette.secondary.main,
				}
			],
			labels
		};
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
						borderDashOffset: [2],
						zeroLineBorderDash: [2],
						color: theme.palette.divider,
						zeroLineBorderDashOffset: [2],
						zeroLineColor: theme.palette.divider
					},
					ticks: {
						min: 0,
						padding: 20,
						maxTicksLimit: 7,
						beginAtZero: true,
						fontColor: theme.palette.text.secondary,
						callback: (value) => (value > 0 ? `${value}` : value)
					}
				}
			]
		},
		tooltips: {
			yPadding: 20,
			xPadding: 20,
			enabled: true,
			mode: 'index',
			caretSize: 10,
			borderWidth: 1,
			intersect: false,
			borderColor: theme.palette.divider,
			titleFontColor: theme.palette.text.primary,
			bodyFontColor: theme.palette.text.secondary,
			footerFontColor: theme.palette.text.secondary,
			backgroundColor: theme.palette.background.default,
			callbacks: {
				title: () => {},
				label: (tooltipItem) => {
					let label = `${tooltipItem.yLabel}`;

					if (tooltipItem.yLabel > 0) {
						// label += 'K';
					}

					return label;
				}
			}
		}
	};

	return (
		<div
			className={clsx(classes.root, className)}
			{...rest}
		>
			<Line
				data={data}
				options={options}
			/>
		</div>
	);
};

Chart.propTypes = {
	className: PropTypes.string,
	data: PropTypes.array.isRequired,
	labels: PropTypes.array.isRequired
};

export default Chart;
