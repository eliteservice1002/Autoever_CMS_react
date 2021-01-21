import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  makeStyles
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import Chart from './Chart';

const useStyles = makeStyles(() => ({
  root: {},
  chart: {
    height: '100%'
  }
}));

const PerformanceOverTime = ({ title, module, className, ...rest }) => {
  const classes = useStyles();
  const performance = {
    thisWeek: {
      data: [],
      labels: []
    },
    thisMonth: {
      data: [],
      labels: []
    },
    thisYear: {
      data: [10, 5, 11, 20, 13, 28, 18, 4, 13, 12, 13, 5],
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },
    thisYearModule: {
      data: [10 * 3, 5 * 3, 11 * 3, 20 * 3, 13 * 3, 28 * 3, 18 * 3, 4 * 3, 13 * 3, 12 * 3, 13 * 3, 5],
      labels: [
        'FAQS',
        'Events',
        'Noticias',
        'App Users',
        'Beneficios',
        'Bus Routes',
        'SOS Contacts',
        'Privacy Notice',
        'Terms and conditions',
      ]
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title={title}
      />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <Box
            height={375}
            minWidth={500}
          >
            <Chart
              className={classes.chart}
              data={performance[(module) ? 'thisYearModule' : 'thisYear'].data}
              labels={performance[(module) ? 'thisYearModule' : 'thisYear'].labels}
            />
          </Box>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

PerformanceOverTime.propTypes = {
  className: PropTypes.string
};

PerformanceOverTime.defaultProps = {
  title: ''
}

export default PerformanceOverTime;
