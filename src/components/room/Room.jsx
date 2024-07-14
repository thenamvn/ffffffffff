// Import necessary modules and components
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { readAndCompressImage } from "browser-image-resizer";
import styles from "./Room.module.css"; // Import CSS module
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import 'react-slideshow-image/dist/styles.css'
// import { Slide } from 'react-slideshow-image';

import { db, storage } from "../../firebase"; // Import Firebase Firestore and Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import PostAddIcon from '@mui/icons-material/PostAdd';
import ManualSlideshow from "../slider/Sliders"; // Import the ManualSlideshow component
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  addDoc,
  where,
  onSnapshot,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

const Room = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showUploadFormUser, setShowUploadFormUser] = useState(false);
  const [showUploadFormAdmin, setShowUploadFormAdmin] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [submittedUsers, setSubmittedUsers] = useState([]);
  const [selectedUserImages, setSelectedUserImages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSubmitedForm, setShowSubmitedForm] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);


  useEffect(() => {
    // Fetch room details from Firestore using the new API
    const roomRef = doc(db, "rooms", id); // Get a reference to the document
    getDoc(roomRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setRoomDetails(docSnap.data());
          setIsAdmin(
            docSnap.data().admin_username === localStorage.getItem("username")
          );
        } else {
          setError("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
        setError(error.message);
      });
  }, [id]);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!isAdmin) {
      const listUserQuery = query(
        collection(db, "users" , username, "listRoom"),
        where("roomid", "==", id),
        where("username", "==", username)
      );

      getDocs(listUserQuery).then((querySnapshot) => {
        if (querySnapshot.empty && !userAdded) {
          const listUser = collection(db, "users" , username, "listRoom");
          const listUserDoc = { roomid: id, username: username };
          addDoc(listUser, listUserDoc)
            .then(() => {
              console.log("New user added to list room");
              setUserAdded(true); // Update state to prevent re-adding
            })
            .catch((error) => {
              console.error("Error adding user to list room: ", error);
            });
        } else {
          console.log("User already added to list room or already checked");
          setUserAdded(true); // Update state as user is already added or checked
        }
      });
    } else {
      const listUserQuery = query(
        collection(db,"hosts",username, "HostRoom"),
        where("roomid", "==", id),
        where("username", "==", username)
      );

      getDocs(listUserQuery).then((querySnapshot) => {
        if (querySnapshot.empty && !userAdded) {
          const listUser = collection(db,"hosts",username, "HostRoom");
          const listUserDoc = { roomid: id, username: username };
          addDoc(listUser, listUserDoc)
            .then(() => {
              console.log("New user added to host room");
              setUserAdded(true); // Update state to prevent re-adding
            })
            .catch((error) => {
              console.error("Error adding user to host room: ", error);
            });
        } else {
          console.log("User already added to host room or already checked");
          setUserAdded(true); // Update state as user is already added or checked
        }
      });
    }
  }, [id, isAdmin, userAdded]);

  useEffect(() => {
    if (isAdmin) {
      const listUser = collection(db, "rooms", id, "SubmitedUser");
      const unsubscribe = onSnapshot(listUser, (querySnapshot) => {
        const users = querySnapshot.docs.map((doc) => doc.data());
        setSubmittedUsers(users);
      });

      // Cleanup function để hủy đăng ký lắng nghe khi component bị unmount
      return () => unsubscribe();
    }
  }, [id, isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      // Real-time fetch images for the room
      const userImagesRef = collection(db, "rooms", id, "Admin_Images");
      const unsubscribeImages = onSnapshot(
        userImagesRef,
        (querySnapshot) => {
          const urls = [];
          querySnapshot.forEach((doc) => {
            urls.push(doc.data().url); // Assuming 'url' is the correct field
          });
          setUploadedFileURLs(urls);
        },
        (error) => {
          console.error("Error fetching user images:", error);
        }
      );

      // Real-time fetch job descriptions for the room
      const jobsRef = collection(db, "rooms", id, "jobs");
      const unsubscribeJobs = onSnapshot(
        jobsRef,
        (querySnapshot) => {
          const jobs = [];
          querySnapshot.forEach((doc) => {
            jobs.push(doc.data().job_description); // Assuming 'job_description' is the correct field
          });
          setJobDescriptions(jobs);
        },
        (error) => {
          console.error("Error fetching job descriptions:", error);
        }
      );

      // Cleanup function to unsubscribe from the real-time updates when the component unmounts
      return () => {
        unsubscribeImages();
        unsubscribeJobs();
      };
    }
  }, [id, isAdmin, setUploadedFileURLs, setJobDescriptions]);

  function handleChange(event) {
    const filesArray = Array.from(event.target.files);
    setSelectedFiles(filesArray);
    const config = {
      quality: 0.75,
      maxWidth: 1920,
      maxHeight: 1080,
      autoRotate: true,
    };
    Promise.all(filesArray.map((file) => readAndCompressImage(file, config)))
      .then((resizedImages) => {
        setFiles(
          resizedImages.map((blob, i) => ({ blob, name: filesArray[i].name }))
        );
      })
      .catch((err) => {
        console.error("Error in image processing:", err);
      });
  }

  function closeMissionUpload() {
    setShowUploadFormAdmin(false);
    setSelectedFiles([]);
  };
  function UserShowUploadForm() {
    setShowUploadFormUser(false);
    setSelectedFiles([]);
  }
  const sliderSettings = {
    centerMode: true,
    dots: true,
    infinite: uploadedFileURLs.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1920, // Màn hình rất lớn, không cần tải ảnh lớn hơn 1080p
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 1440, // Màn hình lớn
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 1280, // Màn hình máy tính trung bình
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 1024, // Máy tính bảng lớn và màn hình máy tính nhỏ
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 768, // Máy tính bảng
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 600, // Máy tính bảng nhỏ
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 480, // Điện thoại di động lớn
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
      {
        breakpoint: 320, // Điện thoại di động
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uploadedFileURLs.length > 1,
        },
      },
    ],
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setShowTooltip(true);
  }


  const handleUserClick = async (userId) => {
    const imagesCollectionRef = collection(db, "rooms", id, "UsersUpload");
    const q = query(imagesCollectionRef, where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map((doc) => doc.data().url);
    setSelectedUserImages(images);
    setSelectedUser(userId);
    setShowSubmitedForm(true);
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!files.length) {
      return;
    }

    const uploaderUsername = localStorage.getItem("username");
    setSelectedFiles([]);

    if (isAdmin) {
      // Xử lý tải ảnh cho admin
      files.forEach((file) => {
        const imageRef = ref(storage, `images/${id}/${file.name}`);
        uploadBytes(imageRef, file.blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setUploadedFileURLs((prevUrls) => [...prevUrls, downloadURL]);

            const imagesRef = collection(db, "rooms", id, "Admin_Images");
            const imageDoc = {
              uploader_username: uploaderUsername,
              url: downloadURL,
            };

            // Thêm link ảnh vào Firestore
            addDoc(imagesRef, imageDoc)
              .then(() => {
                console.log("Image URL added to Admin_Images");
              })
              .catch((error) => {
                console.error("Error adding image URL: ", error);
              });
          });
        });
      });
      // Nếu người dùng là admin, thêm mô tả công việc vào jobs
      const description = event.target.querySelector("textarea").value;
      const job = { job_description: description };
      const jobsRef = collection(db, "rooms", id, "jobs");
      addDoc(jobsRef, job)
        .then((docRef) => {
          console.log("Job description uploaded with ID: ", docRef.id);
          setJobDescriptions((prevJobs) => [...prevJobs, description]);
          setShowUploadFormAdmin(false);
          alert("Job Upload successfully!");
        })
        .catch((error) => {
          console.error("Error adding job description: ", error);
        });
    } else {
      // Xử lý tải ảnh cho user
      const auth = getAuth();
      const user = auth.currentUser;
      const displayName = user.displayName;
      const listUser = collection(db, "rooms", id, "SubmitedUser");
      const queryRef = query(listUser, where("id", "==", uploaderUsername));

      getDocs(queryRef).then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Tài liệu không tồn tại, tiến hành thêm mới
          addDoc(listUser, {
            id: uploaderUsername,
            name: displayName,
            // Thêm các trường khác ở đây
          })
            .then(() => {
              console.log("New submited user added");
            })
            .catch((error) => {
              console.error("Error adding submited user: ", error);
            });
        } else {
          console.log(
            "Submited user with the same id and name already exists."
          );
          // Xử lý trường hợp trùng lặp ở đây
        }
      });

      files.forEach((file) => {
        const imageRef = ref(storage, `images/${id}/${file.name}`);
        uploadBytes(imageRef, file.blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setUploadedFileURLs((prevUrls) => [...prevUrls, downloadURL]);

            const imagesCollectionRef = collection(
              db,
              "rooms",
              id,
              "UsersUpload"
            );
            const imageDoc = {
              url: downloadURL,
              id: uploaderUsername,
              displayName: displayName,
              // Add other image metadata here as needed
            };

            addDoc(imagesCollectionRef, imageDoc)
              .then(() => {
                console.log(
                  "Image document added under user's images collection"
                );
                setShowUploadFormUser(false);
                alert("Job submitted successfully!");
              })
              .catch((error) => {
                console.error("Error adding image document: ", error);
              });
          });
        });
      });
    }
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roomDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bg_room}>
      <h1 className={styles.roomTitle}>Welcome to room {id}</h1>
      {isAdmin ? (
        <>
          {/* Admin view */}
          <div className={styles.adminView}>
            <button
              className={styles.shareButton}
              onClick={() => setShowRoomInfo(true)}
            >
              Share
            </button>
            <button
              className={styles.uploadButton}
              onClick={() => setShowUploadFormAdmin(true)}
            >
              <PostAddIcon />
            </button>
          </div>
          {showRoomInfo && (
            <div className={styles.roomInfo}>
              <button
                className={styles.closeButton}
                onClick={() => setShowRoomInfo(false)}
              >
                X
              </button>
              <br />
              <p className={styles.roomLink}>
                Room Link:{" "}
                <a href={window.location.href}>{window.location.href}</a>
                <br />
                Scan QR code to join the room
              </p>
              <br />
              <div className={styles.qrCode}>
                <QRCode value={window.location.href} />
              </div>
              <button
                className={styles.copyButton}
                onClick={() => copyToClipboard(window.location.href)}
              >
                Copy Link
              </button>
              {showTooltip && (
                <span className={styles.tooltip}>Copied to Clipboard!</span>
              )}
            </div>
          )}
          {showUploadFormAdmin && ( // Use the state variable to conditionally render this form
            <form className={styles.uploadForm} onSubmit={handleSubmit}>
              <h1>Misson Upload</h1>
              <button // Close button to hide the form
                className={styles.closeButton}
                onClick={closeMissionUpload}
              >
                <CloseIcon />
              </button>
              <div className={styles.fileUploadContainer}>
                <input
                  type="file"
                  onChange={handleChange}
                  className={styles.fileInput}
                  multiple
                  id="fileInput"
                  style={{ display: "none" }} // Hide the actual input
                />
                <label htmlFor="fileInput" className={styles.fileInputLabel}>
                  <i className="fas fa-upload"></i> Upload Files
                </label>
                {selectedFiles.length > 0 && (
                  <div className={styles.fileDetails}>
                    {selectedFiles.length} file(s) selected
                  </div>
                )}
              </div>
              <br />
              <textarea
                placeholder="Description"
                className={styles.descriptionInput}
              />
              <br />
              <button type="submit" className={styles.shareButton}>
                <SendIcon />
              </button>
            </form>
          )}
          {/* Leaderboard */}
          <div className={styles.leaderboard}>
            <h2>Submited Users</h2>
            <ul>
              {submittedUsers.map((user, index) => (
                <li key={index} onClick={() => handleUserClick(user.id)}>
                  {user.name} ({user.id})
                </li>
              ))}
            </ul>
          </div>
          {showSubmitedForm && (
            <div className={styles.uploadedImagesForm}>
              <button
                className={styles.closeButton}
                onClick={() => setShowSubmitedForm(false)}
              >
                X
              </button>
              <h2>Images uploaded by {selectedUser}</h2>
              <ManualSlideshow images={selectedUserImages} />
              <button
                className={styles.acceptButton}
                // onClick={() => handleAccept(imageUrl)}
              >
                Accept
              </button>
              <button
                className={styles.denyButton}
                // onClick={() => handleDeny(imageUrl)}
              >
                Deny
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.nonAdminView}>
          {/* Non-admin view */}
          <button
            className={styles.uploadButton}
            onClick={() => setShowUploadFormUser(true)}
          >
            <AddTaskIcon />
          </button>
          {showUploadFormUser && (
            <form className={styles.uploadForm} onSubmit={handleSubmit}>
              <h1>Submit Job</h1>
              <div className={styles.fileUploadContainer}>
                <input
                  type="file"
                  onChange={handleChange}
                  className={styles.fileInput}
                  multiple
                  id="fileInput"
                  style={{ display: "none" }} // Hide the actual input
                />
                <label htmlFor="fileInput" className={styles.fileInputLabel}>
                  <i className="fas fa-upload"></i> Upload Files
                </label><br />
                {selectedFiles.length > 0 && (
                  <div className={styles.fileDetails}>
                    {selectedFiles.length} file(s) selected
                  </div>
                )}
              </div>
              <button
                className={styles.closeButton}
                onClick={UserShowUploadForm}
              >
                <CloseIcon />
              </button>
              <br />
              <button type="submit" className={styles.shareButton}>
                <SendIcon />
              </button>
            </form>
          )}
          <div className={styles.missionDiv}>
            <h2>Your mission:</h2>
            {jobDescriptions.map((job, index) => (
              <div key={index}>
                <p>{job}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {uploadedFileURLs.length > 0 && (
      <div className={styles.sliderContainer}>
        <Slider {...sliderSettings}
        >
          {uploadedFileURLs.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Uploaded content ${index + 1}`}
                className={styles.uploadedImage}
                style={{
                  width: "80vw",
                  height: "auto",
                  maxWidth: "80vw", // Giữ nguyên giới hạn này vì ảnh có chất lượng tối đa là 1080p
                  maxHeight: "50vh",
                  border: "none",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
      )}

      {/* Message for non-admins when no content is available */}
      {!isAdmin && uploadedFileURLs.length === 0 && (
        <div className={styles.noContentMessage}>
          <p>No content has been shared in this room yet.</p>
          <p>
            Please check back later or ask the room admin to upload some
            content.
          </p>
        </div>
      )}
    </div>
  );
};

export default Room;
