// src/utils/logout.js
import { auth } from "../firebaseConfig";

const handleLogout = async (navigate) => {
  try {
    await auth.signOut();
    localStorage.removeItem("token"); // Xóa token hoặc các thông tin khác cần thiết
    localStorage.removeItem("username");
    localStorage.removeItem("current_username");
    localStorage.removeItem("password"); // Xóa mật khẩu nếu bạn lưu trong localStorage

    // Điều hướng đến trang login sau khi logout thành công
    navigate('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    // Xử lý lỗi nếu cần thiết, ví dụ hiển thị thông báo cho người dùng
  }
};

export default handleLogout;
