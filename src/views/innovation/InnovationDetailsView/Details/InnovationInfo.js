import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import previewimg from './Image-preview.svg'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  btncancel: {
    backgroundColor: 'rgb(52,103,177)',
    color: '#fff',
    width: 140,
    marginRight: 10
  },
}));

const Details = ({
  innovation,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = () => {
    enqueueSnackbar('El registro se ha guardado exitosamente', {
      variant: 'success',
      action: <Button>See all</Button>
    });
  }

  function createData(sentdate, sentby, comment) {
    return { sentdate, sentby, comment };
  }

  const rows = [
    createData('2020-11-16 16:45:41', 'John Doe', 'Lerem iosum doilor sit amet, conectetur adipiscing elit.'),
    createData('2020-11-16 16:45:41', 'John Doe', 'Lerem iosum doilor sit amet, conectetur adipiscing elit.'),
    createData('2020-11-16 16:45:41', 'John Doe', 'Lerem iosum doilor sit amet, conectetur adipiscing elit.'),
  ];

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{ width: 500 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Suggestion" {...a11yProps(0)} />
          <Tab label="Send reply" {...a11yProps(1)} />
          <Tab label="History" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={8}
              xs={12}
              style={{ textAlign: 'center', alignSelf: 'center' }}
            >
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Folio(ID):
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.id}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Date:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.created_at.substr(0, 10)} {innovation.created_at.substr(11, 8)}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Employee Number:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.employee_number}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Employee Name:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.employee_name}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Phone:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.phone}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Email:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.email}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Category:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  innovation.category
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Suggestion:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  {innovation.suggestion}
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={4}
                  style={{ textAlign: 'left', alignSelf: 'center', paddingLeft: 100 }}
                >
                  Image:
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={8}
                  style={{ textAlign: 'left', alignSelf: 'center' }}
                >
                  <img src={innovation.img_path ? innovation.img_path : previewimg} alt={innovation.img_path ? innovation.img_path : previewimg} />
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  style={{ textAlign: 'right', alignSelf: 'center' }}
                >
                  <Button
                    onClick={() => history.goBack()}
                    color="primary" className={classes.btncancel}
                  >
                    Regresar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={8}
              xs={12}
              style={{ textAlign: 'left', alignSelf: 'center' }}
            >
              <div style={{ marginBottom: 5 }}>Message to Employee:</div>
              <TextField
                fullWidth
                name="name"
                multiline
                rows={20}
                variant="outlined"
              // value={content}
              // onChange={handleContent}
              />
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'right', alignSelf: 'center', marginTop: 30 }}
              >
                <Button
                  onClick={() => history.goBack()}
                  color="primary" className={classes.btncancel}
                >
                  Regresar
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary" className={classes.btncancel}
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={8}
              xs={12}
              style={{ textAlign: 'left', alignSelf: 'center' }}
            >
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Sent date</TableCell>
                      <TableCell align="center">Sent by</TableCell>
                      <TableCell align="center">comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" key={index + 1}>{row.sentdate}</TableCell>
                        <TableCell align="center" key={index + 2}>{row.sentby}</TableCell>
                        <TableCell align="left" key={index + 3}>{row.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                item
                md={12}
                xs={12}
                style={{ textAlign: 'right', alignSelf: 'center', marginTop: 30 }}
              >
                <Button
                  onClick={() => history.goBack()}
                  color="primary" className={classes.btncancel}
                >
                  Regresar
                </Button>
                <Button
                  // onClick={handleSubmit}
                  color="primary" className={classes.btncancel}
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

export default Details;
