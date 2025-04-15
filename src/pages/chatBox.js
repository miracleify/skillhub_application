// import React, { useState, useEffect, useRef } from "react";
// import { db, auth, storage } from "./firebase";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
//   serverTimestamp,
//   limit,
//   doc,
//   updateDoc,
//   arrayUnion,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./chatbox.css";
// import { FiArrowLeft  } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";

// const ChatBox = ({ tradesperson }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [attachments, setAttachments] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [failedMessages, setFailedMessages] = useState([]);
//   const messagesEndRef = useRef(null);
//   const messageContainerRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const cameraInputRef = useRef(null);
//   const retryTimeouts = useRef({});
//   const uploadTimeoutRef = useRef(null);

  
//   function Handlepopover(){
    

//   }
//   // Check Firebase storage initialization
//   useEffect(() => {
//     try {
//       // Test if Firebase is initialized correctly
//       const testRef = ref(storage, "test");
//       console.log("Firebase storage initialized:", testRef !== null);
//     } catch (err) {
//       console.error("Firebase storage initialization error:", err);
//       setError("Firebase initialization error: " + err.message);
//     }
//   }, []);

//   // Monitor network status
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   // Auto-retry failed messages when back online
//   useEffect(() => {
//     if (isOnline && failedMessages.length > 0) {
//       // Wait a moment to ensure connection is stable
//       const timeoutId = setTimeout(() => {
//         failedMessages.forEach((failedMsg) => {
//           retryMessage(failedMsg.id);
//         });
//       }, 2000);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [isOnline, failedMessages]);

//   // Monitor authentication state
//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     // Automatic anonymous sign-in if not already signed in
//     if (!auth.currentUser) {
//       handleLogin();
//     }

//     return () => unsubscribeAuth();
//   }, []);

//   // Listen for messages in Firestore with pagination
//   useEffect(() => {
//     let unsubscribe = () => {};

//     try {
//       // Only fetch a limited number of recent messages for performance
//       const q = query(
//         collection(db, "messages"),
//         orderBy("timestamp", "desc"),
//         limit(50)
//       );

//       unsubscribe = onSnapshot(
//         q,
//         (snapshot) => {
//           const msgs = snapshot.docs
//             .map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }))
//             .reverse(); // Reverse to show in chronological order

//           setMessages(msgs);

//           // Mark messages as read if they're not from current user
//           if (user) {
//             msgs.forEach((msg) => {
//               if (msg.uid !== user.uid && !msg.readBy?.includes(user.uid)) {
//                 markMessageAsRead(msg.id);
//               }
//             });
//           }

//           setError(null);
//         },
//         (error) => {
//           console.error("Error fetching messages:", error);
//           setError(`Firestore Error: ${error.message}`);
//         }
//       );
//     } catch (err) {
//       console.error("Error setting up Firestore listener:", err);
//       setError(`Setup Error: ${err.message}`);
//     }

//     return () => unsubscribe();
//   }, [user]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     // Add a small delay to ensure DOM has updated
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const handleLogin = async () => {
//     setError(null);
//     try {
//       await signInAnonymously(auth);
//     } catch (error) {
//       console.error("Error signing in anonymously:", error);
//       setError(`Auth Error: ${error.message}`);
//     }
//   };

//   const handleFileAttachment = (e) => {
//     handleAttachmentUpload(e.target.files);
//   };

//   const handleAttachmentUpload = async (files) => {
//     if (!files || files.length === 0) return;

//     setIsUploading(true);
//     setError(null);
//     const newAttachments = [];

//     // Set a timeout to prevent infinite loading
//     if (uploadTimeoutRef.current) {
//       clearTimeout(uploadTimeoutRef.current);
//     }

//     uploadTimeoutRef.current = setTimeout(() => {
//       if (isUploading) {
//         setIsUploading(false);
//         setError(
//           "Upload timed out. Please try again with a smaller file or check your connection."
//         );
//       }
//     }, 60000); // 1 minute timeout

//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const fileId = `${Date.now()}_${Math.random()
//           .toString(36)
//           .substring(2, 15)}`;

//         // Create metadata with CORS headers
//         const metadata = {
//           contentType: file.type,
//           customMetadata: {
//             "Access-Control-Allow-Origin": "*",
//           },
//         };

//         const fileRef = ref(
//           storage,
//           `uploads/${user.uid}/${fileId}_${file.name}`
//         );

//         // Add console logs to track progress
//         console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);

//         // Upload file with metadata and progress monitoring
//         const uploadTask = uploadBytes(fileRef, file, metadata);
//         await uploadTask;
//         console.log(`File uploaded, getting download URL`);

//         const downloadUrl = await getDownloadURL(fileRef);
//         console.log(
//           `Download URL acquired: ${downloadUrl.substring(0, 50)}...`
//         );

//         newAttachments.push({
//           id: fileId,
//           name: file.name,
//           type: file.type,
//           size: file.size,
//           url: downloadUrl,
//           isImage: file.type.startsWith("image/"),
//         });
//       }

//       console.log(
//         `All files processed, adding ${newAttachments.length} attachments`
//       );
//       setAttachments((prev) => [...prev, ...newAttachments]);
//     } catch (err) {
//       console.error("Error uploading attachments:", err);
//       if (err.message && err.message.includes("CORS")) {
//         setError(
//           `CORS Error: ${err.message}. Please check your network configuration or try a different browser.`
//         );
//       } else {
//         setError(`Upload Error: ${err.message}`);
//       }
//     } finally {
//       setIsUploading(false);
//       if (uploadTimeoutRef.current) {
//         clearTimeout(uploadTimeoutRef.current);
//       }
//     }
//   };

//   const removeAttachment = (attachmentId) => {
//     setAttachments((prev) =>
//       prev.filter((attachment) => attachment.id !== attachmentId)
//     );
//   };

//   const markMessageAsRead = async (messageId) => {
//     if (!user) return;

//     try {
//       const messageRef = doc(db, "messages", messageId);
//       await updateDoc(messageRef, {
//         readBy: arrayUnion(user.uid),
//         lastReadAt: serverTimestamp(),
//       });
//     } catch (err) {
//       console.error("Error marking message as read:", err);
//       // Silent fail - no need to show error to user
//     }
//   };

//   const retryMessage = async (messageId) => {
//     // Find the failed message
//     const failedMsg = failedMessages.find((msg) => msg.id === messageId);
//     if (!failedMsg) return;

//     // Remove from failed messages list
//     setFailedMessages((prev) => prev.filter((msg) => msg.id !== messageId));

//     // Clear any existing retry timeouts
//     if (retryTimeouts.current[messageId]) {
//       clearTimeout(retryTimeouts.current[messageId]);
//       delete retryTimeouts.current[messageId];
//     }

//     try {
//       // Send message to Firestore
//       const docRef = await addDoc(collection(db, "messages"), {
//         ...failedMsg,
//         timestamp: serverTimestamp(),
//         retried: true,
//         originalTimestamp: failedMsg.timestamp.toDate(),
//       });

//       // Update message in UI with new ID
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === messageId
//             ? { ...msg, id: docRef.id, failed: false, retried: true }
//             : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error retrying message:", error);

//       // Mark as failed again
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === messageId ? { ...msg, failed: true } : msg
//         )
//       );

//       setFailedMessages((prev) => [
//         ...prev.filter((msg) => msg.id !== messageId),
//         failedMsg,
//       ]);
//     }
//   };

//   const sendMessage = async (e) => {
//     if (e) e.preventDefault();
//     setError(null);

//     if (!user) {
//       await handleLogin();
//       if (!user) {
//         setError("Failed to authenticate. Please try again.");
//         return;
//       }
//     }

//     // Allow sending message if there's text or attachments
//     if (!message.trim() && attachments.length === 0) return;

//     const tempId = `temp-${Date.now()}`;
//     const newMessage = {
//       text: message,
//       uid: user.uid,
//       timestamp: serverTimestamp(),
//       attachments: attachments.length > 0 ? attachments : null,
//       readBy: [user.uid], // Mark as read by sender
//       sent: new Date(),
//     };

//     // Optimistic UI update
//     const optimisticMsg = {
//       ...newMessage,
//       id: tempId,
//       timestamp: { toDate: () => new Date() },
//       status: isOnline ? "sending" : "failed",
//     };

//     setMessages((prevMessages) => [...prevMessages, optimisticMsg]);
//     setMessage("");
//     setAttachments([]);

//     // If offline, add to failed messages queue
//     if (!isOnline) {
//       setFailedMessages((prev) => [...prev, optimisticMsg]);
//       return;
//     }

//     try {
//       // Actually send the message
//       const docRef = await addDoc(collection(db, "messages"), newMessage);

//       // Update the message in the UI with the real ID
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId ? { ...msg, id: docRef.id, status: "sent" } : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error sending message:", error);

//       // Mark message as failed in UI
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === tempId ? { ...msg, status: "failed", failed: true } : msg
//         )
//       );

//       // Add to failed messages queue
//       setFailedMessages((prev) => [
//         ...prev,
//         { ...optimisticMsg, failed: true },
//       ]);

//       // Set up retry mechanism
//       const waitTime = Math.min(
//         30000,
//         Math.pow(2, failedMessages.length) * 1000
//       );
//       retryTimeouts.current[tempId] = setTimeout(() => {
//         if (navigator.onLine) {
//           retryMessage(tempId);
//         }
//       }, waitTime);
//     }
//   };

//   const handleCameraCapture = () => {
//     cameraInputRef.current?.click();
//   };

//   const handleImageUpload = () => {
//     imageInputRef.current?.click();
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   // Render message status indicator

//   const renderMessageStatus = (msg) => {
//     if (msg.uid !== user?.uid) return null;

//     if (msg.failed || msg.status === "failed") {
//       return (
//         <div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               marginTop: "2px",
//             }}
//           >
//             <span
//               style={{ color: "#ff4d4f", fontSize: "11px", marginRight: "5px" }}
//             >
//               {" "}
//               <i className="fa-solid fa-circle-exclamation"></i>Message failed
//               to send
//             </span>
//             <button
//               onClick={() => retryMessage(msg.id)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#1890ff",
//                 cursor: "pointer",
//                 padding: "0",
//                 fontSize: "11px",
//                 textDecoration: "underline",
//               }}
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       );
//     }
    
   

//     if (!msg.timestamp?.toDate) {
//       return (
//         <span style={{ color: "#888", fontSize: "11px" }}>
//           <i
//             className="fa-solid fa-circle-notch fa-spin"
//             style={{ marginRight: "3px" }}
//           ></i>
//           Sending...
//         </span>
//       );
//     }

//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-end",
//           marginTop: "2px",
//         }}
//       >
//         {msg.readBy && msg.readBy.length > 1 ? (
//           <span style={{ color: "#1890ff", fontSize: "11px" }}>
//             <i
//               className="fa-solid fa-check-double"
//               style={{ marginRight: "3px" }}
//             ></i>
//             Read
//           </span>
//         ) : (
//           <span style={{ color: "#52c41a", fontSize: "11px" }}>
//             <i
//               className="fa-solid fa-check-double"
//               style={{ marginRight: "3px" }}
//             ></i>
//             Sent
//           </span>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="chat-container">
//       {/* Connection status indicator */}
//       {!isOnline && (
//         <div
//           style={{
//             backgroundColor: "#fff1f0",
//             padding: "8px 12px",
//             borderRadius: "4px",
//             marginBottom: "10px",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <i
//             className="fa-solid fa-wifi-slash"
//             style={{ color: "#ff4d4f", marginRight: "8px" }}
//           ></i>
//           <span>
//             You are offline. Messages will be sent when you reconnect.
//           </span>
//         </div>
//       )}
// {/* Profile Card - Centered */}
// {tradesperson && (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       padding: "15px",
//       backgroundColor: "#f7f9fa",
//       borderRadius: "8px",
//       marginTop: "50px", 
//       position: "sticky",
//       top: "0",
//       zIndex: "100",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//     }}
//   >
//     <FiArrowLeft className="arrowleft" size={35} style={{ marginRight: "15px", cursor: "pointer" }} />
    
//     <div style={{ position: "relative", flexGrow: "" }}>
//       <img
//         src={tradesperson.image}
//         alt={`${tradesperson.fname} ${tradesperson.lname}`}
//         style={{
//           width: "60px",
//           height: "60px",
//           borderRadius: "50%",
//           objectFit: "cover",
//            marginLeft:"500px"
//         }}
//       />
//       {tradesperson.isOnline && (
//         <span
//           style={{
//             position: "absolute",
//             bottom: "2px",
//             right: "2px",
//             backgroundColor: "#4CAF50",
//             width: "12px",
//             height: "12px",
//             borderRadius: "50%",
//             border: "2px solid white",
//           }}
//         ></span>
//       )}
//     </div>
    
//     <div style={{ flexGrow: "1",marginLeft:"-600px" }}>
//       <h3 style={{ margin: "0 0 5px 0" }}>
//         {tradesperson.fname} {tradesperson.lname}
//       </h3>
//       <p style={{ margin: "0", color: "#666" }}>
//         {tradesperson.profession}
//       </p>
//       <span 
//         style={{ 
//           fontSize: "12px", 
//           color: tradesperson.isOnline ? "#4CAF50" : "#999" 
//         }}
//       >
//         {tradesperson.isOnline ? "Online" : "Offline"}
//       </span>
//     </div>
    
//     <button 
//       className="threedots"
//       style={{
//         background: "transparent",
//         border: "none",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "8px",
//         marginLeft: "auto",
//       }}
//     >
//       <div className="circle" style={{ width: "4px", height: "4px", backgroundColor: "#666", borderRadius: "50%", marginBottom: "4px" }}></div>
//       <div className="circle" style={{ width: "4px", height: "4px", backgroundColor: "#666", borderRadius: "50%", marginBottom: "4px" }}></div>
//       <div className="circle" style={{ width: "4px", height: "4px", backgroundColor: "#666", borderRadius: "50%" }}></div>
//     </button>
//   </div>
// )}
      
//       <div className="profile-d">
//         <img style={{
//               width: "120px",
//               height: "120px",
//               borderRadius: "50%",
//               objectFit: "cover",}} src={tradesperson.image} />
//                {tradesperson.isOnline && <span>online</span>}
//                <h3 style={{ margin: "0 0 5px 0" }}>  Start chating with {tradesperson.fname} </h3>
//       </div> 
     
      
//       <h2>Chat Room</h2>

//       {error && (
//         <div
//           style={{
//             color: "red",
//             margin: "10px 0",
//             padding: "10px",
//             backgroundColor: "#ffeeee",
//             borderRadius: "4px",
//           }}
//         >
//           Error: {error}
//           <button
//             onClick={() => setError(null)}
//             style={{
//               float: "right",
//               border: "none",
//               background: "none",
//               cursor: "pointer",
//             }}
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//           Loading chat...
//         </div>
//       ) : (
//         <>
//           <div
//             ref={messageContainerRef}
//             className="messages-container"
//             style={{
//               height: "300px",
//               overflowY: "auto",
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginBottom: "10px",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {messages.length === 0 ? (
//               <p>No messages yet. Be the first to send one!</p>
//             ) : (
//               <>
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id || Math.random().toString()}
//                     style={{
//                       alignSelf:
//                         msg.uid === user?.uid ? "flex-end" : "flex-start",
//                       margin: "5px 0",
//                       maxWidth: "70%",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems:
//                         msg.uid === user?.uid ? "flex-end" : "flex-start",
//                     }}
//                   >
//                     <div
//                       style={{
//                         padding: "8px 12px",
//                         backgroundColor:
//                           msg.failed || msg.status === "failed"
//                             ? "#fff1f0"
//                             : msg.uid === user?.uid
//                             ? "#0575E6" // Changed to the requested blue color
//                             : "#f0f0f0",
//                         color: msg.uid === user?.uid ? "white" : "inherit",
//                         borderRadius: "12px",
//                         wordBreak: "break-word",
//                         border:
//                           msg.failed || msg.status === "failed"
//                             ? "1px solid #ffa39e"
//                             : "none",
//                       }}
//                     >
//                       <strong>{msg.displayName || "User"}</strong>
//                       {msg.text && (
//                         <p style={{ margin: "5px 0" }}>{msg.text}</p>
//                       )}

//                       {/* Display attachments */}
//                       {msg.attachments && msg.attachments.length > 0 && (
//                         <div style={{ marginTop: "5px" }}>
//                           {msg.attachments.map((attachment) => (
//                             <div
//                               key={attachment.id}
//                               style={{ margin: "5px 0" }}
//                             >
//                               {attachment.isImage ? (
//                                 <img
//                                   src={attachment.url}
//                                   alt={attachment.name}
//                                   style={{
//                                     maxWidth: "100%",
//                                     borderRadius: "8px",
//                                     cursor: "pointer",
//                                   }}
//                                   onClick={() =>
//                                     window.open(attachment.url, "_blank")
//                                   }
//                                 />
//                               ) : (
//                                 <a
//                                   href={attachment.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     padding: "5px 10px",
//                                     backgroundColor: "#f0f0f0",
//                                     borderRadius: "4px",
//                                     textDecoration: "none",
//                                     color: "#333",
//                                   }}
//                                 >
//                                   <i
//                                     className="fa-solid fa-file"
//                                     style={{ marginRight: "8px" }}
//                                   ></i>
//                                   <div>
//                                     <div>{attachment.name}</div>
//                                     <div
//                                       style={{
//                                         fontSize: "10px",
//                                         color: "#666",
//                                       }}
//                                     >
//                                       {Math.round(attachment.size / 1024)} KB
//                                     </div>
//                                   </div>
//                                 </a>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Timestamp moved outside message bubble */}
//                     <small
//                       style={{
//                         color: "#888",
//                         fontSize: "10px",
//                         marginTop: "2px",
//                         alignSelf:
//                           msg.uid === user?.uid ? "flex-end" : "flex-start",
//                       }}
//                     >
//                       {msg.timestamp?.toDate
//                         ? msg.timestamp
//                             .toDate()
//                             .toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                         : "Sending..."}
//                     </small>

//                     {/* Render message status */}
//                     {renderMessageStatus(msg)}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </>
//             )}
//           </div>

//           {/* Rest of the component remains the same */}
//           {/* Retry all failed messages button (if there are failed messages) */}
//           {failedMessages.length > 0 && (
//             <div
//               style={{
//                 padding: "8px",
//                 borderRadius: "4px",
//                 marginBottom: "10px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <span style={{ color: "#d46b08" }}>
//                 <i
//                   className="fa-solid fa-triangle-exclamation"
//                   style={{ marginRight: "8px" }}
//                 ></i>
//                 {failedMessages.length} message
//                 {failedMessages.length > 1 ? "s" : ""} failed to send
//               </span>
//               <button
//                 onClick={() =>
//                   failedMessages.forEach((msg) => retryMessage(msg.id))
//                 }
//                 disabled={!isOnline}
//                 style={{
//                   padding: "4px 12px",
//                   backgroundColor: isOnline ? "#fa8c16" : "#d9d9d9",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: isOnline ? "pointer" : "not-allowed",
//                 }}
//               >
//                 Retry All
//               </button>
//             </div>
//           )}

//           {/* Attachment preview section */}
//           {attachments.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: "10px",
//                 padding: "10px",
//                 backgroundColor: "#f7f7f7",
//                 borderRadius: "4px",
//                 marginBottom: "10px",
//               }}
//             >
//               {attachments.map((attachment) => (
//                 <div
//                   key={attachment.id}
//                   style={{
//                     position: "relative",
//                     width: attachment.isImage ? "80px" : "120px",
//                     marginBottom: "5px",
//                   }}
//                 >
//                   {attachment.isImage ? (
//                     <img
//                       src={attachment.url}
//                       alt={attachment.name}
//                       style={{
//                         width: "80px",
//                         height: "80px",
//                         objectFit: "cover",
//                         borderRadius: "4px",
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         padding: "10px",
//                         backgroundColor: "#e0e0e0",
//                         borderRadius: "4px",
//                         fontSize: "12px",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       <i
//                         className="fa-solid fa-file"
//                         style={{ marginRight: "5px" }}
//                       ></i>
//                       {attachment.name.length > 10
//                         ? `${attachment.name.substring(0, 10)}...`
//                         : attachment.name}
//                     </div>
//                   )}
//                   <button
//                     onClick={() => removeAttachment(attachment.id)}
//                     style={{
//                       position: "absolute",
//                       top: "-5px",
//                       right: "-5px",
//                       width: "20px",
//                       height: "20px",
//                       borderRadius: "50%",
//                       backgroundColor: "#ff4d4f",
//                       color: "white",
//                       border: "none",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "12px",
//                     }}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Upload progress indicator */}
//           {isUploading && (
//             <div
//               style={{
//                 padding: "10px",
//                 backgroundColor: "#e6f7ff",
//                 borderRadius: "4px",
//                 marginBottom: "10px",
//                 textAlign: "center",
//                 color: "#1890ff",
//               }}
//             >
//               <i
//                 className="fa-solid fa-spinner fa-spin"
//                 style={{ marginRight: "10px" }}
//               ></i>
//               Uploading attachments...
//             </div>
//           )}

//           <form onSubmit={sendMessage} className="form">
//             <div className="input-send">
//               <input
//                 className="input"
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder={
//                   isOnline
//                     ? "Type your message..."
//                     : "Type your message (offline mode)"
//                 }
//               />

//               <button
//                 type="submit"
//                 className={`send-btn ${
//                   (!message.trim() && attachments.length === 0) || isUploading
//                     ? "disabled"
//                     : ""
//                 }`}
//                 disabled={
//                   (!message.trim() && attachments.length === 0) || isUploading
//                 }
//               >
//                 <i className="fa-solid fa-paper-plane"></i>
//               </button>
//               <button   class="menu-button">
//                 <div className="circle"></div>
//                 <div className="circle"></div>
//                 <div className="circle"></div>
//               </button>
//             </div>

//             <div  id="emojidisplay" className="emoji-btn">
//               <button
//                 className="clip-btn attachment-btn"
//                 type="button"
//                 onClick={handleFileUpload}
//                 disabled={isUploading || !isOnline}
//               >
//                 <i className="fa-solid fa-paperclip"></i>
//               </button>

//               <button
//                 className="image-btn attachment-btn"
//                 type="button"
//                 onClick={handleImageUpload}
//                 disabled={isUploading || !isOnline}
//               >
//                 <i className="fa-regular fa-image"></i>
//               </button>

//               <button
//                 className="camera-btn attachment-btn"
//                 type="button"
//                 onClick={handleCameraCapture}
//                 disabled={isUploading || !isOnline}
//               >
//                 <i className="fa-solid fa-camera"></i>
//               </button>
//             </div>

//             {/* Hidden file inputs */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileAttachment}
//               className="hidden-input"
//               multiple
//             />

//             <input
//               type="file"
//               ref={imageInputRef}
//               accept="image/*"
//               onChange={handleFileAttachment}
//               className="hidden-input"
//               multiple
//             />

//             <input
//               type="file"
//               ref={cameraInputRef}
//               accept="image/*"
//               capture="environment"
//               onChange={handleFileAttachment}
//               className="hidden-input"
//             />
//           </form>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               fontSize: "12px",
//               color: "#666",
//               marginTop: "10px",
//             }}
//           >
//             <span>
//               {user
//                 ? `Logged in as: ${
//                     tradesperson.fname ||
//                     user.email ||
//                     `Anonymous (${user.uid.slice(0, 6)}...)`
//                   }`
//                 : "Not logged in"}
//             </span>
//             <span>
//               {isOnline ? (
//                 <span style={{ color: "#52c41a" }}>
//                   <i
//                     className="fa-solid fa-circle"
//                     style={{ fontSize: "8px", marginRight: "5px" }}
//                   ></i>
//                   Connected
//                 </span>
//               ) : (
//                 <span style={{ color: "#ff4d4f" }}>
//                   <i
//                     className="fa-solid fa-circle"
//                     style={{ fontSize: "8px", marginRight: "5px" }}
//                   ></i>
//                   Offline
//                 </span>
//               )}
//             </span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatBox;
