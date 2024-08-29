import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { Button }  from '@mui/material';
import { useNavigate } from 'react-router-dom';
const StepsSummary = () => {
  const location = useLocation();
  const { steps } = location.state || { steps: [] }; // Get steps from location state
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/steps")
  }
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Steps Summary
      </Typography>
       <Button onClick={handleBack}>Go Back</Button>
      {steps.length > 0 ? (
        <Stepper activeStep={steps.length}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{`${step.label}: ${step.value}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Typography>No steps provided.</Typography>
      )}
    </Box>
  );
};

export default StepsSummary;
