import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const EditUserDetails = () => {
  const { id } = useParams(); // Extract ID from URL parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dataId = params.get("dataId");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [changes, setChanges] = useState({});
  const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `${EXCEL_API}/api/fetchIngestionDetailsById/${id}/details?dataId=${dataId}`
        );
        const fetchedData = response.data.data;
        console.log("Fetched data: ", fetchedData);

        // Retrieve updated user data from local storage
        const updatedUserData = JSON.parse(
          localStorage.getItem("updatedUserData")
        );
        console.log("Updated user data: ", updatedUserData);

        if (updatedUserData) {
          // Find the updated user data with matching IDs
          const updatedUserObject = updatedUserData.find(
            (obj) => obj.id === fetchedData.id
          );
          console.log("Updated user object: ", updatedUserObject);

          if (updatedUserObject) {
            // Merge the updated user data with the fetched data
            const mergedData = { ...fetchedData, ...updatedUserObject };
            console.log("Merged data: ", mergedData);

            setUserData(mergedData);
          } else {
            // Use the fetched data if no updated data is available for the specific ID
            setUserData(fetchedData);
          }
        } else {
          // Use the fetched data if no updated user data is available
          setUserData(fetchedData);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, dataId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Retrieve existing updated user data array from local storage
      let updatedUserData =
        JSON.parse(localStorage.getItem("updatedUserData")) || [];

      // Check if the record already exists in the array
      const existingIndex = updatedUserData.findIndex(
        (record) => record.id === userData.id
      );

      // If the record already exists, replace it with the updated data
      if (existingIndex !== -1) {
        updatedUserData[existingIndex] = userData;
      } else {
        // If the record doesn't exist, add it to the array
        updatedUserData.push(userData);
      }

      // Store the updated user data array in local storage
      localStorage.setItem("updatedUserData", JSON.stringify(updatedUserData));
      // Redirect or show success message
      navigate(`/FetchUserDetails/${id}`);
    } catch (error) {
      setError("Failed to update user data");
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!userData) return <Typography>User data not found</Typography>;

  return (
    <Paper
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL})`,
        backgroundSize: "cover",
        backgroundColor: "#F0F0F0",
        width: "800px",
        height: "auto",
        marginLeft: "220px",
        marginRight: "220px",
        marginTop: "30px",
        marginBottom: "30px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Edit User Details
        </Typography>
        <Box
          sx={{
            width: "50%",
            minWidth: "300px",
            maxWidth: "600px",
            marginTop: "20px",
          }}
        >
          {Object.keys(userData).map(
            (key) =>
              key !== "id" && (
                <TextField
                  key={key}
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={userData[key]}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              )
          )}
        </Box>
        <Box
          sx={{
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Save Edit
          </Button>

          <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Update Changes?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you want to update changes or Close them?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button onClick={handleSubmit} color="primary" autoFocus>
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditUserDetails;
