import React, { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { createStaff, updateStaff, deleteStaff, fetchStaffMembers } from '../../store/slices/staffSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .when('isEditing', {
      is: false,
      then: Yup.string().required('Password is required')
    }),
  specialties: Yup.array()
    .min(1, 'At least one specialty is required')
    .required('Specialties are required')
});

const ManageStaff = () => {
  const dispatch = useDispatch();
  const { staffMembers, loading, error } = useSelector((state) => state.staff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchStaffMembers());
  }, [dispatch]);

  const handleOpenDialog = (staff = null) => {
    setEditingStaff(staff);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingStaff(null);
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setStaffToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingStaff) {
        await dispatch(updateStaff({ id: editingStaff._id, ...values }));
      } else {
        await dispatch(createStaff(values));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      if (staffToDelete) {
        await dispatch(deleteStaff(staffToDelete._id));
        handleCloseDeleteDialog();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const specialties = [
    'Haircut',
    'Coloring',
    'Styling',
    'Massage',
    'Facial',
    'Manicure',
    'Pedicure'
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">
          Manage Staff
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Staff
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {staffMembers.map((staff) => (
          <Grid item xs={12} sm={6} md={4} key={staff._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  >
                    {staff.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {staff.name}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={staff.active}
                          onChange={() =>
                            dispatch(updateStaff({
                              id: staff._id,
                              active: !staff.active
                            }))
                          }
                          size="small"
                        />
                      }
                      label={staff.active ? 'Active' : 'Inactive'}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body2">{staff.email}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body2">{staff.phone}</Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Specialties:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {staff.specialties?.map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => handleOpenDialog(staff)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDeleteDialog(staff)}
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
          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <Formik
          initialValues={{
            name: editingStaff?.name || '',
            email: editingStaff?.email || '',
            phone: editingStaff?.phone || '',
            password: '',
            specialties: editingStaff?.specialties || [],
            active: editingStaff?.active ?? true,
            isEditing: Boolean(editingStaff)
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
                      label="Full Name"
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
                      name="email"
                      label="Email Address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>

                  {!editingStaff && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        name="password"
                        label="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      SelectProps={{ multiple: true }}
                      name="specialties"
                      label="Specialties"
                      value={values.specialties}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.specialties && Boolean(errors.specialties)}
                      helperText={touched.specialties && errors.specialties}
                    >
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty}
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
        <DialogTitle>Delete Staff Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {staffToDelete?.name}? This action cannot be undone.
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

export default ManageStaff;