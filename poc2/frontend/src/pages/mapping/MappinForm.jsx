import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const FormExample = () => {
  const [columnData, setColumnData] = useState([]);
  const [columnNamesForExcel, setColumnNamesForExcel] = useState([]);
  const [formData, setFormData] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [ingestionId, setIngestionId] = useState(null); // State variable to store the ingestion id
  const [username, setUsername] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const columnData = await fetchColumnData();
      await fetchColumnNamesFromExcel(columnData);
      setIngestionId(id);
    };

    fetchData();
  }, [id]);

  // Check if all mandatory fields are filled
  useEffect(() => {
    const mandatoryColumnCount = columnData.filter(
      ({ Type }) => Type === "Mandatory"
    ).length;
    const excelColumnCount = columnNamesForExcel.length;

    if (excelColumnCount === 0) {
      // No columns in the Excel sheet
      setIsFormValid(false);
    } else if (mandatoryColumnCount > excelColumnCount) {
      // More mandatory columns than Excel columns
      if (!alertShown) {
        window.alert("You do not have enough columns to map.");
        setAlertShown(true); // Set the flag to true after showing the alert
      }
      setIsFormValid(false);
    } else {
      // Check if all mandatory fields are filled
      const allMandatoryFieldsFilled = columnData
        .filter(({ Type }) => Type === "Mandatory")
        .every(({ name }) => formData[name] && formData[name] !== "");

      setIsFormValid(allMandatoryFieldsFilled);
    }
  }, [columnData, columnNamesForExcel, formData, alertShown]);

  // Initialize alertShown state

  useEffect(() => {
    if (submissionStatus === "success") {
      window.alert("Mapped data saved successfully!");
    } else if (submissionStatus === "error") {
      window.alert("Failed to save mapped data.");
    }
  }, [submissionStatus]);

  const fetchColumnData = async () => {
    try {
      const response = await axiosInstance.get(
        `${EXCEL_API}/api/getColumnData`
      );
      setColumnData(response.data);
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching column data:", error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchColumnNamesFromExcel = async (columnData) => {
    try {
      const response = await axiosInstance.get(
        `${EXCEL_API}/api/getColumnNamesFromIngestionRecordId/${id}`
      );
      const columnNames = response.data.columnNames;
      setColumnNamesForExcel(columnNames);

      // Auto-map columns where the label name matches the available selection item
      const autoMappedFormData = {};
      columnData.forEach(({ name }) => {
        // Convert both the column name and the excel name to lowercase for comparison
        const lowerCaseName = name.toLowerCase();
        columnNames.forEach((excelName) => {
          if (excelName.toLowerCase() === lowerCaseName) {
            autoMappedFormData[name] = excelName;
          }
        });
      });
      setFormData(autoMappedFormData);

      setUsername(columnNames);
    } catch (error) {
      console.error("Error fetching column names from Excel sheet:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check again if all mandatory fields are filled before submitting
    const allMandatoryFieldsFilled = columnData
      .filter(({ Type }) => Type === "Mandatory")
      .every(({ name }) => formData[name] && formData[name] !== "");

    if (!allMandatoryFieldsFilled) {
      window.alert("Please fill in all mandatory fields.");
      return;
    }

    try {
      // Filter the selected column names from formData
      const selectedColumns = Object.keys(formData).filter(
        (key) => formData[key] !== ""
      );

      // Prepare requestData using selected columns
      const requestData = selectedColumns
        .map((selectedColumnName) => {
          // Find the corresponding columnData entry based on the selected column name in formData
          const matchingColumn = columnData.find(
            (column) => column.name === selectedColumnName
          );

          if (matchingColumn) {
            return {
              IngestionId: parseInt(ingestionId),
              usercolumn: formData[selectedColumnName], // Take the value selected from the dropdown for the current column
              internalcolumn: {
                id: matchingColumn.id, // Use the ID from columnData
                type: matchingColumn.Type,
              },
            };
          } else {
            // Handle the case where the selected column name does not match any column in columnData
            return null;
          }
        })
        .filter((data) => data !== null); // Filter out any null entries

      // // Combine mapped and unmapped columns
      // const combinedRequestData = [...requestData, ...unmappedColumns];
      // Send data to backend
      await axiosInstance.post(`${EXCEL_API}/api/SaveMappingFile`, requestData);

      setSubmissionStatus("success");
      navigate("/ingestionRecords");
      // Log the form data
      //console.log("Form data:", requestData);
    } catch (error) {
      console.error("Error saving mapped data:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "50px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Mapping Form
      </h2>
      <form onSubmit={handleSubmit} style={{}}>
        <div>
          <h3
            style={{ marginLeft: "130px", marginBottom: "10px", color: "grey" }}
          >
            Mandatory Fields
          </h3>
          <p
            style={{
              marginLeft: "130px",
              marginBottom: "20px",
              color: "black",
              fontSize: "13px",
            }}
          >
            Please ensure to fill in all the mandatory fields below.
          </p>
          {columnData.map(
            ({ name, description, Type }) =>
              Type === "Mandatory" && (
                <div key={name} style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      marginTop: "30px",
                      marginLeft: "30px",
                      marginBottom: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "130px",
                        marginRight: "20px",
                        width: "200px",
                        textAlign: "right",
                      }}
                    >
                      <label htmlFor={name}>{name}:</label>
                      <span
                        style={{
                          display: "block",
                          fontSize: "13px",
                          marginTop: "5px",
                        }}
                      >
                        {description}
                      </span>
                    </div>
                    <select
                      id={name}
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      style={{
                        width: "400px",
                        height: "35px",
                        marginLeft: "170px",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select</option>
                      {columnNamesForExcel.length > 0 ? (
                        columnNamesForExcel.map((option) => {
                          const isOptionSelected =
                            Object.values(formData).includes(option);
                          return (
                            <option
                              key={option}
                              value={option}
                              disabled={isOptionSelected}
                            >
                              {option}
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>
                          Loading...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              )
          )}
        </div>
        <div>
          <h3
            style={{
              marginLeft: "130px",
              marginBottom: "10px",
              color: "blue",
            }}
          >
            Optional Fields
          </h3>
          <p
            style={{
              marginLeft: "130px",
              marginBottom: "20px",
              color: "black",
              fontSize: "13px",
            }}
          >
            You may fill in the optional fields below if needed.
          </p>
          {columnData.map(
            ({ name, description, Type }) =>
              Type === "Optional" && (
                <div key={name}>
                  <div
                    style={{
                      marginLeft: "30px",
                      marginBottom: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "130px",
                        marginRight: "20px",
                        width: "200px",
                        textAlign: "right",
                      }}
                    >
                      <label htmlFor={name}>{name}:</label>
                      <span
                        style={{
                          display: "block",
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {description}
                      </span>
                    </div>
                    <select
                      id={name}
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      style={{
                        width: "400px",
                        height: "35px",
                        marginLeft: "170px",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select</option>
                      {columnNamesForExcel.length > 0 ? (
                        columnNamesForExcel.map((option) => {
                          const isOptionSelected =
                            Object.values(formData).includes(option);
                          return (
                            <option
                              key={option}
                              value={option}
                              disabled={isOptionSelected}
                            >
                              {option}
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>
                          Loading...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              )
          )}
        </div>
        <button
          type="submit"
          disabled={!isFormValid} // Disable the button if the form is not valid
          style={{
            padding: "10px 35px",
            marginLeft: "600px",
            borderRadius: "10px",
            background: isFormValid ? "#007bff" : "#cccccc",
            color: isFormValid ? "#fff" : "#999999",
            border: "none",
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormExample;
