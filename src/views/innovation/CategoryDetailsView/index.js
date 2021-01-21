import React, {
	useCallback,
	useState,
	useEffect
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Details from './Details';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon } from 'react-feather';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';

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

const CategoryDetailsView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [category, setCategory] = useState(null);

	const getCategory = useCallback(async () => {
		try {
			const response = await httpClient.get(`api/innovation/categories/${params.categoryId}`);

			if (isMountedRef.current) {
				setCategory(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	}, [isMountedRef]);

	useEffect(() => {
		getCategory();
	}, [getCategory]);

	if (!category) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title="Category Details"
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={'Category Details'}
					buttonRight={{
						icon: (<EditIcon />),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlInnovationBoxCategoriesEdit, { categoryId: params.categoryId }),
					}}
				/>
				<Box mt={3}>
					<Details category={category} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(CategoryDetailsView);