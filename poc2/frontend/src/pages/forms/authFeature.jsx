import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const AuthFeature = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [steps, setSteps] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);

  // Fetch organization list on component mount
  useEffect(() => {
    axiosInstance
      .get("http://localhost:9000/api/getAllOrganization")
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  // Fetch users related to the selected organization
  useEffect(() => {
    if (selectedOrg) {
      axiosInstance
        .get(`http://localhost:9000/api/getUserNameByOrgId/${selectedOrg}`)
        .then((response) => {
          setUsers(response.data.userName); // Adjust based on your response structure
        })
        .catch((error) => {
          console.error("Error fetching userName:", error);
          setUsers(""); // Reset users on error
        });
    } else {
      setUsers(""); // Reset users when no organization is selected
    }
  }, [selectedOrg]);

  // Fetch steps related to the selected organization
  useEffect(() => {
    if (selectedOrg) {
      axiosInstance
        .get(`http://localhost:9000/api/getAllSteps/${selectedOrg}`)
        .then((response) => {
          setSteps(response.data); // Ensure steps are correctly set
        })
        .catch((error) => {
          console.error("Error fetching steps:", error);
          setSteps([]); // Reset steps on error
        });
    } else {
      setSteps([]); // Reset steps when no organization is selected
    }
  }, [selectedOrg]);

  // Handle step selection
  const handleStepChange = (stepName) => {
    setSelectedSteps((prevSelectedSteps) =>
      prevSelectedSteps.includes(stepName)
        ? prevSelectedSteps.filter((s) => s !== stepName)
        : [...prevSelectedSteps, stepName]
    );
  };

  // Result submit handler
// Result submit handler
const handleSubmit = () => {
    console.log("Selected Organization ID:", selectedOrg);
    console.log("Selected User:", selectedUser);
    console.log("Selected Steps:", selectedSteps);
  
    // Create a payload object with all the selected data
    const payload = {
      orgId: selectedOrg,
      username: selectedUser,
      steps: selectedSteps,
    };
    console.log("payload elements are:",payload)
    // Example of how you might send this data to your backend
    axiosInstance
      .post("http://localhost:9000/api/submitData", payload)
      .then((response) => {
        console.log("Response from server:", response.data);
        alert("Data submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Failed to submit data. Please try again.");
      });
  };
  

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Auth Feature Page
        </Typography>

        <Grid container spacing={3}>
          {/* Organization Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedOrg && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <MenuItem value={users}>{users}</MenuItem>{" "}
                  {/* Display the userName */}
                </Select>
              </FormControl>
            </Grid>
          )}

          {selectedOrg && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Steps for Organization
              </Typography>
              {steps.length > 0 ? (
                steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Checkbox
                      checked={selectedSteps.includes(step)}
                      onChange={() => handleStepChange(step)}
                    />
                    <ListItemText primary={step} />
                  </Box>
                ))
              ) : (
                <Typography>No steps available</Typography>
              )}
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedSteps.length === 0}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AuthFeature;
