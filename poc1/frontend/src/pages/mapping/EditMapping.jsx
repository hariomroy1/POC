import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const EditMapping = () => {
  const [columnData, setColumnData] = useState([]);
  const [columnNamesForExcel, setColumnNamesForExcel] = useState([]);
  const [formData, setFormData] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [ingestionId, setIngestionId] = useState(null); // State variable to store the ingestion id
  const [username, setUsername] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch existing mapping records for the given ingestion ID
        const response = await axiosInstance.get(
          `${EXCEL_API}/api/fetchMappingColumnRecord/${id}`
        );
        const existingMappings = response.data;

        console.log("existing Mapping: ", existingMappings);
        // Create a mapping object to hold the existing mappings
        const existingMappingsObj = {};
        existingMappings.forEach((mapping) => {
          // Store the existing mapping data in the format { column_name: excel_column }
          existingMappingsObj[mapping.internalcolumn.id] = mapping.usercolumn;
        });

        // Fetch column data and column names from Excel
        const columnDataResponse = await fetchColumnData();
        await fetchColumnNamesFromExcel(
          columnDataResponse,
          existingMappingsObj
        );

        // Set the ingestion ID
        setIngestionId(id);
      } catch (error) {
        console.error("Error fetching mapping records:", error);
      }
    };

    fetchData();
  }, [id]);

  //to check mandatory fields are selected or not
  useEffect(() => {
    const validateForm = () => {
      const allMandatoryFieldsFilled = columnData
        .filter(({ Type }) => Type === "Mandatory")
        .every(({ name }) => formData[name] && formData[name] !== "");
      setIsFormValid(allMandatoryFieldsFilled);
    };

    validateForm();
  }, [formData, columnData]);

  useEffect(() => {
    if (submissionStatus === "success") {
      window.alert("Mapped data saved successfully!");
      navigate(`/FetchUserDetails/${id}`);
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

  // Function to fetch column names from Excel and auto-map them
  const fetchColumnNamesFromExcel = async (columnData, existingMappingsObj) => {
    try {
      const response = await axiosInstance.get(
        `${EXCEL_API}/api/getColumnNamesFromIngestionRecordId/${id}`
      );
      const columnNames = response.data.columnNames;
      setColumnNamesForExcel(columnNames);

      // Auto-map columns where the label name matches the available selection item
      const autoMappedFormData = {};
      columnData.forEach(({ id, name }) => {
        if (existingMappingsObj[id]) {
          autoMappedFormData[name] = existingMappingsObj[id];
        } else {
          // Convert both the column name and the excel name to lowercase for comparison
          const lowerCaseName = name.toLowerCase();
          columnNames.forEach((excelName) => {
            if (excelName.toLowerCase() === lowerCaseName) {
              autoMappedFormData[name] = excelName;
            }
          });
        }
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

      console.log("Data to be sent to backend:", requestData);
      //--------------------------------------------------------------------

      // Send data to backend
      await axiosInstance.post(`${EXCEL_API}/api/SaveMappingFile`, requestData);

      setSubmissionStatus("success");

      // Log the form data
      console.log("Form data:", requestData);
    } catch (error) {
      console.error("Error saving mapped data:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "50px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Edit Mapping Form
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
          disabled={!isFormValid}
          style={{
            padding: "10px 35px",
            marginLeft: "600px",
            borderRadius: "10px",
            background: isFormValid ? "#007bff" : "#cccccc", // Change color when disabled
            color: "#fff",
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

export default EditMapping;
