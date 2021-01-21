import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const ContactInfo = ({
  contact,
  className,
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} >
      <CardHeader title="SOS contact info" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              ID
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {contact.id}
              </Typography>
            </TableCell>
            <TableCell className={classes.fontWeightMedium}>
              Nombre
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {contact.name}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Nombre(ingles)
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {contact.name_us}
              </Typography>
            </TableCell>
            <TableCell className={classes.fontWeightMedium}>
              Telephone
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {contact.telephone}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

ContactInfo.propTypes = {
  className: PropTypes.string,
  contact: PropTypes.object.isRequired
};

export default ContactInfo;
