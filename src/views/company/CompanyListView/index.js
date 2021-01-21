import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Results from './Results';
import Page from 'src/components/Page';
import httpClient from 'src/utils/httpClient';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

const CompanyListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ companies, setCompanies ] = useState([]);

	const deleteCompanies = (selectedCompanies) => {
		let temp = [];
		const eliminatedList = [];
		companies.forEach((company) => {
			if(!selectedCompanies.includes(company.id)) {
				temp.push(company)
			} else {
				eliminatedList.push(deleteCompany(company.id));
			}
		})
		return eliminatedList;
	}

	const deleteCompany = (id) => {
		httpClient.delete(`api/companies/${id}`);
		setCompanies((prevState) => prevState.filter((el) => el.id != id))
		return id;
	}

	const getCompanies = useCallback(async () => {
		try {
			const response = await httpClient.get('api/companies');

			if (isMountedRef.current) {
				setCompanies(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCompanies();
	}, [getCompanies]);

	return (
		<Page
			className={classes.root}
			title="Companies"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='Companies'
					buttonRight={{ to: formatMessage(intl.urlCompaniesAdd) }}
					crumbs={[
						{
							label: 'Super admin',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						companies={companies}
						deleteCompany={deleteCompany}
						deleteCompanies={deleteCompanies}
					/>
				</Box>
			</Container>
		</Page>
	);
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
)(CompanyListView);