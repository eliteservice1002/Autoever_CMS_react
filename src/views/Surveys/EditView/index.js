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
import SurveysEditForm from '../Form/SurveysAddEditForm';
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

const SurveysEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [surveys, setSurveys] = useState(null);

  const getSurveys = useCallback(async () => {
    httpClient.get(`api/surveys/${params.surveysId}`)
      .then(json => {
        if (json.status && isMountedRef.current) {
          setSurveys(json.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef, params.surveysId]);

  useEffect(() => {
    getSurveys();
  }, [getSurveys]);

  if (!surveys) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editSurveys)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <SurveysEditForm update surveys={surveys} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(SurveysEditView);
