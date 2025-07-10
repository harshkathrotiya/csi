import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  createService,
  updateService,
  deleteService
} from '../../store/slices/serviceSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Service name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  duration: Yup.number()
    .positive('Duration must be positive')
    .required('Duration is required'),
  category: Yup.string().required('Category is required'),
  staffIds: Yup.array().min(1, 'At least one staff member is required')
});

const ManageServices = () => {
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);
  const { users } = useSelector((state) => state.auth); // Assuming we have staff users in auth state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const staffMembers = users?.filter(user => user.role === 'staff') || [];

  const handleOpenDialog = (service = null) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingService(null);
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setServiceToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (editingService) {
      await dispatch(updateService({ id: editingService._id, ...values }));
    } else {
      await dispatch(createService(values));
    }
    setSubmitting(false);
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (serviceToDelete) {
      await dispatch(deleteService(serviceToDelete._id));
      handleCloseDeleteDialog();
    }
  };

  const categories = ['Haircut', 'Massage', 'Facial', 'Manicure', 'Pedicure', 'Other'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">
          Manage Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {service.name}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={service.active}
                        onChange={() =>
                          dispatch(updateService({
                            id: service._id,
                            active: !service.active
                          }))
                        }
                      />
                    }
                    label={service.active ? 'Active' : 'Inactive'}
                  />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2">
                    Price: ${service.price}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {service.duration} mins
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Category: {service.category}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {service.staff?.map((staff) => (
                    <Chip
                      key={staff._id}
                      label={staff.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => handleOpenDialog(service)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDeleteDialog(service)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <Formik
          initialValues={{
            name: editingService?.name || '',
            description: editingService?.description || '',
            price: editingService?.price || '',
            duration: editingService?.duration || '',
            category: editingService?.category || '',
            staffIds: editingService?.staff?.map(s => s._id) || [],
            active: editingService?.active ?? true
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Service Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="description"
                      label="Description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      name="price"
                      label="Price ($)"
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      name="duration"
                      label="Duration (minutes)"
                      value={values.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.duration && Boolean(errors.duration)}
                      helperText={touched.duration && errors.duration}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      name="category"
                      label="Category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.category && Boolean(errors.category)}
                      helperText={touched.category && errors.category}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      SelectProps={{ multiple: true }}
                      name="staffIds"
                      label="Assigned Staff"
                      value={values.staffIds}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.staffIds && Boolean(errors.staffIds)}
                      helperText={touched.staffIds && errors.staffIds}
                    >
                      {staffMembers.map((staff) => (
                        <MenuItem key={staff._id} value={staff._id}>
                          {staff.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="active"
                          checked={values.active}
                          onChange={handleChange}
                        />
                      }
                      label="Active"
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {serviceToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageServices;