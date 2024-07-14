import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const handleLogin = async (event, navigate) => {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember-me").checked;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // Save the token and user information to localStorage
    const token = await user.getIdToken();
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.email);
    localStorage.setItem("current_username", user.displayName);

    if (remember) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("password");
    }

    // Lấy URL gốc từ localStorage
    const redirectPath = localStorage.getItem('redirectPath') || '/dashboard';

    // Xóa URL gốc khỏi localStorage
    localStorage.removeItem('redirectPath');

    // Navigate to the original URL
    navigate(redirectPath);
  } catch (error) {
    console.error("Error during login:", error);
    alert("Invalid username or password. Please try again.");
  }
};

export default handleLogin;
