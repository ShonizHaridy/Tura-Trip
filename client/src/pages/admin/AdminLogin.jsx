import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import loginImage from "../../assets/login.png";
import forgotPasswordImage from "../../assets/3d-render-secure-password-warning-personal-data 2.png";
import resetPasswordImage from "../../assets/hand-point-form-with-password-red-padlock 2.png";
import successImage from "../../assets/resetsuccess.png";

import { useAuth } from "../../contexts/AuthContext";


const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [currentState, setCurrentState] = useState("login"); // login, forgot, reset, success
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
    email: "",
    idNumber: "",
    adminCode: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const result = await login({
          admin_id: formData.adminId, // Fixed: use adminId from form
          password: formData.password,
        });

        if (result.success) {
          // Redirect to the page they were trying to visit or dashboard
          const from = location.state?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
        } else {
          setError(result.message || 'Login failed');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred during login');
      } finally {
        setLoading(false);
      }
    };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (formData.adminCode && formData.email && formData.idNumber) {
      setLoading(true);
      setError("");
      
      try {
        const response = await adminService.forgotPassword({
          admin_code: formData.adminCode,
          email: formData.email,
          id_number: formData.idNumber,
        });

        if (response.success) {
          setCurrentState("reset");
          setError("");
        } else {
          setError(response.message || 'Failed to send reset code');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  // FIXED: Added backend integration for reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (
      formData.verificationCode &&
      formData.newPassword &&
      formData.confirmPassword
    ) {
      if (formData.newPassword === formData.confirmPassword) {
        if (formData.newPassword.length < 8) {
          setError("Password must be at least 8 characters long.");
          return;
        }

        setLoading(true);
        setError("");

        try {
          const response = await adminService.resetPassword({
            admin_code: formData.adminCode,
            email: formData.email,
            id_number: formData.idNumber,
            verification_code: formData.verificationCode,
            new_password: formData.newPassword,
          });

          if (response.success) {
            setCurrentState("success");
            setError("");
          } else {
            setError(response.message || 'Failed to reset password');
          }
        } catch (error) {
          setError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setError("Passwords do not match.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleBackToLogin = () => {
    setCurrentState("login");
    setError("");
    setFormData({
      adminId: "",
      password: "",
      email: "",
      idNumber: "",
      adminCode: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getProgressIndicators = () => {
    switch (currentState) {
      case "login":
        return (
          <div className="flex items-center gap-[11px]">
            <div className="h-[5px] w-12 bg-white rounded"></div>
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
          </div>
        );
      case "forgot":
        return (
          <div className="flex items-center gap-[11px]">
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
            <div className="h-[5px] w-12 bg-white rounded"></div>
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
          </div>
        );
      case "reset":
      case "success":
        return (
          <div className="flex items-center gap-[11px]">
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
            <div className="h-0.5 w-8 bg-[#9E9E9E] rounded"></div>
            <div className="h-[5px] w-12 bg-white rounded"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getCurrentImage = () => {
    switch (currentState) {
      case "login":
        return loginImage;
      case "forgot":
        return forgotPasswordImage;
      case "reset":
        return resetPasswordImage;
      case "success":
        return successImage;
      default:
        return loginImage;
    }
  };

  const getWelcomeText = () => {
    switch (currentState) {
      case "login":
        return {
          title: "Welcome to Tura Trip Admin Panel",
          subtitle:
            "Please log in to update content, manage bookings, and create memorable experiences for travelers from around the world. Access your dashboard to make Egypt's treasures shine!",
        };
      case "forgot":
        return {
          title: "Forgot Your Password?",
          subtitle:
            "Don't worry! Please enter your admin code, email, and ID number to reset your password. We'll help you get back to managing Egypt's amazing travel experiences.",
        };
      case "reset":
        return {
          title: "Set New Password",
          subtitle:
            "Enter the verification code sent to your email and create a new secure password. You're almost ready to get back to creating amazing travel experiences!",
        };
      case "success":
        return {
          title: "Password Reset Successful!",
          subtitle:
            "Great! Your password has been successfully reset. You can now log in with your new password and continue managing Egypt's incredible travel destinations.",
        };
      default:
        return {
          title: "Welcome to Tura Trip Admin Panel",
          subtitle:
            "Please log in to update content, manage bookings, and create memorable experiences for travelers from around the world. Access your dashboard to make Egypt's treasures shine!",
        };
    }
  };

  // Helper function to check if password is valid (for green styling)
  const isPasswordValid = (password) => {
    return password && password.length >= 8; // Simple validation
  };

const renderLoginForm = () => (
  <form
    onSubmit={handleLogin}
    className="flex flex-col items-start gap-4 self-stretch"
  >
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm w-full">
        {error}
      </div>
    )}

    {/* Admin ID Field */}
    <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
      <label
        className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
        style={{
          fontFamily:
            "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
        }}
      >
        Admin ID
      </label>
      <div
        className={`flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border ${error ? "border-red-300 bg-red-50" : "border-[#E8E7EA] bg-white"}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex w-6 h-6 justify-center items-center flex-shrink-0"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="#8A8D95"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22"
            stroke="#8A8D95"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          name="adminId"
          value={formData.adminId}
          onChange={handleChange}
          placeholder="Enter Your ID"
          className="flex-1 text-[#8A8D95] text-base font-normal leading-normal border-none outline-none bg-transparent"
          style={{
            fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
          }}
          required
          disabled={loading}
        />
      </div>
    </div>

    {/* Password Field */}
    <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
      <label
        className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
        style={{
          fontFamily:
            "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
        }}
      >
        Password
      </label>
      <div
        className={`flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border ${
          error 
            ? "border-[#E81E1E] bg-white" 
            : "border-[#E8E7EA] bg-white"
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex w-6 h-6 justify-center items-center flex-shrink-0"
        >
          <path
            d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
            stroke="#8A8D95"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
            stroke="#8A8D95"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
            stroke="#B6B5BF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="●●●●●●●●●"
          className={`flex-1 text-base font-medium leading-normal border-none outline-none bg-transparent ${
            error ? "text-[#E81E1E]" : "text-[#B6B5BF]"
          }`}
          style={{
            fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
          }}
          required
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="flex w-6 h-6 justify-center items-center flex-shrink-0"
          disabled={loading}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
              stroke="#222E50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9998 20.2702C15.5298 20.2702 18.8198 18.1902 21.1098 14.5902C22.0098 13.1802 22.0098 10.8102 21.1098 9.40021C18.8198 5.80021 15.5298 3.72021 11.9998 3.72021C8.46984 3.72021 5.17984 5.80021 2.88984 9.40021C1.98984 10.8102 1.98984 13.1802 2.88984 14.5902C5.17984 18.1902 8.46984 20.2702 11.9998 20.2702Z"
              stroke="#222E50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <button
        type="button"
        onClick={() => setCurrentState("forgot")}
        className="self-stretch text-[#555A64] text-base font-normal leading-normal cursor-pointer hover:text-[#222E50] transition-colors text-left"
        style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
        disabled={loading}
      >
        Forgot Password?
      </button>
    </div>

    {/* Login Button */}
    <button
      type="submit"
      disabled={loading}
      className={`flex p-[14px_24px] justify-center items-center self-stretch rounded-md transition-colors cursor-pointer ${
        loading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-[#1F7674] hover:bg-[#1a6562]"
      }`}
    >
      <span
        className="text-[#EAF6F6] text-xl lg:text-[24px] font-bold leading-normal"
        style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
      >
        {loading ? "Logging in..." : "Log in"}
      </span>
    </button>
  </form>
);

  const renderForgotPasswordForm = () => (
    <form
      onSubmit={handleForgotPassword}
      className="flex flex-col items-start gap-4 self-stretch"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm w-full">
          {error}
        </div>
      )}

      {/* Admin Code Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Admin Code
        </label>
        <div className="flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border border-[#E8E7EA] bg-white">
          <input
            type="text"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleChange}
            placeholder="Enter Admin Code"
            className="flex-1 text-[#8A8D95] text-base font-normal leading-normal border-none outline-none bg-transparent"
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Email
        </label>
        <div className="flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border border-[#E8E7EA] bg-white">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
            className="flex-1 text-[#8A8D95] text-base font-normal leading-normal border-none outline-none bg-transparent"
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
        </div>
      </div>

      {/* ID Number Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          ID Number
        </label>
        <div className="flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border border-[#E8E7EA] bg-white">
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="Enter Your ID Number"
            className="flex-1 text-[#8A8D95] text-base font-normal leading-normal border-none outline-none bg-transparent"
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
        </div>
      </div>

      {/* Blue Info Text */}
      <p className="text-[#065DFF] text-base text-center w-full" style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}>
        Verification Code will be sent to your email
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="flex p-[14px_24px] justify-center items-center self-stretch rounded-md bg-[#1F7674] hover:bg-[#1a6562] transition-colors"
      >
        <span
          className="text-[#EAF6F6] text-xl lg:text-[24px] font-bold leading-normal"
          style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
        >
          Send Reset Link
        </span>
      </button>

      {/* Back to Login */}
      <button
        type="button"
        onClick={handleBackToLogin}
        className="self-stretch text-[#555A64] text-base font-normal leading-normal cursor-pointer hover:text-[#222E50] transition-colors text-center"
        style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
      >
        Back to Login
      </button>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col items-start gap-4 self-stretch"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm w-full">
          {error}
        </div>
      )}

      {/* Verification Code Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Verification Code
        </label>
        <div className="flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border border-[#E8E7EA] bg-white">
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            placeholder="Enter Verification Code"
            className="flex-1 text-[#8A8D95] text-base font-normal leading-normal border-none outline-none bg-transparent"
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
        </div>
      </div>

      {/* New Password Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          New Password
        </label>
        <div 
          className={`flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border ${
            isPasswordValid(formData.newPassword) 
              ? "border-[#08B12D] bg-white" 
              : "border-[#E8E7EA] bg-white"
          }`}
        >
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="●●●●●●●●●●●"
            className={`flex-1 text-base font-medium leading-normal border-none outline-none bg-transparent ${
              isPasswordValid(formData.newPassword) 
                ? "text-[#08B12D]" 
                : "text-[#B6B5BF]"
            }`}
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="flex w-6 h-6 justify-center items-center flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
                stroke="#222E50"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9998 20.2702C15.5298 20.2702 18.8198 18.1902 21.1098 14.5902C22.0098 13.1802 22.0098 10.8102 21.1098 9.40021C18.8198 5.80021 15.5298 3.72021 11.9998 3.72021C8.46984 3.72021 5.17984 5.80021 2.88984 9.40021C1.98984 10.8102 1.98984 13.1802 2.88984 14.5902C5.17984 18.1902 8.46984 20.2702 11.9998 20.2702Z"
                stroke="#222E50"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="flex w-full max-w-[380px] lg:max-w-[440px] xl:max-w-[531px] flex-col items-end gap-1">
        <label
          className="self-stretch text-[#222E50] text-lg lg:text-[20px] font-normal leading-[1.2]"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Confirm Password
        </label>
        <div className="flex w-full h-[38px] p-[12px_16px] justify-end items-center gap-2 rounded-lg border border-[#E8E7EA] bg-white">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="●●●●●●●●●●●"
            className="flex-1 text-[#B6B5BF] text-base font-medium leading-normal border-none outline-none bg-transparent"
            style={{
              fontFamily: "Roboto, -apple-system, Helvetica, sans-serif",
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="flex w-6 h-6 justify-center items-center flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
                stroke="#222E50"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9998 20.2702C15.5298 20.2702 18.8198 18.1902 21.1098 14.5902C22.0098 13.1802 22.0098 10.8102 21.1098 9.40021C18.8198 5.80021 15.5298 3.72021 11.9998 3.72021C8.46984 3.72021 5.17984 5.80021 2.88984 9.40021C1.98984 10.8102 1.98984 13.1802 2.88984 14.5902C5.17984 18.1902 8.46984 20.2702 11.9998 20.2702Z"
                stroke="#222E50"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="flex p-[14px_24px] justify-center items-center self-stretch rounded-md bg-[#1F7674] hover:bg-[#1a6562] transition-colors"
      >
        <span
          className="text-[#EAF6F6] text-xl lg:text-[24px] font-bold leading-normal"
          style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
        >
          Reset Password
        </span>
      </button>

      {/* Back to Login */}
      <button
        type="button"
        onClick={handleBackToLogin}
        className="self-stretch text-[#555A64] text-base font-normal leading-normal cursor-pointer hover:text-[#222E50] transition-colors text-center"
        style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
      >
        Back to Login
      </button>
    </form>
  );

  const renderSuccessState = () => (
    <div className="flex flex-col items-center gap-6 self-stretch">
      {/* Success Icon */}
      <div className="flex w-16 h-16 items-center justify-center rounded-full bg-green-100">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
            fill="#22C55E"
          />
        </svg>
      </div>

      {/* Success Message */}
      <div className="flex flex-col items-center gap-2">
        <h3
          className="text-[#222E50] text-2xl lg:text-[28px] font-normal leading-[1.2] text-center"
          style={{
            fontFamily:
              "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          Password Reset Successfully!
        </h3>
        <p
          className="text-[#555A64] text-base font-normal leading-normal text-center max-w-[400px]"
          style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
        >
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>
      </div>

      {/* Back to Login Button */}
      <button
        onClick={handleBackToLogin}
        className="flex p-[14px_24px] justify-center items-center self-stretch rounded-md bg-[#1F7674] hover:bg-[#1a6562] transition-colors"
      >
        <span
          className="text-[#EAF6F6] text-xl lg:text-[24px] font-bold leading-normal"
          style={{ fontFamily: "Roboto, -apple-system, Helvetica, sans-serif" }}
        >
          Back to Login
        </span>
      </button>
    </div>
  );

  const renderCurrentForm = () => {
    switch (currentState) {
      case "login":
        return renderLoginForm();
      case "forgot":
        return renderForgotPasswordForm();
      case "reset":
        return renderResetPasswordForm();
      case "success":
        return renderSuccessState();
      default:
        return renderLoginForm();
    }
  };

  const welcomeText = getWelcomeText();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background:
          "linear-gradient(172deg, rgba(45, 70, 124, 0.70) 11.32%, rgba(42, 221, 231, 0.70) 123.47%), #FFF",
      }}
    >
    <div className="flex w-full px-4 py-8 lg:px-[60px] lg:py-[110px] justify-center items-center gap-6 max-w-screen-2xl mx-auto">
  
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 max-w-7xl w-full">
        {/* Left Side - Text and Form Stacked */}
        <div className="flex flex-col justify-center items-center gap-6 flex-1 max-w-4xl order-1">
          {/* Welcome Text - Above Form */}
          <div className="flex flex-col items-center gap-6 w-full max-w-[420px] lg:max-w-[480px] xl:max-w-[580px]">
            <div className="flex flex-col items-center gap-5 text-center">
              <h1
                className="text-white text-xl lg:text-[28px] xl:text-[34px] font-bold leading-[1.378] max-w-[420px] lg:max-w-[480px] xl:max-w-[579px]"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic Antique', -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {welcomeText.title}
              </h1>
              <p
                className="text-white text-sm lg:text-[16px] xl:text-[19.2px] font-normal leading-[1.167] max-w-[420px] lg:max-w-[480px] xl:max-w-[579px]"
                style={{
                  fontFamily:
                    "'Zen Kaku Gothic Antique', -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {welcomeText.subtitle}
              </p>
            </div>

            {/* Progress Indicators */}
            {getProgressIndicators()}
          </div>

          {/* Form - Below Text */}
          <div className="flex w-full max-w-[420px] lg:max-w-[480px] xl:max-w-[579px] p-4 lg:p-5 xl:p-6 flex-col justify-center items-center gap-6 rounded-[32px] border border-[#F3E6FF] bg-white shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.07)]">
            {/* Logo */}
            <svg
              width="119"
              height="90"
              viewBox="0 0 119 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex w-[119px] h-[90px] p-1 flex-col items-end gap-2 flex-shrink-0"
            >
              <path
                d="M115 55.6801H102.713L79.5918 32.6512L56.4768 55.6801H44.1836L53.2999 46.6071L39.4082 32.7778L16.2932 55.8H4L33.2682 26.6558L11.0294 4.50628L11.4174 4.11991H22.9281L39.4082 20.5339L45.5547 26.6558L59.4398 40.4852L73.4519 26.5359L51.2064 4.38637L51.5944 4H63.1117L79.5918 20.414L85.7384 26.5359L115 55.6801Z"
                fill="#3F62AE"
              />
              <path
                d="M6.34688 65.8392H4V63.7998H10.934V65.8392H8.58708V78.0756H6.34688V65.8392Z"
                fill="#3F62AE"
              />
              <path
                d="M18.9036 77.3541C18.3326 76.7328 18.0439 75.848 18.0439 74.6934V63.8062H20.2842V74.8566C20.2842 75.346 20.3845 75.6974 20.5791 75.9171C20.7736 76.1367 21.056 76.2434 21.4262 76.2434C21.7964 76.2434 22.0725 76.1367 22.2733 75.9171C22.4679 75.6974 22.5683 75.346 22.5683 74.8566V63.8062H24.7269V74.6934C24.7269 75.848 24.4382 76.7328 23.8735 77.3541C23.3025 77.9753 22.4741 78.2828 21.3885 78.2828C20.3029 78.2828 19.4747 77.969 18.9036 77.3541Z"
                fill="#3F62AE"
              />
              <path
                d="M32.4448 63.7998H35.7706C36.9253 63.7998 37.7661 64.0696 38.2995 64.603C38.8266 65.1427 39.0964 65.9647 39.0964 67.0817V67.9602C39.0964 69.4411 38.607 70.3824 37.628 70.7714V70.8091C38.174 70.9722 38.5568 71.3048 38.7827 71.8068C39.0086 72.3088 39.1215 72.9803 39.1215 73.8274V76.3374C39.1215 76.7453 39.1341 77.0779 39.1592 77.3289C39.1843 77.5799 39.2533 77.8309 39.3663 78.0756H37.0821C37.0005 77.8434 36.9441 77.6301 36.919 77.423C36.8939 77.2222 36.8813 76.852 36.8813 76.3249V73.7144C36.8813 73.0618 36.7746 72.6037 36.5676 72.3465C36.3542 72.0892 35.9903 71.9574 35.4757 71.9574H34.6976V78.0756H32.4574V63.7998H32.4448ZM35.5008 69.918C35.9464 69.918 36.2852 69.8051 36.5111 69.5729C36.737 69.3407 36.8499 68.9517 36.8499 68.412V67.3139C36.8499 66.7993 36.7558 66.4228 36.5738 66.1906C36.3919 65.9584 36.1032 65.8455 35.7079 65.8455H34.6913V69.9243H35.5008V69.918Z"
                fill="#3F62AE"
              />
              <path
                d="M48.5103 63.7998H51.5474L53.8755 78.0756H51.629L51.2211 75.2393V75.2769H48.6734L48.2655 78.0693H46.1885L48.5103 63.7998ZM50.9575 73.3442L49.9598 66.291H49.9159L48.937 73.3442H50.9575Z"
                fill="#3F62AE"
              />
              <path
                d="M72.2038 65.8392H69.8569V63.7998H76.7909V65.8392H74.444V78.0756H72.2038V65.8392Z"
                fill="#3F62AE"
              />
              <path
                d="M83.9888 63.7998H87.3146C88.4692 63.7998 89.3101 64.0696 89.8434 64.603C90.3705 65.1427 90.6404 65.9647 90.6404 67.0817V67.9602C90.6404 69.4411 90.1509 70.3824 89.172 70.7714V70.8091C89.7179 70.9722 90.1007 71.3048 90.3266 71.8068C90.5525 72.3088 90.6655 72.9803 90.6655 73.8274V76.3374C90.6655 76.7453 90.678 77.0779 90.7031 77.3289C90.7282 77.5799 90.7973 77.8309 90.9102 78.0756H88.6261C88.5445 77.8434 88.488 77.6301 88.4629 77.423C88.4378 77.2222 88.4253 76.852 88.4253 76.3249V73.7144C88.4253 73.0618 88.3186 72.6037 88.1115 72.3465C87.8982 72.0892 87.5342 71.9574 87.0196 71.9574H86.2415V78.0756H84.0013V63.7998H83.9888ZM87.0447 69.918C87.4903 69.918 87.8291 69.8051 88.055 69.5729C88.281 69.3407 88.3939 68.9517 88.3939 68.412V67.3139C88.3939 66.7993 88.2998 66.4228 88.1178 66.1906C87.9358 65.9584 87.6472 65.8455 87.2518 65.8455H86.2353V69.9243H87.0447V69.918Z"
                fill="#3F62AE"
              />
              <path
                d="M98.3218 63.7998H100.562V78.0756H98.3218V63.7998Z"
                fill="#3F62AE"
              />
              <path
                d="M108.354 63.7998H111.655C112.772 63.7998 113.607 64.101 114.165 64.6971C114.724 65.2933 115 66.1718 115 67.3264V68.732C115 69.8866 114.724 70.7651 114.165 71.3613C113.607 71.9574 112.772 72.2586 111.655 72.2586H110.595V78.0693H108.354V63.7998ZM111.661 70.2255C112.025 70.2255 112.302 70.1251 112.49 69.918C112.672 69.7109 112.766 69.3658 112.766 68.8763V67.1821C112.766 66.6926 112.672 66.3475 112.49 66.1404C112.308 65.9396 112.032 65.8329 111.661 65.8329H110.601V70.2192H111.661V70.2255Z"
                fill="#3F62AE"
              />
            </svg>

            {/* Form Title */}
            <h2
              className="text-[#222E50] text-2xl lg:text-[36px] xl:text-[44px] font-normal leading-[1.2]"
              style={{
                fontFamily:
                  "'Tai Heritage Pro', -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {currentState === "login"
                ? "Log In"
                : currentState === "forgot"
                  ? "Reset Password"
                  : currentState === "reset"
                    ? "Set New Password"
                    : "Success"}
            </h2>

            {/* Dynamic Form Content */}
            {renderCurrentForm()}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex-1 hidden lg:flex justify-center items-center max-w-[640px] order-2">
          <img
            src={getCurrentImage()}
            alt="Login illustration"
            className="h-auto lg:h-[600px] xl:max-h-[803px] object-contain"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminLogin;