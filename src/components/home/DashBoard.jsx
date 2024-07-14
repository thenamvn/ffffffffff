// DashBoard.js
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import styles from "./DashBoard.module.css";
import { createGame, joinGame } from "../../utils/dashboard";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const DashBoard = () => {
  const navigate = useNavigate();
  const [HostRoom, setHostRoom] = useState([]);
  const [JoinRoom, setJoinRoom] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    // Subscription for host rooms
    const listHostRoom = collection(db, "hosts", username, "HostRoom");
    const q = query(listHostRoom);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push(doc.data());
      });
      setHostRoom(rooms);
    });

    // Subscription for join rooms
    const listJoinRoom = collection(db, "users", username, "listRoom");
    const q2 = query(listJoinRoom);
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      const rooms = [];
      const roomIds = new Set();
      querySnapshot.forEach((doc) => {
        const roomData = doc.data();
        if (!roomIds.has(roomData.roomid)) {
          rooms.push(roomData);
          roomIds.add(roomData.roomid);
        }
      });
      // Filter out join rooms that are already in host rooms
      const filteredJoinRooms = rooms.filter(
        (joinRoom) =>
          !HostRoom.some((hostRoom) => hostRoom.roomid === joinRoom.roomid)
      );
      setJoinRoom(filteredJoinRooms);
    });

    // Cleanup function to unsubscribe from both
    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [username, HostRoom]);

  const handleJoin = async (roomId) => {
    const roomRef = doc(db, "rooms", roomId);
    const docSnap = await getDoc(roomRef);
    if (!docSnap.exists()) {
      alert("Room not found");
      // Assuming 'id' is the roomid of the room you want to remove
      const listRoomRef = collection(db, "users", username, "listRoom");
      const q = query(listRoomRef, where("roomid", "==", roomId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // For each document in the query result, delete the document
        deleteDoc(doc.ref);
      });
      return;
    }

    navigate(`/room/${roomId}`);
  };

  const handleCreateGame = () => {
    createGame(navigate); // Call createGame function to create a game room
  };

  const handleJoinGame = () => {
    const roomCode = document.getElementById("room-code").value;
    joinGame(roomCode, navigate); // Call joinGame function to join a game room
  };

  return (
    <div className={styles.bg_dashboard}>
      <div className={styles.container}>
        <h1>WebGame</h1>
        <button className={styles.create_game_btn} onClick={handleCreateGame}>
          <i className="fas fa-gamepad"></i> CREATE GAME
        </button>
        <br />
        <div className={styles.roomClass}>
          <input
            type="text"
            id="room-code"
            placeholder="Enter room code"
            className={styles.inputRoomCode} // Sử dụng camelCase cho tên class
          />
          <button className={styles.join_game_btn} onClick={handleJoinGame}>
            <i className="fas fa-user"></i> Join
          </button>
        </div>
      </div><br />
      <div className={styles.hostroom}>
        <h1>Created Rooms</h1>
        <ul>
          {HostRoom.map((room) => (
            <li key={room.roomid} onClick={() => handleJoin(room.roomid)}>
              {room.roomid}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.joinroom}>
        <h1>Joined Rooms</h1>
        <ul>
          {JoinRoom.map((room) => (
            <li key={room.roomid} onClick={() => handleJoin(room.roomid)}>
              {room.roomid}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashBoard;
