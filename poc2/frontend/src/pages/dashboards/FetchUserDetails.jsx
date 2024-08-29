import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axiosInstance from "../../utils/axiosInstance";

const FetchUserDetails = () => {
  const { id } = useParams(); // Extract ID from URL parameters
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMappingConfirmDialog, setOpenMappingConfirmDialog] =
    useState(false);
  const [openConfirmDialogForClose, setOpenConfirmDialogForClose] =
    useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the first API
        const response = await axiosInstance.get(
          `${EXCEL_API}/api/fetchIngestionDetails/${id}?page=${
            page + 1
          }&itemsPerPage=${rowsPerPage}`
        );

        // Fetch data from the second API for mapping columns
        const mappingResponse = await axiosInstance.get(
          `${EXCEL_API}/api/mappingColumns/${id}`
        );

        // Get mapping column data from the response
        const mappingData = mappingResponse.data.data;

        const fetchedData = response.data.data;
        const totalRecords = response.data.totalRecords;
        const totalPages = response.data.totalPages;

        // Dynamically extract keys from the first object in fetchedData
        const keysToCompare = Object.keys(fetchedData[0]);

        // Apply checks and highlight cells based on mapping data
        const newData = fetchedData.map((item) => {
          // Loop through each mapping item
          for (let mappingItem of mappingData) {
            // Check if the mapping item's name is included in the keysToCompare array
            if (
              keysToCompare.includes(mappingItem.UserColumn) &&
              mappingItem.InternalColumnType === "Mandatory"
            ) {
              // Check if the data for the column is missing
              if (!item[mappingItem.UserColumn] && item[mappingItem.UserColumn] !== 0)  {
                // If data is missing, set it as "Missing Data"
                item[mappingItem.UserColumn] = (
                  <span
                    style={{
                      backgroundColor: "orange",
                      padding: "7px",
                      borderRadius: "20px",
                    }}
                  >
                    Missing Data
                  </span>
                );
              }
            }
          }
          return item;
        });

        //now check local storage also
        const updatedRecordsFromLocalStorage = JSON.parse(
          localStorage.getItem("updatedUserData")
        );
        const deletedRecordsFromLocalStorage = JSON.parse(
          localStorage.getItem("DeletedRecords")
        );

        // Check if there are any updated records in local storage
        if (updatedRecordsFromLocalStorage) {
          // Iterate over newData and update records if they exist in updatedUserData
          newData.forEach((newItem, index) => {
            const updatedItemIndex = updatedRecordsFromLocalStorage.findIndex(
              (item) => item.id === newItem.id
            );
            if (updatedItemIndex !== -1) {
              // If the record exists in updatedUserData, update it in newData
              newData[index] = updatedRecordsFromLocalStorage[updatedItemIndex];
            }
          });

          // Re-check for missing data in the updated records from local storage
          newData.forEach((item) => {
            for (let mappingItem of mappingData) {
              if (
                keysToCompare.includes(mappingItem.UserColumn) &&
                mappingItem.InternalColumnType === "Mandatory"
              ) {
                if (!item[mappingItem.UserColumn]) {
                  item[mappingItem.UserColumn] = (
                    <span
                      style={{
                        backgroundColor: "orange",
                        padding: "7px",
                        borderRadius: "20px",
                      }}
                    >
                      Missing Data
                    </span>
                  );
                }
              }
            }
          });
        }

        setData(newData);
        setTotalRecords(totalRecords);
        setTotalPages(totalPages);
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDeleteRecord = async (id) => {
    // Find the index of the item with the given id
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      // Remove the item from the data array
      const updatedData = [...data.slice(0, index), ...data.slice(index + 1)];

      // Update the state to reflect the deletion
      setData(updatedData);

      // Retrieve existing deleted records from local storage
      const existingDeletedRecords = JSON.parse(
        localStorage.getItem("DeletedRecords") || "[]"
      );

      // Add the deleted record to the existingDeletedRecords array
      const deletedRecord = data[index];
      localStorage.setItem(
        "DeletedRecords",
        JSON.stringify([...existingDeletedRecords, deletedRecord])
      );
      alert("Record deleted successfully");
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClose = async () => {
    const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
    const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

    if (!updatedRecords && !deletedRecords) {
      // setMessage("Nothing is available for update.");
      // handleOpenDialog(); // Open the dialog to show the message
      // return;
      alert("No Data is available for Save Changes");
    }
    await handleSaveChanges();
    setOpenConfirmDialog(false);
    alert("Changes saved successfully.");
    navigate("/");
  };

  // Save Edited Record from local storage to backend storage
  const handleSaveChanges = async () => {
    try {
      // Retrieve updated and deleted records from local storage
      const updatedRecords = JSON.parse(
        localStorage.getItem("updatedUserData")
      );
      const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

      if (!updatedRecords && !deletedRecords) {
        alert("No data available for Changes");
      }

      // Check if there are updated records and send to the update API
      if (updatedRecords) {
        await axiosInstance.put(
          `${EXCEL_API}/api/updateIngestionDetailsById/${id}/details?dataId=${0}`,
          updatedRecords
        );

        // Display the updated records
        const recordsArray = Object.keys(updatedRecords).map(
          (key) => updatedRecords[key]
        );
        console.log("Updated Records (Array):", recordsArray);

        // Remove the updated records from local storage
        localStorage.removeItem("updatedUserData");
        alert("Save Changes Successfully");
      } else {
        console.log("No updated records found.");
      }

      // Check if there are deleted records and send to the delete API
      if (deletedRecords) {
        await axiosInstance.delete(
          `${EXCEL_API}/api/deleteUserRecords/${id}/details?dataId=${0}`,
          {
            data: deletedRecords,
          }
        );

        // Display the deleted records
        const deletedRecordsArray = Object.keys(deletedRecords).map(
          (key) => deletedRecords[key]
        );
        console.log("Deleted Records (Array):", deletedRecordsArray);
        alert("Records Deleted Successfully");

        // Remove the deleted records from local storage
        localStorage.removeItem("DeletedRecords");
      } else {
        console.log("No deleted records found.");
      }
    } catch (error) {
      console.error("Error handling save changes:", error);
    }
  };

  //about below button
  const handleEditMapping = async (id) => {
    const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
    const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

    if (updatedRecords || deletedRecords) {
      await handleSaveChanges(); // Call handleSaveChanges if any records are found
    } else {
      navigate(`/EditMapping/${id}`);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      // Send the edited data to the backend, including the id
      const response = await axiosInstance.post(
        `${EXCEL_API}/api/updateUserDetails/${id}`,
        data
      );

      // Handle success
      console.log("Data saved successfully:", response.data);
    } catch (error) {
      // Handle error
      console.error("Error saving data:", error);
    }
  };

  //for submit file in upload folder
  const handleSubmit = async () => {
    const hasMissingData = data.some((item) =>
      Object.values(item).some(
        (value) =>
          React.isValidElement(value) && value.props.children === "Missing Data"
      )
    );

    if (hasMissingData) {
      alert("Please fill the Mandatory details.");
    } else {
      alert("Submitted Successfully");
      handleSaveEdit(id);
      // Navigate or perform additional actions after successful submission
    }
  };

  const handleMapping = () => {
    const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
    const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

    if (!updatedRecords && !deletedRecords) {
      navigate(`/EditMapping/${id}`);
    } else {
      setOpenMappingConfirmDialog(true);
    }
  };

  const handleCloses = () => {
    const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
    const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

    if (!updatedRecords && !deletedRecords) {
      navigate("/ingestionRecords");
    } else {
      setOpenConfirmDialogForClose(true);
    }
  };
  const handleFinalSubmit = () => {
    const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
    const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));
    if (!updatedRecords && !deletedRecords) {
      handleSubmit();
    } else {
      setOpenConfirmDialog(true);
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem("updatedUserData");
    localStorage.removeItem("DeletedRecords");
    navigate(`/EditMapping/${id}`);
  };

  const handleDiscardForClose = () => {
    localStorage.removeItem("updatedUserData");
    localStorage.removeItem("DeletedRecords");
    navigate("/");
  };

  const handleDiscardForSubmitHere = () => {
    localStorage.removeItem("updatedUserData");
    localStorage.removeItem("DeletedRecords");
    window.location.reload();
    handleFinalSubmit();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (data.length === 0) return <Typography>No data available</Typography>;

  const headers = Object.keys(data[0]).filter((header) => header !== "id");

  return (
    // we use fragment here
    <>
      <Paper
        sx={{ overflowX: "auto" }}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL})`,
          backgroundSize: "cover",
          backgroundColor: "#F0F0F0",
          width: "1080px",
          marginLeft: "80px",
          marginRight: "70px",
          marginTop: "35px",
          marginBottom: "30px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginLeft: "420px",
              marginTop: "10px",
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            DATA FROM EXCEL FILE
          </span>
        </h2>

        <TableContainer>
          <Table>
            <TableHead
              style={{ backgroundColor: " #D3D3D3", marginTop: "70px" }}
            >
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    style={{ padding: "8px", borderBottom: "none" }}
                  >
                    {header}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    position: "sticky",
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    padding: "8px",
                  }}
                >
                  <div style={{ marginLeft: "40px" }}>Actions</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      style={{
                        minWidth: "100px",
                        padding: "8px",
                        position: "relative",
                      }}
                    >
                      {item[header]}
                      {item[header]?.props?.children === "Missing Data" && (
                        <span style={{}}></span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      padding: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button>
                        <Link
                          to={`/EditUserDetails/${id}/details?dataId=${index}`}
                          style={{ textDecoration: "none" }}
                        >
                          <EditIcon style={{ color: "blue" }} />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "Are you sure you want to delete?"
                          );
                          if (isConfirmed) {
                            handleDeleteRecord(item.id);
                          }
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count, page }) =>
            `Page ${page + 1} of ${totalPages}`
          }
          nextIconButtonProps={{
            disabled: page >= totalPages - 1,
          }}
          backIconButtonProps={{
            disabled: page === 0,
          }}
        />
      </Paper>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "3px 150px 15px 150px",
        }}
      >
        <Box>
          <Button
            variant="contained"
            color="primary"
            style={{
              padding: "8px",
              fontSize: "15px",
              borderRadius: "10px",
              width: "150px",
            }}
            onClick={handleMapping}
          >
            Edit Mapping
          </Button>

          <Dialog
            open={openMappingConfirmDialog}
            onClose={() => setOpenMappingConfirmDialog(false)}
          >
            <DialogTitle>Save Changes?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you want to save changes before navigating to the edit page?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMappingConfirmDialog(false)}>
                Close
              </Button>
              <Button onClick={handleDiscard}>Discard</Button>
              <Button
                onClick={async () => {
                  const updatedRecords = JSON.parse(
                    localStorage.getItem("updatedUserData")
                  );
                  const deletedRecords = JSON.parse(
                    localStorage.getItem("DeletedRecords")
                  );

                  if (!updatedRecords && !deletedRecords) {
                    setMessage("Nothing is available for update.");
                    handleOpenDialog(); // Open the dialog to show the message
                    return;
                  }
                  await handleSaveChanges();
                  setOpenMappingConfirmDialog(false);
                  navigate(`/EditMapping/${id}`);
                }}
                autoFocus
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            style={{
              padding: "8px",
              fontSize: "15px",
              borderRadius: "10px",
              width: "150px",
            }}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>

        <Box>
          <Button
            onClick={handleFinalSubmit}
            variant="contained"
            color="primary"
            style={{
              padding: "8px",
              fontSize: "15px",
              borderRadius: "10px",
              width: "150px",
            }}
          >
            Submit here
          </Button>
          <Dialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
          >
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you want to save changes before submitting?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmDialog(false)}>Close</Button>
              <Button
                onClick={() => {
                  handleDiscardForSubmitHere();
                  setOpenConfirmDialog(false);
                }}
              >
                Discard
              </Button>
              <Button
                onClick={async () => {
                  const updatedRecords = JSON.parse(
                    localStorage.getItem("updatedUserData")
                  );
                  const deletedRecords = JSON.parse(
                    localStorage.getItem("DeletedRecords")
                  );

                  if (!updatedRecords && !deletedRecords) {
                    setMessage("Nothing is available for update.");
                    handleOpenDialog(); // Open the dialog to show the message
                    return;
                  }
                  await handleSaveChanges();
                  setOpenConfirmDialog(false);
                  handleFinalSubmit();
                }}
                autoFocus
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            style={{
              padding: "8px",
              fontSize: "15px",
              borderRadius: "10px",
              width: "150px",
            }}
            onClick={handleCloses}
          >
            Close
          </Button>
          <Dialog
            open={openConfirmDialogForClose}
            onClose={() => setOpenConfirmDialogForClose(false)}
          >
            <DialogTitle>Save Changes?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you want to save changes before navigating to the Home page?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmDialogForClose(false)}>
                Close
              </Button>
              <Button onClick={handleDiscardForClose}>Discard</Button>
              <Button
                onClick={async () => {
                  const updatedRecords = JSON.parse(
                    localStorage.getItem("updatedUserData")
                  );
                  const deletedRecords = JSON.parse(
                    localStorage.getItem("DeletedRecords")
                  );

                  if (!updatedRecords && !deletedRecords) {
                    setMessage("Nothing is available for update.");
                    handleOpenDialog(); // Open the dialog to show the message
                    return;
                  }
                  await handleSaveChanges();
                  setOpenConfirmDialogForClose(false);
                  navigate("/");
                }}
                autoFocus
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </>
  );
};

export default FetchUserDetails;

//-----------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   CircularProgress,
//   Typography,
//   TablePagination,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// const FetchUserDetails = () => {
//   const { id } = useParams(); // Extract ID from URL parameters
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openCloseDialog, setOpenCloseDialog] = useState(false);
//   const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openMappingConfirmDialog, setOpenMappingConfirmDialog] =
//     useState(false);
//   const [openConfirmDialogForClose, setOpenConfirmDialogForClose] =
//     useState(false);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [headerNames, setHeaderNames] = useState([]);
//   const [headerTypes, setHeaderTypes] = useState([]);

//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [headersName, setHeadersName] = useState([]);
//   const [internalColumnData, setInternalColumnData] = useState([]);

//   const EXCEL_API = process.env.REACT_APP_EXCEL_API_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch data from the first API
//         const response = await axios.get(
//           `${EXCEL_API}/api/fetchIngestionDetails/${id}?page=${
//             page + 1
//           }&itemsPerPage=${rowsPerPage}`
//         );

//         // Fetch data from the second API for mapping columns
//         const mappingResponse = await axios.get(
//           `${EXCEL_API}/api/mappingColumns/${id}`
//         );

//         // Get mapping column data from the response
//         const mappingData = mappingResponse.data.data;

//         const fetchedData = response.data.data;
//         const totalRecords = response.data.totalRecords;
//         const totalPages = response.data.totalPages;

//         // Dynamically extract keys from the first object in fetchedData
//         const keysToCompare = Object.keys(fetchedData[0]);

//         // Apply checks and highlight cells based on mapping data
//         const newData = fetchedData.map((item) => {
//           // Loop through each mapping item
//           for (let mappingItem of mappingData) {
//             // Check if the mapping item's name is included in the keysToCompare array
//             if (
//               keysToCompare.includes(mappingItem.UserColumn) &&
//               mappingItem.InternalColumnType === "Mandatory"
//             ) {
//               // Check if the data for the column is missing
//               if (!item[mappingItem.UserColumn]) {
//                 // If data is missing, set it as "Missing Data"
//                 item[mappingItem.UserColumn] = (
//                   <span
//                     style={{
//                       backgroundColor: "orange",
//                       padding: "7px",
//                       borderRadius: "20px",
//                     }}
//                   >
//                     Missing Data
//                   </span>
//                 );
//               }
//             }
//           }
//           return item;
//         });

//         //now check local storage also
//         const updatedRecordsFromLocalStorage = JSON.parse(
//           localStorage.getItem("updatedUserData")
//         );
//         const deletedRecordsFromLocalStorage = JSON.parse(
//           localStorage.getItem("DeletedRecords")
//         );

//         // Check if there are any updated records in local storage
//         if (updatedRecordsFromLocalStorage) {
//           // Iterate over newData and update records if they exist in updatedUserData
//           newData.forEach((newItem, index) => {
//             const updatedItemIndex = updatedRecordsFromLocalStorage.findIndex(
//               (item) => item.id === newItem.id
//             );
//             if (updatedItemIndex !== -1) {
//               // If the record exists in updatedUserData, update it in newData
//               newData[index] = updatedRecordsFromLocalStorage[updatedItemIndex];
//             }
//           });

//           // Re-check for missing data in the updated records from local storage
//           newData.forEach((item) => {
//             for (let mappingItem of mappingData) {
//               if (
//                 keysToCompare.includes(mappingItem.UserColumn) &&
//                 mappingItem.InternalColumnType === "Mandatory"
//               ) {
//                 if (!item[mappingItem.UserColumn]) {
//                   item[mappingItem.UserColumn] = (
//                     <span
//                       style={{
//                         backgroundColor: "orange",
//                         padding: "7px",
//                         borderRadius: "20px",
//                       }}
//                     >
//                       Missing Data
//                     </span>
//                   );
//                 }
//               }
//             }
//           });
//         }

//         setData(newData);
//         setTotalRecords(totalRecords);
//         setTotalPages(totalPages);
//       } catch (error) {
//         setError("Error fetching data");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, page, rowsPerPage]);

//   // for fetching internal column name
//   useEffect(() => {
//     const fetchInternalColumnDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${EXCEL_API}/api/InternalColumnHeader`
//         );
//         console.log("Response: ", response.data);
//         const headerType = response.data.map((headerType) => headerType.type);
//         console.log("Header type: ", headerType);
//         const headerNames = response.data.map((header) => header.name);
//         setHeaderNames(headerNames); // Set headerNames state
//         setHeaderTypes(headerType); // Set headerTypes state
  
//         const internalColumnResponses = [];
  
//         for (const header of response.data) {
//           const internalColumnId = header.id;
//           const internalColumnResponse = await axios.get(
//             `${EXCEL_API}/api/fetchInternalColumnNames/${id}?InternalColumnId=${internalColumnId}`
//           );
  
//           internalColumnResponses.push(internalColumnResponse.data);
//         }
  
//         // Check if there are any updated records in local storage
//         const updatedRecordsFromLocalStorage = JSON.parse(
//           localStorage.getItem("updatedUserData")
//         );
  
//         if (updatedRecordsFromLocalStorage) {
//           // Update internal column details based on updated records from local storage
//           internalColumnResponses.forEach((columnData) => {
//             // Ensure columnData is an array before using forEach
//             if (Array.isArray(columnData)) {
//               columnData.forEach((item, index) => {
//                 const updatedItemIndex = updatedRecordsFromLocalStorage.findIndex(
//                   (updatedItem) => updatedItem.id === item.id
//                 );
//                 if (updatedItemIndex !== -1) {
//                   columnData[index] = updatedRecordsFromLocalStorage[
//                     updatedItemIndex
//                   ];
//                 }
//               });
//             }
//           });
  
//           // Re-check for missing data in the updated records
//           internalColumnResponses.forEach((columnData) => {
//             // Ensure columnData is an array before using forEach
//             if (Array.isArray(columnData)) {
//               columnData.forEach((item, index) => {
//                 const typeOfHeader = headerType[index];
//                 const headerName = headerNames[index];
//                 if (typeOfHeader === "Mandatory" && !item[headerName]) {
//                   item[headerName] = (
//                     <span
//                       style={{
//                         backgroundColor: "orange",
//                         padding: "7px",
//                         borderRadius: "20px",
//                       }}
//                     >
//                       Missing Data
//                     </span>
//                   );
//                 }
//               });
//             }
//           });
//         }
  
//         setInternalColumnData(internalColumnResponses);
//       } catch (error) {
//         console.error("Error fetching internal column details:", error);
//         setError("Error fetching internal column details");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchInternalColumnDetails();
//   }, [id]);
  

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredData = data.filter((item) =>
//     Object.values(item).some((value) =>
//       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleOpenDialog = () => {
//     setOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//   };

//   const handleDeleteRecord = async (id) => {
//     // Find the index of the item with the given id
//     const index = data.findIndex((item) => item.id === id);

//     if (index !== -1) {
//       // Remove the item from the data array
//       const updatedData = [...data.slice(0, index), ...data.slice(index + 1)];

//       // Update the state to reflect the deletion
//       setData(updatedData);

//       // Retrieve existing deleted records from local storage
//       const existingDeletedRecords = JSON.parse(
//         localStorage.getItem("DeletedRecords") || "[]"
//       );

//       // Add the deleted record to the existingDeletedRecords array
//       const deletedRecord = data[index];
//       localStorage.setItem(
//         "DeletedRecords",
//         JSON.stringify([...existingDeletedRecords, deletedRecord])
//       );
//       alert("Record deleted successfully");
//     }
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const handleClose = async () => {
//     const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
//     const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

//     if (!updatedRecords && !deletedRecords) {
//       // setMessage("Nothing is available for update.");
//       // handleOpenDialog(); // Open the dialog to show the message
//       // return;
//       alert("No Data is available for Save Changes");
//     }
//     await handleSaveChanges();
//     setOpenConfirmDialog(false);
//     alert("Changes saved successfully.");
//     navigate("/");
//   };

//   // Save Edited Record from local storage to backend storage
//   const handleSaveChanges = async () => {
//     try {
//       // Retrieve updated and deleted records from local storage
//       const updatedRecords = JSON.parse(
//         localStorage.getItem("updatedUserData")
//       );
//       const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

//       if (!updatedRecords && !deletedRecords) {
//         alert("No data available for Changes");
//       }

//       // Check if there are updated records and send to the update API
//       if (updatedRecords) {
//         await axios.put(
//           `${EXCEL_API}/api/updateIngestionDetailsById/${id}/details?dataId=${0}`,
//           updatedRecords
//         );

//         // Display the updated records
//         const recordsArray = Object.keys(updatedRecords).map(
//           (key) => updatedRecords[key]
//         );
//         console.log("Updated Records (Array):", recordsArray);

//         // Remove the updated records from local storage
//         localStorage.removeItem("updatedUserData");
//         alert("Save Changes Successfully");
//       } else {
//         console.log("No updated records found.");
//       }

//       // Check if there are deleted records and send to the delete API
//       if (deletedRecords) {
//         await axios.delete(
//           `${EXCEL_API}/api/deleteUserRecords/${id}/details?dataId=${0}`,
//           {
//             data: deletedRecords,
//           }
//         );

//         // Display the deleted records
//         const deletedRecordsArray = Object.keys(deletedRecords).map(
//           (key) => deletedRecords[key]
//         );
//         console.log("Deleted Records (Array):", deletedRecordsArray);
//         alert("Records Deleted Successfully");

//         // Remove the deleted records from local storage
//         localStorage.removeItem("DeletedRecords");
//       } else {
//         console.log("No deleted records found.");
//       }
//     } catch (error) {
//       console.error("Error handling save changes:", error);
//     }
//   };

//   //about below button
//   const handleEditMapping = async (id) => {
//     const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
//     const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

//     if (updatedRecords || deletedRecords) {
//       await handleSaveChanges(); // Call handleSaveChanges if any records are found
//     } else {
//       navigate(`/EditMapping/${id}`);
//     }
//   };

//   const handleSaveEdit = async (id) => {
//     try {
//       // Send the edited data to the backend, including the id
//       const response = await axios.post(
//         `${EXCEL_API}/api/updateUserDetails/${id}`,
//         data
//       );

//       // Handle success
//       console.log("Data saved successfully:", response.data);
//     } catch (error) {
//       // Handle error
//       console.error("Error saving data:", error);
//     }
//   };

//   //for submit file in upload folder
//   const handleSubmit = async () => {
//     const hasMissingData = data.some((item) =>
//       Object.values(item).some(
//         (value) =>
//           React.isValidElement(value) && value.props.children === "Missing Data"
//       )
//     );

//     if (hasMissingData) {
//       alert("Please fill the Mandatory details.");
//     } else {
//       alert("Submitted Successfully");
//       handleSaveEdit(id);
//       // Navigate or perform additional actions after successful submission
//     }
//   };

//   const handleMapping = () => {
//     const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
//     const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

//     if (!updatedRecords && !deletedRecords) {
//       navigate(`/EditMapping/${id}`);
//     } else {
//       setOpenMappingConfirmDialog(true);
//     }
//   };

//   const handleCloses = () => {
//     const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
//     const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));

//     if (!updatedRecords && !deletedRecords) {
//       navigate("/");
//     } else {
//       setOpenConfirmDialogForClose(true);
//     }
//   };
//   const handleFinalSubmit = () => {
//     const updatedRecords = JSON.parse(localStorage.getItem("updatedUserData"));
//     const deletedRecords = JSON.parse(localStorage.getItem("DeletedRecords"));
//     if (!updatedRecords && !deletedRecords) {
//       handleSubmit();
//     } else {
//       setOpenConfirmDialog(true);
//     }
//   };

//   const handleDiscard = () => {
//     localStorage.removeItem("updatedUserData");
//     localStorage.removeItem("DeletedRecords");
//     navigate(`/EditMapping/${id}`);
//   };

//   const handleDiscardForClose = () => {
//     localStorage.removeItem("updatedUserData");
//     localStorage.removeItem("DeletedRecords");
//     navigate("/");
//   };

//   const handleDiscardForSubmitHere = () => {
//     localStorage.removeItem("updatedUserData");
//     localStorage.removeItem("DeletedRecords");
//     handleFinalSubmit();
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (data.length === 0) return <Typography>No data available</Typography>;

//   //const headers = Object.keys(data[0]).filter((header) => header !== "id");

//   return (
//     // we use fragment here
//     <>
//       <Paper
//         sx={{ overflowX: "auto" }}
//         style={{
//           backgroundImage: `url(${process.env.PUBLIC_URL})`,
//           backgroundSize: "cover",
//           backgroundColor: "#F0F0F0",
//           width: "1080px",
//           marginLeft: "80px",
//           marginRight: "70px",
//           marginTop: "35px",
//           marginBottom: "30px",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <h2
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <span
//             style={{
//               marginLeft: "420px",
//               marginTop: "10px",
//               fontSize: "20px",
//               marginBottom: "10px",
//             }}
//           >
//             DATA FROM EXCEL FILE
//           </span>
//         </h2>

//         <TableContainer>
//           <Table>
//             <TableHead
//               style={{ backgroundColor: " #D3D3D3", marginTop: "70px" }}
//             >
//               <TableRow style={{ padding: "8px", borderBottom: "none" }}>
//                 {headerNames.map((headerName) => (
//                   <TableCell
//                     key={headerName}
//                     style={{
//                       minWidth: "100px",
//                       padding: "8px",
//                       position: "relative",
//                     }}
//                   >
//                     {headerName}
//                   </TableCell>
//                 ))}
//                 <TableCell
//                   style={{
//                     minWidth: "100px",
//                     padding: "8px",
//                     position: "relative",
//                   }}
//                 >
//                   <div style={{ marginLeft: "40px" }}>Actions</div>
//                 </TableCell>{" "}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {internalColumnData.length > 0 &&
//                 internalColumnData[0].userDetails.map((_, rowIndex) => {
//                   const rowData = {};
//                   headerNames.forEach((headerName, headerIndex) => {
//                     const cellData =
//                       internalColumnData[headerIndex] &&
//                       internalColumnData[headerIndex].userDetails[rowIndex];
//                     rowData[headerName] = cellData;
//                   });

//                   return (
//                     <TableRow key={rowIndex}>
//                       {headerNames.map((headerName, headerIndex) => {
//                         const typeOfHeader = headerTypes[headerIndex];
//                         const cellData = rowData[headerName];

//                         return (
//                           <TableCell key={`${headerName}-${rowIndex}`}>
//                             {/* Check if headerType is "Mandatory" and cellData is empty */}
//                             {typeOfHeader === "Mandatory" && !cellData ? (
//                               <Typography
//                                 variant="body1"
//                                 color="error"
//                                 style={{
//                                   backgroundColor: "orange",
//                                   borderRadius: "15px",
//                                   padding: "8px",
//                                 }}
//                               >
//                                 Missing Data
//                               </Typography>
//                             ) : (
//                               cellData || ""
//                             )}
//                           </TableCell>
//                         );
//                       })}
//                       <TableCell
//                         sx={{
//                           position: "sticky",
//                           right: 0,
//                           backgroundColor: "white",
//                           zIndex: 1,
//                           padding: "8px",
//                         }}
//                       >
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           <Button>
//                             <Link
//                               to={`/EditUserDetails/${id}/details?dataId=${rowIndex}`}
//                             >
//                               <EditIcon />
//                             </Link>
//                           </Button>
//                           <Button onClick={() => handleDeleteRecord(rowIndex)}>
//                             <DeleteForeverIcon />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 15, 20]}
//           component="div"
//           count={totalRecords}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           labelDisplayedRows={({ from, to, count, page }) =>
//             `Page ${page + 1} of ${totalPages}`
//           }
//           nextIconButtonProps={{
//             disabled: page >= totalPages - 1,
//           }}
//           backIconButtonProps={{
//             disabled: page === 0,
//           }}
//         />
//       </Paper>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "3px 150px 15px 150px",
//         }}
//       >
//         <Box>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{
//               padding: "8px",
//               fontSize: "15px",
//               borderRadius: "10px",
//               width: "150px",
//             }}
//             onClick={handleMapping}
//           >
//             Edit Mapping
//           </Button>

//           <Dialog
//             open={openMappingConfirmDialog}
//             onClose={() => setOpenMappingConfirmDialog(false)}
//           >
//             <DialogTitle>Save Changes?</DialogTitle>
//             <DialogContent>
//               <DialogContentText>
//                 Do you want to save changes before navigating to the edit page?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenMappingConfirmDialog(false)}>
//                 Close
//               </Button>
//               <Button onClick={handleDiscard}>Discard</Button>
//               <Button
//                 onClick={async () => {
//                   const updatedRecords = JSON.parse(
//                     localStorage.getItem("updatedUserData")
//                   );
//                   const deletedRecords = JSON.parse(
//                     localStorage.getItem("DeletedRecords")
//                   );

//                   if (!updatedRecords && !deletedRecords) {
//                     setMessage("Nothing is available for update.");
//                     handleOpenDialog(); // Open the dialog to show the message
//                     return;
//                   }
//                   await handleSaveChanges();
//                   setOpenMappingConfirmDialog(false);
//                   navigate(`/EditMapping/${id}`);
//                 }}
//                 autoFocus
//               >
//                 Save Changes
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>

//         <Box>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{
//               padding: "8px",
//               fontSize: "15px",
//               borderRadius: "10px",
//               width: "150px",
//             }}
//             onClick={handleSaveChanges}
//           >
//             Save Changes
//           </Button>
//         </Box>

//         <Box>
//           <Button
//             onClick={handleFinalSubmit}
//             variant="contained"
//             color="primary"
//             style={{
//               padding: "8px",
//               fontSize: "15px",
//               borderRadius: "10px",
//               width: "150px",
//             }}
//           >
//             Submit here
//           </Button>
//           <Dialog
//             open={openConfirmDialog}
//             onClose={() => setOpenConfirmDialog(false)}
//           >
//             <DialogTitle>Confirm Submission</DialogTitle>
//             <DialogContent>
//               <DialogContentText>
//                 Do you want to save changes before submitting?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenConfirmDialog(false)}>Close</Button>
//               <Button
//                 onClick={() => {
//                   handleDiscardForSubmitHere();
//                   setOpenConfirmDialog(false);
//                 }}
//               >
//                 Discard
//               </Button>
//               <Button
//                 onClick={async () => {
//                   const updatedRecords = JSON.parse(
//                     localStorage.getItem("updatedUserData")
//                   );
//                   const deletedRecords = JSON.parse(
//                     localStorage.getItem("DeletedRecords")
//                   );

//                   if (!updatedRecords && !deletedRecords) {
//                     setMessage("Nothing is available for update.");
//                     handleOpenDialog(); // Open the dialog to show the message
//                     return;
//                   }
//                   await handleSaveChanges();
//                   setOpenConfirmDialog(false);
//                   handleFinalSubmit();
//                 }}
//                 autoFocus
//               >
//                 Save Changes
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>

//         <Box>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{
//               padding: "8px",
//               fontSize: "15px",
//               borderRadius: "10px",
//               width: "150px",
//             }}
//             onClick={handleCloses}
//           >
//             Close
//           </Button>
//           <Dialog
//             open={openConfirmDialogForClose}
//             onClose={() => setOpenConfirmDialogForClose(false)}
//           >
//             <DialogTitle>Save Changes?</DialogTitle>
//             <DialogContent>
//               <DialogContentText>
//                 Do you want to save changes before navigating to the Home page?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenConfirmDialogForClose(false)}>
//                 Close
//               </Button>
//               <Button onClick={handleDiscardForClose}>Discard</Button>
//               <Button
//                 onClick={async () => {
//                   const updatedRecords = JSON.parse(
//                     localStorage.getItem("updatedUserData")
//                   );
//                   const deletedRecords = JSON.parse(
//                     localStorage.getItem("DeletedRecords")
//                   );

//                   if (!updatedRecords && !deletedRecords) {
//                     setMessage("Nothing is available for update.");
//                     handleOpenDialog(); // Open the dialog to show the message
//                     return;
//                   }
//                   await handleSaveChanges();
//                   setOpenConfirmDialogForClose(false);
//                   navigate("/");
//                 }}
//                 autoFocus
//               >
//                 Save Changes
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </div>
//     </>
//   );
// };

// export default FetchUserDetails;
