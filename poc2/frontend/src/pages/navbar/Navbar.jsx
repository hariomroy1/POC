import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = React.useState(true);

  const handleLogout = () => {
    // Implement logout logic here, e.g., remove token from localStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };
  const handlePageChange = () => {
    navigate("/ingestionRecords");
  };

  // Check if the current location is the login page
  const isLoginPage = location.pathname === "/";

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Button
            color="inherit"
            onClick={() => navigate("/ingestionRecords")}
            sx={{ fontSize: "1.2rem" }}
          >
            EXCEL VALIDATOR
          </Button>
        </Box>
        {!isLoginPage && auth && (
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ fontSize: "1.2rem" }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
