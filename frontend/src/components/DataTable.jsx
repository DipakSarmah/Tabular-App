import React, { useEffect, useState } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material'
import { getAll, createRecord, updateRecord, deleteRecord } from '../api'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'

const DataTable = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchRows()
  }, [])

  const fetchRows = async () => {
    setLoading(true)
    try {
      const res = await getAll()
      setRows(res.data)
    } catch {
      showToast('Failed to fetch data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, severity = 'success') =>
    setToast({ open: true, message, severity })

  const handleAdd = () => {
    const empty = {}
    for (let i = 1; i <= 10; i++) empty[`col${i}`] = ''
    setForm(empty)
    setEditing(null)
    setOpenForm(true)
  }

  const handleEdit = (row) => {
    setEditing(row)
    setForm(row)
    setOpenForm(true)
  }

  const handleDeleteConfirm = (row) => {
    setEditing(row)
    setOpenConfirm(true)
  }

  const handleDelete = async () => {
    try {
      await deleteRecord(editing.id)
      setRows(rows.filter((r) => r.id !== editing.id))
      showToast('Record deleted successfully', 'success')
    } catch {
      showToast('Failed to delete record', 'error')
    }
    setOpenConfirm(false)
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        const res = await updateRecord(editing.id, form)
        setRows(rows.map((r) => (r.id === res.data.id ? res.data : r)))
        showToast('Record updated successfully', 'success')
      } else {
        const res = await createRecord(form)
        setRows([...rows, res.data])
        showToast('Record added successfully', 'success')
      }
      setOpenForm(false)
    } catch {
      showToast('Error saving record', 'error')
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    ...Array.from({ length: 10 }, (_, i) => ({
      field: `col${i + 1}`,
      headerName: `Column ${i + 1}`,
      width: 150,
    })),
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDeleteConfirm(params.row)}
        />,
      ],
    },
  ]

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        maxWidth: '1600px',
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        ovewflow: 'hidden',
        border: 2,
        borderColor: 'error.main',
      }}
    >
      {/* Top Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ mb: 2, justifyContent: 'flex-end' }}
      >
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchRows}
        >
          Refresh
        </Button>
      </Stack>

      {/* DataGrid with internal scroll only */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto', //for internal scroll only
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          sx={{
            border: 'none',
            minWidth: 'xl',
          }}
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editing ? 'Edit Record' : 'Add Record'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
              mt: 1,
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <TextField
                key={i}
                label={`Column ${i + 1}`}
                value={form[`col${i + 1}`] || ''}
                onChange={(e) =>
                  setForm({ ...form, [`col${i + 1}`]: e.target.value })
                }
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete record ID {editing?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DataTable
