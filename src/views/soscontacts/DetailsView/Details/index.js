import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ContactInfo from './ContactInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Details = ({
  contact,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid
        item
        lg={12}
        md={12}
        xl={12}
        xs={12}
      >
        <ContactInfo contact={contact} />
      </Grid>
    </Grid>
  );
};

Details.propTypes = {
  className: PropTypes.string,
  contact: PropTypes.object.isRequired
};

export default Details;
