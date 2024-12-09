import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 200, editable: true },
  { field: 'age', headerName: 'Age', width: 150, type: 'number' },
  { field: 'email', headerName: 'Email', width: 250 },
];

const rows = [
  { id: 1, name: 'John Doe', age: 28, email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', age: 34, email: 'jane.smith@example.com' },
  { id: 3, name: 'Samuel Green', age: 41, email: 'sam.green@example.com' },
  { id: 4, name: 'Alex Johnson', age: 22, email: 'alex.johnson@example.com' },
  { id: 5, name: 'Emily Davis', age: 30, email: 'emily.davis@example.com' },
  { id: 6, name: 'Michael Brown', age: 55, email: 'michael.brown@example.com' },
  { id: 7, name: 'Sarah White', age: 27, email: 'sarah.white@example.com' },
  { id: 8, name: 'David Lee', age: 38, email: 'david.lee@example.com' },
  { id: 9, name: 'Laura Wilson', age: 29, email: 'laura.wilson@example.com' },
  { id: 10, name: 'James Harris', age: 33, email: 'james.harris@example.com' },
];

export default function DataTable() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
