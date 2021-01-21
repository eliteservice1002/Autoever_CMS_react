import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import ContactsEditForm from '../Form/ContactsAddEditForm';

/* utils */
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
  }
}));

const ContactsEditView = ({ match }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [ contact, setContact ] = useState(null);

  const getContact = useCallback(async () => {
    try {
      const response = await httpClient.get(`api/soscontacts/${params.contactId}`);

      if (isMountedRef.current) {
        setContact(response.data);
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getContact();
  }, [getContact]);


  if (!contact) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="SOScontacts Edit"
    >
      <Container maxWidth={false}>
        <Header goBack/>
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <ContactsEditForm contact={contact} update />
        </Container>
      </Box>
    </Page>
  );
};

export default ContactsEditView;
