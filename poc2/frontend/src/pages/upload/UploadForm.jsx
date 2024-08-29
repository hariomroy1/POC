import React, { useState } from "react";
import { Button, TextField, Container, Grid } from "@mui/material";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

function FileUploadForm() {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (
      uploadedFile &&
      uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(uploadedFile);
    } else {
      alert("Please upload an Excel file (XLSX format)");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (
      droppedFile &&
      droppedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(droppedFile);
    } else {
      alert("Please drop an Excel file (XLSX format)");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if both username and file are present
    if (!username || !file) {
      alert("Please fill in all details");
      return;
    }

    // Create a FormData object to send data as multipart/form-data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("excelFile", file);

    try {
      // Make a POST request to the backend endpoint
      const response = await axiosInstance.post(`${EXCEL_API}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response from the server
      console.log(response.data);
      alert(response.data.message); // Display a success message
      navigate("/ingestionRecords");
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file"); // Display an error message
    }

    // Reset form fields after submission
    setUsername("");
    setFile(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        marginTop: "1px",
        backgroundImage: `url(${process.env.PUBLIC_URL})`,
        backgroundSize: "cover",
        width: "1700px",
        height: "490px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Grid container spacing={2}>
          <h1
            style={{
              marginTop: "140px",
              marginLeft: "450px",
              textDecorationColor: "GrayText",
              fontFamily: "Roboto, sans-serif",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "navy",
            }}
          >
            FORM DETAILS
          </h1>
          <Grid item lg={7} marginLeft={"240px"} marginTop={"30px"}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              marginLeft="150px"
              value={username}
              onChange={handleUsernameChange}
            />
          </Grid>

          <Grid item lg={1} marginLeft={"240px"} marginTop={"8px"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!file && (
                <>
                  <div
                    style={{
                      border: "2px dashed #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                      flexGrow: 10,
                      position: "relative",
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <p style={{ width: "270px" }}>
                      Drag and drop your <b> Excel file</b> here <br />
                      or click to select a file.
                    </p>
                  </div>
                  <label
                    htmlFor="upload-file"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "40px",
                    }}
                  >
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="upload-file"
                    />
                    <CloudUploadIcon
                      style={{
                        width: "40px",
                        height: "35px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                </>
              )}
              {file && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{file.name}</span>
                  <ClearIcon
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => setFile(null)}
                  />
                </div>
              )}
            </div>
          </Grid>

          {username && file ? (
            <Grid item xs={16}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginLeft: "450px" }}
              >
                Submit
              </Button>
            </Grid>
          ) : (
            <Grid item xs={16}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginLeft: "450px" }}
                disabled
              >
                Submit
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </Container>
  );
}

export default FileUploadForm;
