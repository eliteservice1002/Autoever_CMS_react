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
import { useSnackbar } from 'notistack';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));

const ContactsListView = ({ intl }) => {
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const { enqueueSnackbar } = useSnackbar();
	const [ soscontacts, setSOScontacts ] = useState([]);

	const deleteContacts = (selectedContacts) => {
    let temp = [];
    const eliminatedList = [];
    soscontacts.forEach((contact) => {
      if(!selectedContacts.includes(contact.id)) {
        temp.push(contact)
      } else {
        eliminatedList.push(deleteContact(contact.id));
      }
    })
    return eliminatedList;
  }

  const deleteContact = (id) => {
    httpClient.delete(`api/soscontacts/${id}`);
    setSOScontacts((prevState) => prevState.filter((el) => el.id != id))
    return id;
  }

	const getSOScontacts = useCallback(async () => {
		try {
			const response = await httpClient.get('api/soscontacts');

      if (isMountedRef.current) {
        setSOScontacts(response.data);
      }
    } catch (err) {
      console.error(err);
			enqueueSnackbar('Data loading failed!', {
				variant: 'error'
			});
    }
	}, [isMountedRef, enqueueSnackbar]);

	useEffect(() => {
		getSOScontacts();
	}, [getSOScontacts]);

	return (
		<Page
			className={classes.root}
			title="SOScontacts List"
		>
			<Container maxWidth={false}>
				<Header
					actualPage='SOScontacts List'
					buttonRight={{ to: formatMessage(intl.urlSosContactsAdd) }}
					crumbs={[
						{
							label: 'App Contents',
						}
					]}
				/>
				<Box mt={3}>
					<Results
						contacts={soscontacts}
						deleteContact={deleteContact}
						deleteContacts={deleteContacts}
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
)(ContactsListView);