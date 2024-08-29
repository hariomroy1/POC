import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

// const IngestionRecords = ({ userRole }) => {
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     // Fetch ingestion records
//     fetchIngestionRecords();
//   }, []);

//   const fetchIngestionRecords = async () => {
//     try {
//       const response = await axiosInstance.get(`/api/fetchIngestionRecords`);
//       setRecords(response.data);
//     } catch (error) {
//       console.error("Error fetching ingestion records:", error.message);
//     }
//   };

//   const handleDeleteRecord = async (id) => {
//     try {
//       await axiosInstance.delete(`/api/deleteIngestionRecord/${id}`);
//       // Refresh the records after deletion
//       fetchIngestionRecords();
//     } catch (error) {
//       console.error("Error deleting ingestion record:", error.message);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//     return(
//       <>
//       <div className="App">
//       <h1>Admin page</h1>
//       </div>
//       </>
//     );
//   // return (
//   //   // <Paper
//   //   //   sx={{ overflowX: "auto" }}
//   //   //   style={{
//   //   //     backgroundImage: `url(${process.env.PUBLIC_URL})`,
//   //   //     backgroundSize: "cover",
//   //   //     backgroundColor: "#F0F0F0",
//   //   //     width: "1080px",
//   //   //     marginLeft: "80px",
//   //   //     marginRight: "70px",
//   //   //     marginTop: "35px",
//   //   //     marginBottom: "30px",
//   //   //     backgroundRepeat: "no-repeat",
//   //   //   }}
//   //   // >
//   //   //   <h2
//   //   //     style={{
//   //   //       display: "flex",
//   //   //       justifyContent: "space-between",
//   //   //       alignItems: "center",
//   //   //     }}
//   //   //   >
//   //   //     <span
//   //   //       style={{ marginLeft: "420px", marginTop: "1px", fontSize: "20px" }}
//   //   //     >
//   //   //       INGESTION RECORDS
//   //   //     </span>
//   //   //     <Link to="/uploadForm">
//   //   //       {userRole === "admin" && (
//   //   //         <Link to="/uploadForm">
//   //   //           <Button
//   //   //             variant="contained"
//   //   //             color="primary"
//   //   //             style={{
//   //   //               marginRight: "20px",
//   //   //               marginTop: "10px",
//   //   //               marginBottom: "15px",
//   //   //               padding: "8px",
//   //   //               fontSize: "15px",
//   //   //             }}
//   //   //           >
//   //   //             Upload here
//   //   //           </Button>
//   //   //         </Link>
//   //   //       )}
//   //   //     </Link>
//   //   //   </h2>

//   //   //   {records.length === 0 ? (
//   //   //     <div
//   //   //       style={{
//   //   //         marginLeft: "530px",
//   //   //         marginTop: "20px",
//   //   //         color: "gray",
//   //   //         fontSize: "18px",
//   //   //         fontStyle: "italic",
//   //   //       }}
//   //   //     >
//   //   //       No records found!
//   //   //     </div>
//   //   //   ) : (
//   //   //     <div>
//   //   //       <Table>
//   //   //         <TableHead style={{ backgroundColor: " #D3D3D3" }}>
//   //   //           <TableRow>
//   //   //             <TableCell>ID</TableCell>
//   //   //             <TableCell>UserName</TableCell>
//   //   //             <TableCell>FileName</TableCell>
//   //   //             <TableCell>Status</TableCell>
//   //   //             <TableCell>
//   //   //               <div style={{ marginLeft: "40px" }}>Actions</div>
//   //   //             </TableCell>
//   //   //           </TableRow>
//   //   //         </TableHead>
//   //   //         <TableBody>
//   //   //           {(rowsPerPage > 0
//   //   //             ? records.slice(
//   //   //                 page * rowsPerPage,
//   //   //                 page * rowsPerPage + rowsPerPage
//   //   //               )
//   //   //             : records
//   //   //           ).map((record) => (
//   //   //             <TableRow key={record.Id}>
//   //   //               <TableCell>{record.Id}</TableCell>
//   //   //               <TableCell>{record.UserName}</TableCell>
//   //   //               <TableCell>{record.FileName}</TableCell>
//   //   //               <TableCell>
//   //   //                 {record.Status === "MAPPING_DONE" &&
//   //   //                   "Please Review and Delete user details."}
//   //   //                 {record.Status === "STORED_IN_TEMP_FOLDER" &&
//   //   //                   "Ready for Mapping Columns."}
//   //   //                 {record.Status === "SUBMITTED" &&
//   //   //                   "The Excel file has been submitted."}
//   //   //               </TableCell>

//   //   //               <TableCell>
//   //   //                 {record.Status === "MAPPING_DONE" ? (
//   //   //                   <Link
//   //   //                     to={`/FetchUserDetails/${record.Id}`}
//   //   //                     style={{ textDecoration: "none" }}
//   //   //                   >
//   //   //                     <Button>
//   //   //                       <PlayArrowIcon />
//   //   //                     </Button>
//   //   //                   </Link>
//   //   //                 ) : record.Status === "SUBMITTED" ? (
//   //   //                   <Link
//   //   //                     to={`/FetchUserDetails/${record.Id}`}
//   //   //                     style={{ textDecoration: "none" }}
//   //   //                     onClick={(e) => e.preventDefault()}
//   //   //                   >
//   //   //                     <Button disabled>
//   //   //                       <PlayArrowIcon />
//   //   //                     </Button>
//   //   //                   </Link>
//   //   //                 ) : (
//   //   //                   <Link
//   //   //                     to={`/mappingForm/${record.Id}`}
//   //   //                     style={{ textDecoration: "none" }}
//   //   //                   >
//   //   //                     <Button>
//   //   //                       <PlayArrowIcon />
//   //   //                     </Button>
//   //   //                   </Link>
//   //   //                 )}
//   //   //                 <Button
//   //   //                   onClick={() => {
//   //   //                     const isConfirmed = window.confirm(
//   //   //                       "Are you sure you want to delete?"
//   //   //                     );
//   //   //                     if (isConfirmed) {
//   //   //                       handleDeleteRecord(record.Id);
//   //   //                     }
//   //   //                   }}
//   //   //                   disabled={record.Status === "SUBMITTED"}
//   //   //                 >
//   //   //                   <DeleteForeverIcon />
//   //   //                 </Button>
//   //   //               </TableCell>
//   //   //             </TableRow>
//   //   //           ))}
//   //   //         </TableBody>
//   //   //       </Table>
//   //   //       <TablePagination
//   //   //         rowsPerPageOptions={[5, 10, 15, 25]}
//   //   //         component="div"
//   //   //         count={records.length}
//   //   //         rowsPerPage={rowsPerPage}
//   //   //         page={page}
//   //   //         onPageChange={handleChangePage}
//   //   //         onRowsPerPageChange={handleChangeRowsPerPage}
//   //   //         style={{ marginTop: "5px" }}
//   //   //       />
//   //   //     </div>
//   //   //   )}
//   //   // </Paper>
//   // );
// };

const IngestionRecords = ({ userRole }) => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch ingestion records
    fetchIngestionRecords();
  }, []);

  const fetchIngestionRecords = async () => {
    try {
      const response = await axiosInstance.get(`/api/fetchIngestionRecords`);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching ingestion records:", error.message);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await axiosInstance.delete(`/api/deleteIngestionRecord/${id}`);
      // Refresh the records after deletion
      fetchIngestionRecords();
    } catch (error) {
      console.error("Error deleting ingestion record:", error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Conditionally render based on userRole
  if (userRole === "admin") {
    return (
      <div className="App">
        <h1>Admin Page</h1>
      </div>
    );
  } else if (userRole === "superadmin") {
    return (
      <div className="App">
        <h1>Super Admin Page</h1>
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>User Page</h1>
      </div>
    );
  }
};


export default IngestionRecords;
