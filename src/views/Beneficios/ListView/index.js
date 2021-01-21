import React, {
	useState,
	useEffect,
	useCallback
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Results from './Results';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';
import { formatLanguageToString } from 'src/utils';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const BenefitListView = ({ intl, currentLanguage }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ benefits, setBenefits ] = useState([]);

	const deleteBenefits = (selectedBenefits) => {
		let temp = [];
		const eliminatedList = [];
		benefits.forEach((benefit) => {
			if(!selectedBenefits.includes(benefit.id)) {
				temp.push(benefit)
			} else {
				eliminatedList.push(deleteBenefit(benefit.id));
			}
		})
		return eliminatedList;
	}

	const deleteBenefit = (id) => {
		httpClient.delete(`api/benefits/${id}`);
		setBenefits((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getBenefits = useCallback(async () => {
		try {
			const response = await httpClient.get('api/benefits');

			if (isMountedRef.current) {
				setBenefits(
					response.data.map((el) => {
						return {
							...el,
							promo: formatLanguageToString(el.promo, currentLanguage),
							description: formatLanguageToString(el.description, currentLanguage),
						};
					})
				);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef, currentLanguage]);

	useEffect(() => {
		getBenefits();
	}, [getBenefits]);

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.listOfBenefits)}
		>
			<Container maxWidth={false}>
				<Header
					actualPage={formatMessage(intl.listOfBenefits)}
					buttonRight={{ to: formatMessage(intl.urlBenefitsAdd) }}
					crumbs={[
						{
							label: formatMessage(intl.appContents),
						}
					]}
				/>
				<Box mt={3}>
					<Results
						benefits={benefits}
						deleteBenefit={deleteBenefit}
						deleteBenefits={deleteBenefits}
					/>
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
	currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(BenefitListView);