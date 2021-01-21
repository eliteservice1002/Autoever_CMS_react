import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  Button,
  SvgIcon,
  Checkbox,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  makeStyles,
  IconButton,
  InputAdornment,
  TablePagination,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EqualizerIcon from '@material-ui/icons/Equalizer';

/* utils */
import {
  applySort,
  handleDelete,
  applyFilters,
  getComparator,
  applyPagination,
  sortOptionsDefault,
  descendingComparator,
  handleDeleteAllSelected,
} from 'src/utils/defaultTableSettings';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

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
  intl,
  surveys,
  className,
  deleteSurvey,
  deleteSurveys,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAllSurveys = (event) => {
    setSelectedSurveys(event.target.checked
      ? surveys.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedSurveys.includes(newId)) {
      setSelectedSurveys((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedSurveys((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredSurveys = applyFilters(surveys, query, filters);
  const sortedSurveys = applySort(filteredSurveys, sort);
  const paginatedSurveys = applyPagination(sortedSurveys, page, limit);
  const enableBulkOperations = selectedSurveys.length > 0;
  const selectedSomeSurveys = selectedSurveys.length > 0 && selectedSurveys.length < surveys.length;
  const selectedAllSurveys = selectedSurveys.length === surveys.length;

  return (
    <Card className={clsx(classes.root, className)} >
      <Box p={2} minHeight={56} display="flex" alignItems="center" >
        <TextField
          className={classes.queryField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  fontSize="small"
                  color="action"
                >
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          value={query}
          variant="outlined"
          onChange={handleQueryChange}
          placeholder={formatMessage(intl.search)}
        />
        <Box flexGrow={1} />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllSurveys}
              onChange={handleSelectAllSurveys}
              indeterminate={selectedSomeSurveys}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
              onClick={() => handleDeleteAllSelected(
                selectedSurveys,
                deleteSurveys,
                setSelectedSurveys,
                enqueueSnackbar,
                { ...intl, formatMessage }
              )}
            >
              {formatMessage(intl.deleteAll)}
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllSurveys}
                    onChange={handleSelectAllSurveys}
                    indeterminate={selectedSomeSurveys}
                  />
                </TableCell>

                <TableCell align="center">
                  {formatMessage(intl.title)}
                </TableCell>

                <TableCell align="center">
                  {formatMessage(intl.description)}
                </TableCell>

                <TableCell align="center">
                  {formatMessage(intl.date)}
                </TableCell>

                <TableCell align="center">
                  {formatMessage(intl.actions)}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSurveys.map((n) => {
                const isSurveyselected = selectedSurveys.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={n.id}
                    selected={isSurveyselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSurveyselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isSurveyselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.title}
                    </TableCell>

                    <TableCell align="center">
                      {n.description}
                    </TableCell>

                    <TableCell align="center">
                      {n.expiration_date}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlSurveysDetail, { surveysId: n.id })}
                      >
                        <SvgIcon fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlSurveysEdit)}
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(
                          n.id,
                          deleteSurvey,
                          enqueueSnackbar,
                          { ...intl, formatMessage }
                        )}
                      >
                        <SvgIcon fontSize="small">
                          <HighlightOffIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <EqualizerIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredSurveys.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  surveys: PropTypes.array.isRequired
};

Results.defaultProps = {
  surveys: []
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

const mapDispatchToProps = (dispatch) => ({
  // 
})

export default connectIntl(
  mapStateToProps,
  mapDispatchToProps
)(Results);
