import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const FormsTable = () => {
  const [forms, setForms] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    companyName: '',
    cityName: '',
    state: ''
  });
  const [createFormData, setCreateFormData] = useState({
    companyName: '',
    cityName: '',
    state: ''
  });

  const navigate = useNavigate();

  

  // Fetch data from the backend API when the component mounts
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:9000/api/getAllForms');
        console.log("responses are:", response)
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms data:', error);
      }
    };

    fetchForms();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`http://localhost:9000/api/deleteForm/${id}`);
      setForms(forms.filter(form => form.id !== id));  // Update the state to remove the deleted form
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  // Handle Edit (Open Modal and Fetch Data)
  const handleEdit = async (id) => {
    try {
      const response = await axiosInstance.get(`http://localhost:9000/api/getForm/${id}`);
      const formData = response.data;

      setEditFormData({
        id: formData.id,
        companyName: formData.companyName,
        cityName: formData.cityName,
        state: formData.state
      });

      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  // Handle Update
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`http://localhost:9000/api/updateForm/${editFormData.id}`, editFormData);
      const response = await axiosInstance.get('http://localhost:9000/api/getAllForms');
      setForms(response.data);
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  // Handle Create
  const handleCreate = async () => {
    try {
      await axiosInstance.post('http://localhost:9000/api/createForm', createFormData);
      const response = await axiosInstance.get('http://localhost:9000/api/getAllForms');
      setForms(response.data);
      setOpenCreateModal(false);
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleStep = () => {
    navigate("/steps");
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleStep}
        sx={{ position: 'absolute', top: 16, right: 236 }}
      >
       Go To Steps
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Create New Form
      </Button>
      <br></br>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.id}</TableCell>
                <TableCell>{form.companyName}</TableCell>
                <TableCell>{form.cityName}</TableCell>
                <TableCell>{form.state}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEdit(form.id)}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => handleDelete(form.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Modal */}
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-form-modal"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" component="h2">
            Create Form
          </Typography>
          <TextField
            label="Company Name"
            name="companyName"
            value={createFormData.companyName}
            onChange={(e) => setCreateFormData({ ...createFormData, companyName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="cityName"
            value={createFormData.cityName}
            onChange={(e) => setCreateFormData({ ...createFormData, cityName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="State"
            name="state"
            value={createFormData.state}
            onChange={(e) => setCreateFormData({ ...createFormData, state: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-form-modal"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" component="h2">
            Edit Form
          </Typography>
          <TextField
            label="Company Name"
            name="companyName"
            value={editFormData.companyName}
            onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="cityName"
            value={editFormData.cityName}
            onChange={(e) => setEditFormData({ ...editFormData, cityName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="State"
            name="state"
            value={editFormData.state}
            onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default FormsTable;
