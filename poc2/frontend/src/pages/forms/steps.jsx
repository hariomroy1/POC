import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from "../../utils/axiosInstance"

const Steps = () => {
  const [stepName, setStepName] = useState(''); // Single step name input
  const [orgId, setOrgId] = useState(''); // State for organization ID
  const [userId, setUserId] = useState(''); // State for user ID
  const navigate = useNavigate();

  // Handle the input change for stepName
  const handleStepChange = (event) => {
    setStepName(event.target.value);
  };

  // Handle the API call to create a step
  const handleSubmit = async () => {
    try {
      // Make a POST request to the API to save the step
      const response = await axiosInstance.post('http://localhost:9000/api/createStep', {
        orgId,    // Organization ID
        userId,   // User ID
        stepName  // Step name
      });

      console.log('Step created successfully:', response.data);
      // Optionally navigate to a different page after submission
      
      //navigate('/stepSummary', { state: { stepName, orgId, userId } });
    } catch (error) {
      console.error('Error submitting step:', error);
      alert('Error submitting step: ' + error.message); // Notify user of error
    }
  };

  // Navigation for back
  const handleBack = () => {
    navigate('/getAllForms');
  };

  const handleSummarySteps = () => {
    navigate("/stepSummary")
  }
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Step
      </Typography>
      <Button onClick={handleBack}>Go Back</Button>

      {/* Input fields for Organization ID and User ID */}
      <TextField
        label="Organization ID"
        value={orgId}
        onChange={(event) => setOrgId(event.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="User ID"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Input field for Step Name */}
      <TextField
        label="Step Name"
        value={stepName}
        onChange={handleStepChange}
        fullWidth
        margin="normal"
      />

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Step
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSummarySteps}
        >
          Summary Step
        </Button>
      </Box>
    </Box>
  );
};

export default Steps;
