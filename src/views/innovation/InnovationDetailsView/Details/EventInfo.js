import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Card,
	Table,
	Divider,
	TableRow,
	TableBody,
	TableCell,
	makeStyles,
	Typography,
	CardHeader,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const EventInfo = ({
	innovation,
	className,
}) => {
	const classes = useStyles();

	return (
		<Card className={clsx(classes.root, className)} >
			<CardHeader title="innovation info" />
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
								{innovation.title_es}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Título (inglés)
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{innovation.title_es}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Fecha de inicio
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{innovation.start_date}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Fecha de expiración
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{innovation.expiration_date}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Ubicación
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{innovation.location}
							</Typography>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Categoría
						</TableCell>
						<TableCell>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								{innovation.category.category_es}
							</Typography>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							Promoted to home
						</TableCell>
						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(innovation.promoted_to_home)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
						<TableCell className={classes.fontWeightMedium}>
							Publicado
						</TableCell>
						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(innovation.published)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

EventInfo.propTypes = {
	className: PropTypes.string,
	innovation: PropTypes.object.isRequired
};

export default EventInfo;
