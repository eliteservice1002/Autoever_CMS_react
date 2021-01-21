import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import FaqsAddForm from '../Form/FaqsAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const FaqsAdd = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="FAQs Edit"
    >
      <Container maxWidth={false}>
        <Header goBack/>
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <FaqsAddForm />
        </Container>
      </Box>
    </Page>
  );
};

export default FaqsAdd;
