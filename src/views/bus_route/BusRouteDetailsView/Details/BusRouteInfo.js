import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Box,
	Card,
	Table,
	Divider,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	makeStyles,
	Typography,
	CardHeader,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PerfectScrollbar from 'react-perfect-scrollbar';
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const BusRouteInfo = ({
	busRoute,
	className,
}) => {
	const classes = useStyles();

	return (
		<Card className={clsx(classes.root, className)} >
			<CardHeader title="BusRoute info" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Título
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRoute.title}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Típo
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRoute.type.title}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Clave Turno 1
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRoute.bus_location_shift1_key}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Clave Turno 1
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRoute.bus_location_shift2_key}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Clave Turno 3
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{busRoute.bus_location_shift3_key}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Publicado
						</TableCell>
						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(busRoute.published)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<CardHeader title="Paradas de la ruta" />
			<Divider />
			<PerfectScrollbar>
				<Box minWidth={700}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">
									Parada
								</TableCell>
								<TableCell align="center">
									Descripción
								</TableCell>
								<TableCell align="center">
									Horario Turno 1
								</TableCell>
								<TableCell align="center">
									Horario Turno 1
								</TableCell>
								<TableCell align="center">
									Horario Turno 1
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{busRoute.stops && busRoute.stops.map((busStop) => {

								return (
									<TableRow
										hover
										key={busStop.id}
									>
										<TableCell align="center">
											{busStop.title}
										</TableCell>
										<TableCell align="center">
											{busStop.reference}
										</TableCell>
										<TableCell align="center">
											{busStop.shift1}
										</TableCell>
										<TableCell align="center">
											{busStop.shift2}
										</TableCell>
										<TableCell align="center">
											{busStop.shift3}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

BusRouteInfo.propTypes = {
	className: PropTypes.string,
	busRoute: PropTypes.object.isRequired
};

export default BusRouteInfo;
