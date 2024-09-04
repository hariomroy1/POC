import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import
import axiosInstance from '../../utils/axiosInstance';

const StepsSummary = () => {
  const [steps, setSteps] = useState([]); // Complete list of steps
  const [assignedSteps, setAssignedSteps] = useState([]); // Steps assigned to the user
  const [activeStep, setActiveStep] = useState(0); // Track the current active step
  const [userRole, setUserRole] = useState(null); // User role from token
  const navigate = useNavigate();

  // Extract username and role from JWT token
  const token = localStorage.getItem('userToken');
  const decodedToken = token ? jwtDecode(token) : null;
  console.log("decoded tokens are: ",decodedToken)
  const username = decodedToken ? decodedToken.username : null;
  const role = decodedToken ? decodedToken.RoleName : null;
  console.log("role names are: ",role)
  useEffect(() => {
    if (role) {
      setUserRole(role); // Set user role state
    }

    const fetchSteps = async () => {
      try {
        // Fetch all steps (replace with your actual API endpoint)
        const allStepsResponse = await axiosInstance.get('http://localhost:9000/api/getAllSteps/1');
        setSteps(allStepsResponse.data); // Set the complete list of steps

        // Fetch assigned steps for the user if the role is not admin or superadmin
        if (role && role !== 'admin' && role !== 'superadmin' && username) {
          const assignedStepsResponse = await axiosInstance.get(`http://localhost:9000/api/getStepsNameWithUserName/${username}`);
          setAssignedSteps(assignedStepsResponse.data.steps); // Set the assigned steps for the user
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, [username, role]);

  // Determine if the user is an admin or superadmin
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  // Handle next button click
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle previous button click
  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/steps');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Steps Summary
      </Typography>
      <Button onClick={handleBack} variant="contained" color="primary">
        Go Back
      </Button>
      {steps.length > 0 ? (
        <>
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              // Check if the step is assigned to the user, or if user is admin/superadmin
              const isAssigned = isAdmin || assignedSteps.includes(step.stepName);

              return (
                <Step key={index} completed={isAssigned} disabled={!isAssigned}>
                  <StepLabel>{step.stepName}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBackStep}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={handleNext}
              disabled={activeStep >= steps.length - 1 || (!assignedSteps.includes(steps[activeStep]?.stepName) && !isAdmin)}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      ) : (
        <Typography>No steps available.</Typography>
      )}
    </Box>
  );
};

export default StepsSummary;
