import React, {
  useRef,
  useState,
  Fragment,
  useEffect,
} from 'react';

import clsx from 'clsx';
import axios from 'axios';
import * as Yup from 'yup';
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
import TextFieldSwitchLanguage from 'src/components/TextFieldSwitchLanguage';

/* utils */
import {
  formatDate,
  printErrors,
  safeJSONStringify,
  formatLanguageToString,
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
  const [categoryId, setCategoryId] = useState(preguntas[0].id);

  useEffect(() => {
    // httpClient.get('api/surveys/categories')
    //   .then(({ data }) => {
    //     setCategories(data);
    //     if (update && surveys.categories) {
    //       surveys.categories.forEach((el) => {
    //         setSelectedCategories((prevState) => {
    //           return [...prevState, parseInt(el.id)];
    //         })
    //       })
    //     }
    //   })
  }, [])

  return (
    <Formik
      initialValues={{
        title: '',
        en_title: '',
        content: '',
        en_content: '',
        audiencia_everyone: Boolean(surveys.audiencia_everyone) || false,
        audiencia_profile_a: Boolean(surveys.audiencia_profile_a) || false,
        audiencia_profile_b: Boolean(surveys.audiencia_profile_b) || false,
        audiencia_em_location_a: Boolean(surveys.audiencia_em_location_a) || false,
        audiencia_em_location_b: Boolean(surveys.audiencia_em_location_b) || false,
        audiencia_em_department_a: Boolean(surveys.audiencia_em_department_a) || false,
        audiencia_em_department_b: Boolean(surveys.audiencia_em_department_b) || false,
        audiencia_em_area_a: Boolean(surveys.audiencia_em_area_a) || false,
        audiencia_em_area_b: Boolean(surveys.audiencia_em_area_b) || false,
        audiencia_em_area_sub_a: Boolean(surveys.audiencia_em_area_sub_a) || false,
        audiencia_em_area_sub_b: Boolean(surveys.audiencia_em_area_sub_b) || false,
        audiencia_em_type_a: Boolean(surveys.audiencia_em_type_a) || false,
        audiencia_em_type_b: Boolean(surveys.audiencia_em_type_b) || false,
        audiencia_em_type_c: Boolean(surveys.audiencia_em_type_c) || false,
        publication_home: Boolean(surveys.publication_home) || false,
        publication_expire: Boolean(surveys.publication_expire) || false,
        publication_publish: Boolean(surveys.publication_publish) || false,
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
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.title)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      name="en_title"
                      error={errors.en_title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.en_title}
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
                      error={errors.descriptioin}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      touched={touched.descriptioin}
                    />
                  </Grid>

                  <Grid item md={4} xs={4} className={clsx(classes.gridLabel)} >
                    {`${formatMessage(intl.description)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      multiline={true}
                      rows={5}
                      required
                      variant="outlined"
                      name="en_description"
                      error={errors.en_descriptioin}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      touched={touched.en_descriptioin}
                    />
                  </Grid>

                  <Grid item md={10} xs={10} className={clsx(classes.gridLabelGroup)} >
                    {`${formatMessage(intl.questions)}:`}
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    {`${formatMessage(intl.question)}:`}
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      name="preguntas"
                      error={errors.preguntas}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.preguntas}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <TextField
                      select
                      required
                      fullWidth
                      variant="outlined"
                      value={categoryId}
                      name="benefit_category_id"
                      SelectProps={{ native: true }}
                      onChange={(e) => setCategoryId(e.target.value)}
                      error={Boolean(touched.benefit_category_id && errors.benefit_category_id)}
                      helperText={
                        (Boolean(touched.benefit_category_id && errors.benefit_category_id))
                          ? errors.benefit_category_id : ''
                      }
                    >
                      {preguntas.map((el, index) => (
                        <option
                          key={index}
                          value={el.title}
                        >
                          {el.title}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item md={10} xs={10} className={clsx(classes.gridLabelGroup)} >
                    {`${formatMessage(intl.surveys)}:`}
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    Everyone:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_everyone"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_everyone)}
                        />
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    Profiles:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_profile_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_profile_a)}
                        />
                      }
                      label={'Custome Group A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_profile_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_profile_b)}
                        />
                      }
                      label={'Custome Group B'}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    N1:Employee Location:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_location_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_location_a)}
                        />
                      }
                      label={'SAP Location A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_location_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_location_a)}
                        />
                      }
                      label={'SAP Location B'}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    N2:Employee Department:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_location_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_location_b)}
                        />
                      }
                      label={'SAP Department A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_department_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_department_a)}
                        />
                      }
                      label={'SAP Department B'}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    N3:Employee Area:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_department_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_department_b)}
                        />
                      }
                      label={'SAP Area A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_area_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_area_a)}
                        />
                      }
                      label={'SAP Area B'}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    N3:Employee Sub-area:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_area_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_area_b)}
                        />
                      }
                      label={'SAP Sub-area A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_area_sub_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_area_sub_a)}
                        />
                      }
                      label={'SAP Sub-area B'}
                    />
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'flex-start', marginTop: 20 }}
                  >
                    N3:Employee Type:
                  </Grid>

                  <Grid item md={7} xs={7} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_area_sub_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_area_sub_b)}
                        />
                      }
                      label={'SAP Type A'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_type_a"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_type_a)}
                        />
                      }
                      label={'SAP Type B'}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="audiencia_em_type_b"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_type_b)}
                        />
                      }
                      label={'SAP Type C'}
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
                          name="publication_home"
                          onChange={handleChange}
                          checked={Boolean(values.audiencia_em_type_c)}
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
                          name="publication_publish"
                          onChange={handleChange}
                          checked={Boolean(values.publication_publish)}
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
                          name="publication_expire"
                          color="primary"
                          onChange={handleChange}
                          checked={Boolean(values.publication_expire)}
                        />
                      }
                      label={formatMessage(intl.yes)}
                    />
                  </Grid>

                  {(!Boolean(values.publication_expire)) ? null :
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


