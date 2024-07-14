import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import handleLogin from "../../utils/login";
import handleKeyDown from "../../utils/handleKeyDown";
import styles from "../login/Login.module.css";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigateToSignupForm = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("username");
    const rememberedPassword = localStorage.getItem("password");

    if (rememberedUsername && rememberedPassword) {
      usernameRef.current.value = rememberedUsername;
      passwordRef.current.value = rememberedPassword;
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      localStorage.removeItem("password");
    }
  };

  const handleLoginClick = (event) => {
    handleLogin(event, navigate);
    if (rememberMe) {
      localStorage.setItem("username", usernameRef.current.value);
      localStorage.setItem("password", passwordRef.current.value);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form id="login-form" className={styles.loginForm}>
        <ProfilePicture />
        <br />
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            ref={usernameRef}
            autoComplete="username"
          />
        </div>
        <br />
        <div className={styles.inputContainer}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            id="password"
            name="password"
            ref={passwordRef}
            onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
            autoComplete="current-password"
          />
          <br />
          <a href="#" className={styles.forgotPassword}>
            Forget Password?
          </a>
        </div>
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              id="remember-me"
              className={styles.checkboxInput}
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <span className={styles.checkboxLabel}></span>
            Remember me
          </label>
        </div>
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              id="show-password"
              className={styles.checkboxInput}
              onChange={togglePasswordVisibility}
            />
            <span className={styles.checkboxLabel}></span>
            Show password
          </label>
        </div>
        <a className={styles.loginButton} onClick={handleLoginClick}>
          <span className={styles.loginButtonText} id="login-button">
            Sign In
          </span>
        </a>
        <p className={styles.noAccount}>
          Don’t have an account yet ?
          <a onClick={navigateToSignupForm} className={styles.link}>
            {" "}
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
