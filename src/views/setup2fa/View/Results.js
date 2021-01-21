import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  TextField,
  CardContent,
  makeStyles, Grid
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import httpClient from 'src/utils/httpClient';

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  }
}));

const Results = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    httpClient.post('api/2fa-generate-secret', {})
      .then(json => {
        setQr(json.qr)
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong.', {
          variant: 'error'
        });
      });
  }, [enqueueSnackbar])

  const handlesubmit = () => {
    if (secret === '')
      return;
    httpClient.post('api/check2fa', {secret: secret})
      .then(json => {
        if (json.status) {
          enqueueSnackbar(json.msg, {
            variant: 'success'
          });
        }
        else {
          enqueueSnackbar(json.msg, {
            variant: 'error'
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong.', {
          variant: 'error'
        });
      });
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={700}>
          <CardContent>
            <Grid
              container
              spacing={3}
              style={{ marginTop: 30 }}
            >

              <Grid
                md={4}
                xs={12}
                style={{ textAlign: 'center' }}
                item
              >
              </Grid>
              <Grid
                md={4}
                xs={12}
                item
              >
                <div style={{ textAlign: 'center' }}>
                  <img src={qr} style={{ width: 300, height: 250 }} alt={qr} />
                </div>
                <TextField
                  fullWidth
                  label="Authentication code"
                  name="name"
                  required
                  type="number"
                  onChange={(e) => setSecret(e.target.value)}
                  value={secret}
                  variant="outlined"
                />
                <Box mt={2} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlesubmit}
                  >
                    Verify and enable
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
