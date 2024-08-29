import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Steps = () => {
  const [steps, setSteps] = useState([{ label: 'Step 1', value: '' }]); // Default label "Step 1"
  const [currentStep, setCurrentStep] = useState(0); // Track current step
  const navigate = useNavigate();

  // Handle input change for step
  const handleStepChange = (index, event) => {
    const updatedSteps = [...steps];
    updatedSteps[index][event.target.name] = event.target.value;
    setSteps(updatedSteps);
  };

  // Add a new step with default label
  const addStep = () => {
    const newStepLabel = `Step ${steps.length + 1}`;
    setSteps([...steps, { label: newStepLabel, value: '' }]);
  };

  // Handle Next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      addStep(); // Add a new step when the user clicks next and reaches the last step
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit form and navigate to summary page
  const handleSubmit = () => {
    console.log("Form submitted:", steps);
    navigate("/stepSummary", { state: { steps } });
  };

  // Navigation for back and next
  const handleBack = () => {
    navigate("/getAllForms");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Step Form
      </Typography>
      <Button onClick={handleBack}>Go Back</Button>

      {/* Render Current Step */}
      {steps[currentStep] && (
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Step Label"
            name="label"
            value={steps[currentStep].label}
            onChange={(event) => handleStepChange(currentStep, event)}
            fullWidth
            margin="normal"
            disabled // Disable editing of the step label since it's auto-assigned
          />
          <TextField
            label="Step Value"
            name="value"
            value={steps[currentStep].value}
            onChange={(event) => handleStepChange(currentStep, event)}
            fullWidth
            margin="normal"
          />
        </Box>
      )}

      {/* Buttons for Adding Steps and Navigating */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* <Button
          variant="outlined"
          onClick={addStep}
          disabled={steps.length >= 10} // Limiting number of steps (if needed)
        >
          Add Step
        </Button> */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit All Steps
        </Button>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? "Add & Next" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default Steps;
