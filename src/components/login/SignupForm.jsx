import React, { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import handleKeyDown from "../../utils/handleKeyDown";
import handleSignUp from "../../utils/signup";
import { useNavigate } from "react-router-dom";
import styles from "../login/Login.module.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!fullname) newErrors.fullname = "*Full name is required";
    if (!username) newErrors.username = "*Email is required";
    if (!password) newErrors.password = "*Password is required";
    else if (password.length < 6)
      newErrors.password = "*Password must be at least 6 characters";
    if (!confirmPassword)
      newErrors.confirmPassword = "*Confirm password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "*Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
    } else {
      await handleSignUp(
        fullname,
        username,
        password,
        confirmPassword,
        navigate
      );
      setIsSubmitting(false);
    }
  };

  const navigateToLoginForm = () => {
    navigate("/login");
  };

  return (
    <div className={styles.signupContainer}>
      <form
        id="signup-form"
        onSubmit={handleSubmit}
        className={styles.loginForm}
      >
        <ProfilePicture />
        <br />
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          {errors.fullname && (
            <div className={styles.errorMessage}>{errors.fullname}</div>
          )}
        </div>
        <br />
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          {errors.username && (
            <div className={styles.errorMessage}>{errors.username}</div>
          )}
        </div>
        <br />
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className={styles.errorMessage}>{errors.password}</div>
          )}
          <br />
        </div>
        <br />
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
          />
          {errors.confirmPassword && (
            <div className={styles.errorMessage}>{errors.confirmPassword}</div>
          )}
          <br />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.loginButton}
        >
          <span className={styles.loginButtonText}>Đăng kí</span>
        </button>
        <p className={styles.noAccount}>
          Already have an acount ?
          <a onClick={navigateToLoginForm} className={styles.link}>
            {" "}
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
