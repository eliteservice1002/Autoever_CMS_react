import React, {
  useState,
  Fragment,
} from 'react';

import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Box,
  Grid,
  Card,
  Button,
  TextField,
  makeStyles,
  CardContent,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* utils */
import {
  formatDate,
  printErrors,
} from 'src/utils';
import httpClient from 'src/utils/httpClient';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiFormHelperText-root.Mui-required': {
      color: 'red'
    }
  },
  customButton: {
    textAlign: 'center',
  },
  gridLabel: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  gridLabelGroup: {
    marginLeft: 50,
    textAlign: 'left',
    alignSelf: 'center',
  },
  imgPreview: {
    maxWidth: '200px'
  }
}));

const preguntas = [
  { id: 1, title: "Open Answer" },
  { id: 2, title: "Open Answer" },
  { id: 3, title: "Open Answer" },
  { id: 4, title: "Open Answer" },
  { id: 5, title: "Open Answer" }
]

const SurveysAddEditForm = ({ surveys, update, intl, currentLanguage }) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serealizeData = (data, update = false) => {
    let formData = new FormData();

    if (update) {
      // update...
      // Logic that applies only when editing
    } else {
      // create...
      // Logic that applies only when creating
    }
    // Logic that applies both when creating and editing
    for (const input in data) {
      switch (input) {
        // this is used for when you want
        // to treat a field differently from the rest
        case 'custom_field':
          break;
        case 'promoted_to_home':
        case 'expires':
        case 'published':
          formData.append(input, (data[input]) ? 1 : 0);
          break;
        default:
          try {
            data[input] && formData.append(input, data[input]);
          } catch (err) {
            console.error(err)
          }
      }
    }

    return formData;
  }

  return (
    <Formik
      initialValues={{
        title: surveys.title || '',
        description: surveys.description || '',
        promoted_to_home: Boolean(surveys.promoted_to_home) || false,
        expires: Boolean(surveys.expires) || false,
        published: Boolean(surveys.published) || false,
      }}
      onSubmit={
        async (values, { setErrors }) => {
          try {
            setIsSubmitting(true);
            let data = { ...values };

            let errors = {};

            if (data.expiration_date) {
              data.expiration_date = formatDate(data.expiration_date);
            } else {
              delete data.expiration_date;
            }

            if (Object.keys(errors).length) {
              setErrors(errors);
              setIsSubmitting(false);
              return;
            }

            let url = `api/surveys/${(update) ? surveys.id + '/edit' : 'create'}`;

            await httpClient.postFile(url, serealizeData(data))
              .then(({ data }) => {
                if (data.status === 1) {
                  enqueueSnackbar(
                    formatMessage(intl[(update) ? 'successUpdatedSurveys' : 'successAddedSurveys']),
                    { variant: 'success' }
                  )
                  history.push(formatMessage(intl.urlSurveys));
                }
              })
              .catch((err) => {
                console.error(err);
                printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
                setIsSubmitting(false);
              })
          } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            enqueueSnackbar(
              formatMessage(intl.unexpectedError),
              { variant: 'error' }
            )
          }
        }
      }
    >
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleSubmit,
        handleChange,
      }) => {

        return (
          <form onSubmit={handleSubmit} className={clsx(classes.root)} >
            <Card>
              <CardContent>
                <Grid container spacing={3} >
                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`* ${formatMessage(intl.title)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      name="title"
                      error={errors.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                    />
                  </Grid>


                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`* ${formatMessage(intl.description)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      multiline={true}
                      rows={5}
                      required
                      variant="outlined"
                      name="description"
                      error={errors.description}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                    />
                  </Grid>

                  <Grid item md={10} xs={10} className={clsx(classes.gridLabelGroup)} >
                    {`${formatMessage(intl.publication)}:`}
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.promotedToHomeQuestion)}`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="promoted_to_home"
                          onChange={handleChange}
                          checked={Boolean(values.promoted_to_home)}
                        />
                      }
                      label={formatMessage(intl.yes)}
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.publishedQuestion)}`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="published"
                          onChange={handleChange}
                          checked={Boolean(values.published)}
                        />
                      }
                      label={formatMessage(intl.yes)}
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {formatMessage(intl.ExpiresQuestion)}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="expires"
                          color="primary"
                          onChange={handleChange}
                          checked={Boolean(values.expires)}
                        />
                      }
                      label={formatMessage(intl.yes)}
                    />
                  </Grid>

                  {(!Boolean(values.expires)) ? null :
                    <Fragment>
                      <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                        {`${formatMessage(intl.expirationDate)}:`}
                      </Grid>

                      <Grid item md={7} xs={7} >
                        <TextField
                          required
                          fullWidth
                          type='datetime-local'
                          name='expiration_date'
                          onChange={handleChange}
                          defaultValue={(update) ? formatDate(surveys.expiration_date) : ''}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Fragment>
                  }

                  <Grid item md={2} xs={6} style={{ textAlign: 'center' }} >
                    <Box mt={2}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => history.goBack()}
                      >
                        {formatMessage(intl.goBack)}
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item md={2} xs={6} style={{ textAlign: 'center' }} >
                    <Box mt={2}>
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        {formatMessage(intl.save)}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item md={4} xs={12} style={{ textAlign: 'center' }} ></Grid>
                  <Grid item />
                </Grid>
              </CardContent>
            </Card>
          </form>
        )
      }}
    </Formik>
  );
};

SurveysAddEditForm.propTypes = {
  update: PropTypes.bool,
  surveys: PropTypes.object,
  className: PropTypes.string,
};

SurveysAddEditForm.defaultProps = {
  surveys: {},
}

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(SurveysAddEditForm);


