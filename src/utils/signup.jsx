// src/utils/signup.js
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const handleSignUp = async (fullname, username, password, confirmPassword, navigate) => {
  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // Update the user's profile
    await updateProfile(user, {
      displayName: fullname
    });

    alert("Sign up successful! Please log in.");
    navigate('/login');
  } catch (error) {
    console.error('Error during sign up:', error);
    alert('An error occurred during sign up. Please try again.');
  }
};

export default handleSignUp;
