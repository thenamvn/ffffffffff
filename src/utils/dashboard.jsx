import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you export db from firebase.js or similar

// Hàm tạo ID ngẫu nhiên 6 ký tự
const generateRandomId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Hàm kiểm tra ID đã tồn tại
const checkIfRoomExists = async (roomId) => {
  const roomRef = doc(db, "rooms", roomId);
  const docSnap = await getDoc(roomRef);
  return docSnap.exists();
};

// Hàm tạo game với ID duy nhất
export const createGame = async (navigate) => {
  try {
    let roomId = generateRandomId();
    let roomExists = await checkIfRoomExists(roomId);

    // Nếu ID đã tồn tại, tạo lại ID mới cho đến khi tìm được ID chưa tồn tại
    while (roomExists) {
      roomId = generateRandomId();
      roomExists = await checkIfRoomExists(roomId);
    }

    // Tạo một document mới trong Firestore với ID duy nhất
    const roomRef = doc(db, "rooms", roomId); // Get a reference to the document location
    await setDoc(roomRef, {
      // Create the document with initial data
      admin_username: localStorage.getItem("username"),
      // Add other room details here
    });

    console.log("Room created successfully with ID: ", roomRef.id); // Lưu trữ ID của phòng vào state
    navigate(`/room/${roomRef.id}`); // Điều hướng đến trang phòng game với ID mới
  } catch (error) {
    console.error("Error creating room: ", error);
    alert("Error creating room: " + error.message);
  }
};

export const joinGame = async (roomCode, navigate) => {
  try {
    // Kiểm tra xem phòng game có tồn tại không
    const roomDoc = await getDoc(doc(db, "rooms", roomCode));
    if (!roomDoc.exists()) {
      throw new Error("Room not found");
    }

    console.log("Joined room successfully with ID: ", roomDoc.id);
    navigate(`/room/${roomDoc.id}`); // Điều hướng đến trang phòng game với ID đã tồn tại
  } catch (error) {
    console.error("Error joining room: ", error);
    alert("Error joining room: " + error.message);
  }
};
