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
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';

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

const SurveysListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [surveys, setSurveys] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const deleteSurveys = (selectedSurveys) => {
    let temp = [];
    const eliminatedList = [];
    surveys.forEach((n) => {
      if (!selectedSurveys.includes(n.id)) {
        temp.push(n)
      } else {
        eliminatedList.push(deleteSurvey(n.id));
      }
    })
    return eliminatedList;
  }

  const deleteSurvey = (id) => {
    httpClient.delete(`api/surveys/${id}`);
    setSurveys((prevState) => prevState.filter((el) => el.id != id))
    return id;
  }

  const getSurveys = useCallback(async () => {
    try {
      const response = await httpClient.get('api/surveys');

      if (isMountedRef.current) {
        setSurveys(response.data);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Data loading failed!', {
        variant: 'error'
      });
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSurveys();
  }, [getSurveys]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.surveysList)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.surveysList)}
          buttonRight={{ to: formatMessage(intl.urlSurveysAdd) }}
          crumbs={[
            {
              label: formatMessage(intl.appContents),
            }
          ]}
        />
        <Box mt={3}>
          <Results
            surveys={surveys}
            deleteSurvey={deleteSurvey}
            deleteSurveys={deleteSurveys}
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

export default connectIntl(mapStateToProps)(SurveysListView);
