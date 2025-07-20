import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { OrderType } from '../types';

interface OrderRow {
  orderNumber: number;
  orderItem: string;
  orderStatus: string;
  orderCreatedDate: string;
  reviewedBy?: string | number | null;
  reviewNotes?: string | null;
}

const columns: GridColDef[] = [
  { field: 'orderNumber', headerName: 'Order #', width: 100 },
  { field: 'orderItem', headerName: 'Item', width: 150 },
  { field: 'orderStatus', headerName: 'Status', width: 120 },
  { field: 'orderCreatedDate', headerName: 'Created', width: 150, valueGetter: (params: { row: OrderRow }) => new Date(params.row.orderCreatedDate).toLocaleDateString() },
  { field: 'reviewedBy', headerName: 'Reviewed By', width: 120, valueGetter: (params: { row: OrderRow }) => params.row.reviewedBy || '-' },
  { field: 'reviewNotes', headerName: 'Review Notes', width: 200, valueGetter: (params: { row: OrderRow }) => params.row.reviewNotes || '-' },
];

const OrdersPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<OrderRow[]>({
    queryKey: ['myOrders'],
    queryFn: api.getMyOrders,
  });
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [open, setOpen] = useState(false);
  const [orderItem, setOrderItem] = useState(OrderType.TABLET);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newOrder = await api.createOrder(orderItem);
      setOrders([newOrder, ...orders]);
      setOpen(false);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography>Error loading orders</Typography>;

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" gutterBottom>My Orders</Typography>
        <Button variant="contained" onClick={handleOpen}>New Order</Button>
      </Box>
      <DataGrid
        rows={orders || []}
        columns={columns}
        getRowId={(row) => row.orderNumber}
        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        pagination
        autoHeight
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Order Item"
            value={orderItem}
            onChange={e => setOrderItem(e.target.value as OrderType)}
            margin="normal"
          >
            {Object.values(OrderType).map((type) => (
              <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage; 