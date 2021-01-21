import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Card,
	Table,
	Divider,
	TableRow,
	TableBody,
	TableCell,
	CardHeader,
	Typography,
	makeStyles,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

/* utils */
import httpClient from 'src/utils/httpClient';
import { formatLanguageToString } from 'src/utils';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {},
	fontWeightMedium: {
		fontWeight: theme.typography.fontWeightMedium
	}
}));

const FaqsInfo = ({ faqs, intl }) => {
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
			<CardHeader title={formatMessage(intl.faqsInfo)} />
			<Divider />
			<Table>
				<TableBody>
					{languages.map((el) => {
						return(
							<TableRow key={el.id} >
								<TableCell className={classes.fontWeightMedium}>
									{formatMessage(intl.question)}{' '}{el.title}
								</TableCell>

								<TableCell>
									<Typography variant="body2" color="textSecondary" >
										{faqs.question[el.cod]}
									</Typography>
								</TableCell>

								<TableCell className={classes.fontWeightMedium}>
									{formatMessage(intl.answer)}{' '}{el.title}
								</TableCell>

								<TableCell>
									<Typography variant="body2" color="textSecondary" >
										{faqs.answer[el.cod]}
									</Typography>
								</TableCell>
							</TableRow>
						)
					})}

					<TableRow>
						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.promotedToHome)}
						</TableCell>

						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(faqs.promoted_to_home)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>

						<TableCell className={classes.fontWeightMedium}>
							{formatMessage(intl.published)}
						</TableCell>
						<TableCell>
							<Checkbox
								color="primary"
								checked={Boolean(faqs.published)}
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

FaqsInfo.propTypes = {
	className: PropTypes.string,
	faqs: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(FaqsInfo);