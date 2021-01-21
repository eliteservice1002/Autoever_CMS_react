import React, { useState, useEffect } from 'react';
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

/* utils */
import httpClient from 'src/utils/httpClient';
import { formatLanguageToString } from 'src/utils';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const CategoryInfo = ({ category }) => {
	const classes = useStyles();

	const [ languages, setLanguages ] = useState([]);

	useEffect(() => {
		httpClient.get('api/languages')
		.then(({ data }) => {
			setLanguages(data);
		})
	}, [])

	return (
		<Card className={clsx(classes.root)} >
			<CardHeader title="Category info" />
			<Divider />
			<Table>
				<TableBody>
					{languages.map((el) => {
						return(
							<TableRow key={el.id} >
								<TableCell className={classes.fontWeightMedium}>
									{`título (${el.title})`}
								</TableCell>
								<TableCell>
									<Typography
										variant="body2"
										color="textSecondary"
									>
										{category.title[el.cod]}
									</Typography>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</Card>
	);
};

CategoryInfo.propTypes = {
	className: PropTypes.string,
	category: PropTypes.object.isRequired
};

export default CategoryInfo;
