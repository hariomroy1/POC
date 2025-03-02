import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import FileUploadForm from "../pages/upload/UploadForm";
import EditMapping from "../pages/mapping/EditMapping.jsx";
import Layout from "../pages/layout/Layout";
import LoginUser from "../pages/authpage/LoginUser";
import IngestionRecords from "../pages/dashboards/IngestionRecords";
import MappingForm from "../pages/mapping/MappinForm";
import FetchUserDetails from "../pages/dashboards/FetchUserDetails";
import EditUserDetails from "../pages/review/EditForm";
import Welcome from "../pages/authpage/Welcome";

const RoutesConfig = ({ userRole }) => {
  console.log("userRole in route", userRole);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LoginUser />} />
        {(userRole === "admin" || userRole === "user" || userRole==="superadmin" || userRole==="other") && (
          <>
            <Route path="/ingestionRecords" element={<IngestionRecords userRole={userRole}  />} />
            <Route path="/mappingForm/:id" element={<MappingForm />} />
            <Route path="/FetchUserDetails/:id" element={<FetchUserDetails />} />
            <Route path="/EditUserDetails/:id/details" element={<EditUserDetails />} />
            <Route path="/EditMapping/:id" element={<EditMapping />} />
           
          </>
        )}
        {userRole === "admin" && (
          <>
            <Route path="/uploadForm" element={<FileUploadForm />} />
          </>
        )}
        <Route path="*" element={<Welcome />} />
      </Route>
    </Routes>
  );
};

export default RoutesConfig;

