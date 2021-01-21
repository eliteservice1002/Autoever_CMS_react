import React, {
  useState,
} from 'react';

import clsx from 'clsx';
import { Formik } from 'formik';
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

const Satistics = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState(preguntas[0].id);

  return (
    <Formik
      initialValues={{
        title: '',
        total_empleados: '',
        contestation: '',
      }}
      onSubmit={
        async (values, { setErrors }) => {
          try {
            setIsSubmitting(true);
            // let data = { ...values };

            // data.categories = selectedCategories;

            // let errors = {};

            // if (!selectedCategories.length) {
            //   errors.categories = formatMessage(intl.selectOneCategory);
            // }

            // if (data.expiration_date) {
            //   data.expiration_date = formatDate(data.expiration_date);
            // } else {
            //   delete data.expiration_date;
            // }

            // if (data.img_path && data.img_path.file) {
            //   data.img_path = data.img_path.file;
            // } else if (!update) {
            //   errors.img_path = true;
            // } else {
            //   delete data.img_path;
            // }

            // if (data.archive_path && data.archive_path.file) {
            //   data.archive_path = data.archive_path.file;
            // } else {
            //   delete data.archive_path;
            // }

            // data.title = safeJSONStringify(titleML);
            // data.content = safeJSONStringify(contentML);

            // if (data.title.length > 1000) {
            //   errors.title = formatMessage(intl.maximumCharacters, { characters: 900 });
            // }

            // if (Object.keys(errors).length) {
            //   setErrors(errors);
            //   setIsSubmitting(false);
            //   return;
            // }

            // let url = `api/surveys/${(update) ? surveys.id + '/edit' : 'create'}`;

            // let response = await httpClient.postFile(url, serealizeData(data))
            //   .then(({ data }) => {
            //     if (data.status === 1) {
            //       enqueueSnackbar(
            //         formatMessage(intl[(update) ? 'successUpdatedSurveys' : 'successAddedSurveys']),
            //         { variant: 'success' }
            //       )
            //       history.push(formatMessage(intl.urlSurveys));
            //     }
            //   })
            //   .catch((err) => {
            //     console.error(err);
            //     printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
            //     setIsSubmitting(false);
            //   })
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
                      touched={touched.title}
                      value={values.title}
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.total_empleados)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      name="total_empleados"
                      error={errors.total_empleados}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.total_empleados}
                      value={values.total_empleados}
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.contestation)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      name="contestation"
                      error={errors.contestation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.contestation}
                      value={values.contestation}
                    />
                  </Grid>

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

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(Satistics);


