import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import SignupForm from './components/login/SignupForm';
import DashBoard from './components/home/DashBoard';
import PrivateRoute from './components/login/PrivateRoute';
import Room from './components/room/Room';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import styles from "./App.module.css";
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// New component for handling navigation
const NavigationComponent = () => {
  const [value, setValue] = useState(0);
  const location = useLocation(); // Now used within the context of <Router>

  const shouldShowBottomNavigation = () => {
    const hideOnRoutes = ['/login', '/signup','/'];
    return !hideOnRoutes.includes(location.pathname);
  };
  
  useEffect(() => {
    // Map the current path to a value
    const pathToValueMap = {
      '/login': 0,
      '/dashboard': 1,
      '/me': 2,
    };
    // Set the value based on the current path
    setValue(pathToValueMap[location.pathname] || 0);
  }, [location]);


  return shouldShowBottomNavigation() ? (
    <BottomNavigation className={styles.bottomNavigation}
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
        }}
        showLabels = {false}
    >
        <BottomNavigationAction label="Submited List" icon={<PlaylistAddCheckCircleIcon />} component={Link} to="/login" />
        <BottomNavigationAction label="Game" icon={<AddCircleOutlineIcon/>} component={Link} to="/dashboard" />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} component={Link} to="/me" />
    </BottomNavigation>
  ) : null;
};

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<PrivateRoute component={DashBoard} />} />
          <Route path="/room/:id" element={<PrivateRoute component={Room} />} />
          <Route path="/" element={<LoginForm />} /> {/* Redirect to login by default */}
        </Routes>
        <NavigationComponent /> {/* Rendered within Router context */}
    </Router>
  );
};

export default App;