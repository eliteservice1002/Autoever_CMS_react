import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
      {...rest}
      style={{ justifyContent: 'center' }}
    >
      <Grid item>
        <Typography
          variant="h3"
          color="textPrimary"
          style={{ textAlign: 'center' }}
        >
          Setup Two Factor Authentication
        </Typography>
        <Typography
          variant="h3"
          color="textPrimary"
          style={{ textAlign: 'center' }}
        >
          Add the following code to Google Authenticator and verify
        </Typography>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
