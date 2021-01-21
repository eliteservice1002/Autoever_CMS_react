import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import ContactsAddForm from '../Form/ContactsAddEditForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CustomerEditView = () => {
  const classes = useStyles();

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
          <ContactsAddForm />
        </Container>
      </Box>
    </Page>
  );
};

export default CustomerEditView;
