import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const AuthApi = process.env.REACT_APP_AUTH_API;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!validateEmail(event.target.value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    const passwordValid = validatePassword(event.target.value);
    if (!passwordValid) {
      setPasswordError(
        "Password must be between 8 and 15 characters and contain at least one uppercase letter, one number, and one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 15) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = { email, password };

    try {
      const response = await axios.post(`${AuthApi}/api/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setDialogOpen(true);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "Login Failed";
        alert(errorMessage);
      } else {
        alert("Login failed");
      }
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    const otpData = { email, otp };

    try {
      const response = await axios.post(`${AuthApi}/api/verifyotp`, otpData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { message, token } = response.data;
      console.log("Message:", message);

      if (token) {
        localStorage.setItem("userToken", token);
        navigate("/ingestionRecords");
        window.location.reload();
        setDialogOpen(false);
      } else {
        alert("Token not received. OTP verification failed.");
      }
    } catch (error) {
      if (error.response) {
        alert("OTP verification failed: " + error.response.data.error);
      } else {
        alert("OTP verification failed: " + error.message);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "1rem" }}>Login</Button>
        </form>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="OTP"
            type="text"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={otp}
            onChange={handleOtpChange}
            error={!!otpError}
            helperText={otpError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleOtpSubmit} color="primary">Verify OTP</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginUser;
