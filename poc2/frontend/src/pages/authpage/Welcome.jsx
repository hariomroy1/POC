import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  
  const handleGoBack = () =>
  {
  navigate("/")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px" }}>
      <h1>You have no access :)</h1>
      <Button onClick={handleGoBack} color="primary" variant="contained" style={{ marginTop: "10px" }}>
        GO Back
      </Button>
    </div>
  );
};

export default Welcome;
