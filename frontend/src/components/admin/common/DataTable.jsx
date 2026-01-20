import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Typography,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Reusable data table component for admin pages
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  error = null,
  // Pagination
  pagination = null,
  onPageChange,
  onRowsPerPageChange,
  // Selection
  selectable = false,
  selected = [],
  onSelectChange,
  // Sorting
  sortable = true,
  sortBy = null,
  sortOrder = 'asc',
  onSort,
  // Search
  searchable = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  // Actions
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  customActions,
  rowActions,
  // Title and toolbar
  title,
  toolbar,
  // Styling
  dense = false,
  stickyHeader = true,
  maxHeight = null,
  emptyMessage,
  // Row props
  getRowId = (row) => row._id || row.id,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const [actionAnchor, setActionAnchor] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Handle sort click
  const handleSort = (columnId) => {
    if (!sortable || !onSort) return;
    const isAsc = sortBy === columnId && sortOrder === 'asc';
    onSort(columnId, isAsc ? 'desc' : 'asc');
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (!onSelectChange) return;
    if (event.target.checked) {
      onSelectChange(data.map(getRowId));
    } else {
      onSelectChange([]);
    }
  };

  // Handle select one
  const handleSelectOne = (rowId) => {
    if (!onSelectChange) return;
    const selectedIndex = selected.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, rowId];
    } else {
      newSelected = selected.filter((id) => id !== rowId);
    }

    onSelectChange(newSelected);
  };

  // Handle action menu
  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setActionAnchor(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
    setActionRow(null);
  };

  const handleAction = (action) => {
    if (actionRow) {
      action(actionRow);
    }
    handleActionClose();
  };

  // Check if row is selected
  const isSelected = (rowId) => selected.indexOf(rowId) !== -1;

  // Render cell value
  const renderCellValue = (row, column) => {
    if (column.render) {
      return column.render(row);
    }

    const value = column.accessor
      ? typeof column.accessor === 'function'
        ? column.accessor(row)
        : row[column.accessor]
      : row[column.id];

    if (value === null || value === undefined) {
      return '-';
    }

    // Handle common value types
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    if (column.type === 'datetime') {
      return new Date(value).toLocaleString();
    }
    if (column.type === 'boolean') {
      return value ? t('common.yes', 'Yes') : t('common.no', 'No');
    }
    if (column.type === 'chip') {
      const chipProps = column.chipProps?.(value) || {};
      return <Chip size="small" label={value} {...chipProps} />;
    }

    return value;
  };

  // Default row actions
  const defaultRowActions = useMemo(() => {
    const actions = [];
    if (onView) {
      actions.push({
        label: t('common.view', 'View'),
        icon: <VisibilityIcon fontSize="small" />,
        onClick: onView,
      });
    }
    if (onEdit) {
      actions.push({
        label: t('common.edit', 'Edit'),
        icon: <EditIcon fontSize="small" />,
        onClick: onEdit,
      });
    }
    if (onDelete) {
      actions.push({
        label: t('common.delete', 'Delete'),
        icon: <DeleteIcon fontSize="small" />,
        onClick: onDelete,
        color: 'error',
      });
    }
    return actions;
  }, [t, onView, onEdit, onDelete]);

  const allRowActions = [...defaultRowActions, ...(rowActions || [])];
  const hasRowActions = allRowActions.length > 0;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {title && (
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          )}
          {selected.length > 0 && (
            <Chip
              label={t('admin.table.selected', '{{count}} selected', { count: selected.length })}
              size="small"
              color="primary"
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder || t('admin.table.search', 'Search...')}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {toolbar}

          {onRefresh && (
            <Tooltip title={t('common.refresh', 'Refresh')}>
              <IconButton onClick={onRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {customActions}

          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              {t('common.add', 'Add')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: maxHeight }}>
        <Table
          stickyHeader={stickyHeader}
          size={dense ? 'small' : 'medium'}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={
                      data.length > 0 && selected.length === data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, width: column.width }}
                  sortDirection={sortBy === column.id ? sortOrder : false}
                  sx={{ fontWeight: 600 }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {hasRowActions && (
                <TableCell align="right" sx={{ fontWeight: 600, width: 60 }}>
                  {t('admin.table.actions', 'Actions')}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                  {hasRowActions && (
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (hasRowActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography color="text.secondary">
                    {emptyMessage || t('admin.table.noData', 'No data available')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              data.map((row) => {
                const rowId = getRowId(row);
                const isItemSelected = isSelected(rowId);

                return (
                  <TableRow
                    key={rowId}
                    hover
                    selected={isItemSelected}
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectOne(rowId)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {renderCellValue(row, column)}
                      </TableCell>
                    ))}
                    {hasRowActions && (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, row)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalItems || 0}
          page={(pagination.currentPage || 1) - 1}
          rowsPerPage={pagination.itemsPerPage || 10}
          onPageChange={(e, page) => onPageChange?.(page + 1)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={t('admin.table.rowsPerPage', 'Rows per page')}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={handleActionClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {allRowActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleAction(action.onClick)}
            sx={{ color: action.color ? `${action.color}.main` : 'inherit' }}
          >
            {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      render: PropTypes.func,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      minWidth: PropTypes.number,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      sortable: PropTypes.bool,
      type: PropTypes.oneOf(['date', 'datetime', 'boolean', 'chip']),
      chipProps: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number,
    itemsPerPage: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  selectable: PropTypes.bool,
  selected: PropTypes.array,
  onSelectChange: PropTypes.func,
  sortable: PropTypes.bool,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  searchable: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onRefresh: PropTypes.func,
  customActions: PropTypes.node,
  rowActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func.isRequired,
      color: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  toolbar: PropTypes.node,
  dense: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  emptyMessage: PropTypes.string,
  getRowId: PropTypes.func,
  onRowClick: PropTypes.func,
};

export default DataTable;
