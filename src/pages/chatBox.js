import React, { useState, useEffect, useRef } from "react";
import "./chatbox.css";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatBox = ({}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({
    uid: "user-" + Math.random().toString(36).substring(2, 10),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [failedMessages, setFailedMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const retryTimeouts = useRef({});
  const uploadTimeoutRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();

  // Alternative method to get ID from URL
  const location = window.location.pathname;
  console.log("Current path:", location);
  // Try to extract ID from the URL if params.id is undefined
  const pathParts = location.split("/");
  const potentialId = pathParts[pathParts.length - 1];

  const effectiveId = id || potentialId;
  console.log("All URL params:", useParams());
  console.log("ID from params:", id);
  console.log("Using ID:", effectiveId);

  useEffect(() => {
    
    if (!effectiveId || effectiveId === "undefined") {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    console.log("Fetching user with ID:", effectiveId);

    // If your API doesn't support getting single users by ID, fetch all and filter
    axios
      .get(`https://skillhub-api-y3gi.onrender.com/api/users/`)
      .then((response) => {
        console.log("All users data:", response.data);
        // Find the user with the matching ID
        const foundUser = response.data.find(
          (u) =>
            u.id === parseInt(effectiveId) ||
            u.id === effectiveId ||
            u._id === effectiveId
        );

        if (foundUser) {
          console.log("Found user:", foundUser);
          setUserData(foundUser); // Store API user data in state
          // Format the user data to match what HiringartisanPage expects
          const formattedUser = {
            id: foundUser.id || foundUser._id,
            fname: foundUser.full_name ? foundUser.full_name.split(" ")[0] : "",
            lname: foundUser.full_name
              ? foundUser.full_name.split(" ").slice(1).join(" ")
              : "",
            image: foundUser.photoURL || "default-image-url", // Added a default
            expertise: foundUser.areas_of_expertise || "Not specified",
            location: foundUser.address || "Not specified",
            ratings: foundUser.ratings || "No ratings yet",
            verified: foundUser.verified || false,
          };

          // Store the formatted user in sessionStorage for use in HiringartisanPage
          sessionStorage.setItem(
            "selectedTradesPerson",
            JSON.stringify(formattedUser)
          );
        } else {
          setError("User not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      });
  }, [effectiveId]);

  //   // Load sample messages (replacing Firebase)
  //   useEffect(() => {
  //     // Simulate loading messages from backend
  //     setTimeout(() => {
  //       // Sample messages for demonstration
  //       const sampleMessages = [
  //         {
  //           id: "msg1",
  //           text: "Hi there! How can I help with your project?",
  //           uid: "other-user",
  //           timestamp: { toDate: () => new Date(Date.now() - 3600000) },
  //           readBy: ["other-user"],
  //         },
  //         {
  //           id: "msg2",
  //           text: "I'm looking for someone to help with my kitchen renovation.",
  //           uid: user.uid,
  //           timestamp: { toDate: () => new Date(Date.now() - 3000000) },
  //           readBy: [user.uid, "other-user"],
  //         },
  //         {
  //           id: "msg3",
  //           text: "Great, I specialize in kitchen renovations! What's your timeline?",
  //           uid: "other-user",
  //           timestamp: { toDate: () => new Date(Date.now() - 2400000) },
  //           readBy: ["other-user"],
  //         },
  //       ];

  //       setMessages(sampleMessages);
  //       setLoading(false);
  //     }, 1000);
  //   }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-retry failed messages when back online
  useEffect(() => {
    if (isOnline && failedMessages.length > 0) {
      // Wait a moment to ensure connection is stable
      const timeoutId = setTimeout(() => {
        failedMessages.forEach((failedMsg) => {
          retryMessage(failedMsg.id);
        });
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, failedMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFileAttachment = (e) => {
    handleAttachmentUpload(e.target.files);
  };

  const handleAttachmentUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    const newAttachments = [];

    // Set a timeout to prevent infinite loading
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
    }

    uploadTimeoutRef.current = setTimeout(() => {
      if (isUploading) {
        setIsUploading(false);
        setError(
          "Upload timed out. Please try again with a smaller file or check your connection."
        );
      }
    }, 60000); // 1 minute timeout

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        // Simulate file upload
        console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create a local object URL instead of Firebase URL
        const localUrl = URL.createObjectURL(file);
        console.log(`Local URL created for file`);

        newAttachments.push({
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: localUrl,
          isImage: file.type.startsWith("image/"),
        });
      }

      console.log(
        `All files processed, adding ${newAttachments.length} attachments`
      );
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Error handling attachments:", err);
      setError(`Upload Error: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId)
    );
  };

  const retryMessage = async (messageId) => {
    // Find the failed message
    const failedMsg = failedMessages.find((msg) => msg.id === messageId);
    if (!failedMsg) return;

    // Remove from failed messages list
    setFailedMessages((prev) => prev.filter((msg) => msg.id !== messageId));

    // Clear any existing retry timeouts
    if (retryTimeouts.current[messageId]) {
      clearTimeout(retryTimeouts.current[messageId]);
      delete retryTimeouts.current[messageId];
    }

    try {
      // Simulate sending message to backend
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMsgId = `msg-${Date.now()}`;

      // Update message in UI with new ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, id: newMsgId, failed: false, retried: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Error retrying message:", error);

      // Mark as failed again
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, failed: true } : msg
        )
      );

      setFailedMessages((prev) => [
        ...prev.filter((msg) => msg.id !== messageId),
        failedMsg,
      ]);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    // Allow sending message if there's text or attachments
    if (!message.trim() && attachments.length === 0) return;

    const tempId = `temp-${Date.now()}`;
    const currentTime = new Date();
    const newMessage = {
      text: message,
      uid: user.uid,
      timestamp: { toDate: () => currentTime },
      attachments: attachments.length > 0 ? attachments : null,
      readBy: [user.uid], // Mark as read by sender
      sent: currentTime,
    };

    // Optimistic UI update
    const optimisticMsg = {
      ...newMessage,
      id: tempId,
      status: isOnline ? "sending" : "failed",
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMsg]);
    setMessage("");
    setAttachments([]);

    // If offline, add to failed messages queue
    if (!isOnline) {
      setFailedMessages((prev) => [...prev, optimisticMsg]);
      return;
    }

    try {
      // Simulate backend call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMsgId = `msg-${Date.now()}`;

      // Update the message in the UI with the real ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, id: newMsgId, status: "sent" } : msg
        )
      );

      // Simulate the chat partner reading the message after 2 seconds
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsgId
              ? { ...msg, readBy: [...(msg.readBy || []), "other-user"] }
              : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);

      // Mark message as failed in UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed", failed: true } : msg
        )
      );

      // Add to failed messages queue
      setFailedMessages((prev) => [
        ...prev,
        { ...optimisticMsg, failed: true },
      ]);

      // Set up retry mechanism
      const waitTime = Math.min(
        30000,
        Math.pow(2, failedMessages.length) * 1000
      );
      retryTimeouts.current[tempId] = setTimeout(() => {
        if (navigator.onLine) {
          retryMessage(tempId);
        }
      }, waitTime);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePopover = () => {
    console.log("Popover triggered");
  };

  // Render message status indicator
  const renderMessageStatus = (msg) => {
    if (msg.uid !== user?.uid) return null;

    if (msg.failed || msg.status === "failed") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "2px",
            }}
          >
            <span
              style={{ color: "#ff4d4f", fontSize: "11px", marginRight: "5px" }}
            >
              {" "}
              <i className="fa-solid fa-circle-exclamation"></i>Message failed
              to send
            </span>
            <button
              onClick={() => retryMessage(msg.id)}
              style={{
                background: "none",
                border: "none",
                color: "#1890ff",
                cursor: "pointer",
                padding: "0",
                fontSize: "11px",
                textDecoration: "underline",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (msg.status === "sending") {
      return (
        <span style={{ color: "#888", fontSize: "11px" }}>
          <i
            className="fa-solid fa-circle-notch fa-spin"
            style={{ marginRight: "3px" }}
          ></i>
          Sending...
        </span>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: "2px",
        }}
      >
        {msg.readBy && msg.readBy.length > 1 ? (
          <span style={{ color: "#1890ff", fontSize: "11px" }}>
            <i
              className="fa-solid fa-check-double"
              style={{ marginRight: "3px" }}
            ></i>
            Read
          </span>
        ) : (
          <span style={{ color: "#52c41a", fontSize: "11px" }}>
            <i
              className="fa-solid fa-check-double"
              style={{ marginRight: "3px" }}
            ></i>
            Sent
          </span>
        )}
      </div>
    );
  };
  const navigate =useNavigate()
  function changePage(){
    navigate(-1)
      }

  return (
    <div className="chat-container">
      {/* Connection status indicator */}
      {!isOnline && (
        <div
          style={{
            backgroundColor: "#fff1f0",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            className="fa-solid fa-wifi-slash"
            style={{ color: "#ff4d4f", marginRight: "8px" }}
          ></i>
          <span>
            You are offline. Messages will be sent when you reconnect.
          </span>
        </div>
      )}

      {/* Profile Card - Centered */}
      {userData && (
        <div 
        className="chat-header"
          
        >
        
                <button className="left-btn" onClick={changePage}>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.69125 13.494L15.0578 21.8606L12.9288 23.9523L0.976562 12L12.9288 0.047699L15.0578 2.13935L6.69125 10.5059H24.8811V13.494H6.69125Z" fill="black"/>
</svg>

                </button>
          <div 
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <img 
              src={userData.photoURL || "/default-avatar.png"}
              alt={userData.full_name }
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            {userData.isOnline && (
              <span
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  backgroundColor: "#4CAF50",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              ></span>
            )}
             <div >
            <h3 style={{ margin: "0 0 5px 0" }}>
              {userData.full_name || "Unknown User"}
            </h3>
            <p style={{ margin: "0", color: "#666" }}>
              {userData.skill || "Not specified"}
            </p>
           
          </div>

          </div>

         
          <button
            className="threedots"
            onClick={handlePopover}
            style={{
           
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              
            }}
          >
            <div
              className="circle"
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "#666",
                borderRadius: "50%",
                marginBottom: "4px",
              }}
            ></div>
            <div
              className="circle"
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "#666",
                borderRadius: "50%",
                marginBottom: "4px",
              }}
            ></div>
            <div
              className="circle"
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "#666",
                borderRadius: "50%",
              }}
            ></div>
          </button>
        </div>
      )}

      {/* Profile display for empty chat */}
      {userData && messages.length === 0 && (
        <div className="profile-d">
          <img
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={userData.photoURL || "/default-avatar.png"}
            alt={userData.full_name || "User"}
          />
          {userData.isOnline && <span>online</span>}
          <h3 style={{ margin: "0 0 5px 0" }}>
            Start chatting with {userData.full_name}
          </h3>
        </div>
      )}

      {error && (
        <div
          style={{
            color: "red",
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#ffeeee",
            borderRadius: "4px",
          }}
        >
          Error: {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: "right",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading chat...
        </div>
      ) : (
        <>
          <div
            ref={messageContainerRef}
            className="messages-container"
            style={{
              height: "300px",
              overflowY: "auto",
              border: "none",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 0 ? (
              <p>No messages yet. Be the first to send one!</p>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id || Math.random().toString()}
                    style={{
                      alignSelf:
                        msg.uid === user?.uid ? "flex-end" : "flex-start",
                      margin: "5px 0",
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        msg.uid === user?.uid ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        backgroundColor:
                          msg.failed || msg.status === "failed"
                            ? "#fff1f0"
                            : msg.uid === user?.uid
                            ? "#0575E6" // Changed to the requested blue color
                            : "#f0f0f0",
                        color: msg.uid === user?.uid ? "white" : "inherit",
                        borderRadius: "12px",
                        wordBreak: "break-word",
                        border:
                          msg.failed || msg.status === "failed"
                            ? "1px solid #ffa39e"
                            : "none",
                      }}
                    >
                      <strong>{msg.displayName || "User"}</strong>
                      {msg.text && (
                        <p style={{ margin: "5px 0" }}>{msg.text}</p>
                      )}

                      {/* Display attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ marginTop: "5px" }}>
                          {msg.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              style={{ margin: "5px 0" }}
                            >
                              {attachment.isImage ? (
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  style={{
                                    maxWidth: "100%",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    window.open(attachment.url, "_blank")
                                  }
                                />
                              ) : (
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "5px 10px",
                                    backgroundColor: "#f0f0f0",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    color: "#333",
                                  }}
                                >
                                  <i
                                    className="fa-solid fa-file"
                                    style={{ marginRight: "8px" }}
                                  ></i>
                                  <div>
                                    <div>{attachment.name}</div>
                                    <div
                                      style={{
                                        fontSize: "10px",
                                        color: "#666",
                                      }}
                                    >
                                      {Math.round(attachment.size / 1024)} KB
                                    </div>
                                  </div>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp moved outside message bubble */}
                    <small
                      style={{
                        color: "#888",
                        fontSize: "10px",
                        marginTop: "2px",
                        alignSelf:
                          msg.uid === user?.uid ? "flex-end" : "flex-start",
                      }}
                    >
                      {msg.timestamp?.toDate
                        ? msg.timestamp.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Sending..."}
                    </small>

                    {/* Render message status */}
                    {renderMessageStatus(msg)}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Retry all failed messages button (if there are failed messages) */}
          {failedMessages.length > 0 && (
            <div
              style={{
                padding: "8px",
                borderRadius: "4px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#d46b08" }}>
                <i
                  className="fa-solid fa-triangle-exclamation"
                  style={{ marginRight: "8px" }}
                ></i>
                {failedMessages.length} message
                {failedMessages.length > 1 ? "s" : ""} failed to send
              </span>
              <button
                onClick={() =>
                  failedMessages.forEach((msg) => retryMessage(msg.id))
                }
                disabled={!isOnline}
                style={{
                  padding: "4px 12px",
                  backgroundColor: isOnline ? "#fa8c16" : "#d9d9d9",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isOnline ? "pointer" : "not-allowed",
                }}
              >
                Retry All
              </button>
            </div>
          )}

          {/* Attachment preview section */}
          {attachments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
                backgroundColor: "#f7f7f7",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            >
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  style={{
                    position: "relative",
                    width: attachment.isImage ? "80px" : "120px",
                    marginBottom: "5px",
                  }}
                >
                  {attachment.isImage ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        fontSize: "12px",
                        wordBreak: "break-word",
                      }}
                    >
                      <i
                        className="fa-solid fa-file"
                        style={{ marginRight: "5px" }}
                      ></i>
                      {attachment.name.length > 10
                        ? `${attachment.name.substring(0, 10)}...`
                        : attachment.name}
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload progress indicator */}
          {isUploading && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#e6f7ff",
                borderRadius: "4px",
                marginBottom: "10px",
                textAlign: "center",
                color: "#1890ff",
              }}
            >
              <i
                className="fa-solid fa-spinner fa-spin"
                style={{ marginRight: "10px" }}
              ></i>
              Uploading attachments...
            </div>
          )}

          <form onSubmit={sendMessage} className="form">
            <div className="input-send">
              <input
                className="input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isOnline
                    ? "Type your message..."
                    : "Type your message (offline mode)"
                }
              />

              <button
                type="submit"
                className={`send-btn ${
                  (!message.trim() && attachments.length === 0) || isUploading
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  (!message.trim() && attachments.length === 0) || isUploading
                }
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
              <div className="all-emojis">
                <button
                  className="option-btn"
                  onClick={handleFileUpload}
                  disabled={isUploading || !isOnline}
                >
                  <svg
                    width="13"
                    height="20"
                    viewBox="0 0 13 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8139 13.6871C12.8139 15.3914 12.2157 16.8417 11.0195 18.038C9.8232 19.2342 8.37293 19.8324 6.66866 19.8324C4.96438 19.8324 3.51411 19.2342 2.31784 18.038C1.12157 16.8417 0.523438 15.3914 0.523438 13.6871V4.59222C0.523438 3.36318 0.953603 2.31849 1.81393 1.45816C2.67426 0.597829 3.71895 0.167664 4.94799 0.167664C6.17704 0.167664 7.22173 0.597829 8.08206 1.45816C8.94239 2.31849 9.37255 3.36318 9.37255 4.59222V13.1955C9.37255 13.9493 9.11036 14.5884 8.58596 15.1128C8.06157 15.6372 7.42247 15.8994 6.66866 15.8994C5.91484 15.8994 5.27574 15.6372 4.75135 15.1128C4.22696 14.5884 3.96476 13.9493 3.96476 13.1955V4.1006H5.93123V13.1955C5.93123 13.4086 6.00088 13.5847 6.14017 13.724C6.27946 13.8633 6.45562 13.933 6.66866 13.933C6.88169 13.933 7.05785 13.8633 7.19714 13.724C7.33644 13.5847 7.40608 13.4086 7.40608 13.1955V4.59222C7.38969 3.90396 7.14798 3.32221 6.68095 2.84698C6.21391 2.37175 5.63626 2.13413 4.94799 2.13413C4.25973 2.13413 3.67798 2.37175 3.20275 2.84698C2.72752 3.32221 2.48991 3.90396 2.48991 4.59222V13.6871C2.47352 14.8506 2.87501 15.838 3.69437 16.6491C4.51373 17.4603 5.50516 17.8659 6.66866 17.8659C7.81576 17.8659 8.7908 17.4603 9.59378 16.6491C10.3968 15.838 10.8146 14.8506 10.8474 13.6871V4.1006H12.8139V13.6871Z"
                      fill="black"
                    />
                  </svg>
                </button>

                <button
                  className="option-btn"
                  onClick={handleImageUpload}
                  disabled={isUploading || !isOnline}
                >
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.33756 17.8491C1.79678 17.8491 1.33384 17.6566 0.948744 17.2715C0.563644 16.8864 0.371094 16.4234 0.371094 15.8826V2.11735C0.371094 1.57657 0.563644 1.11363 0.948744 0.728529C1.33384 0.343429 1.79678 0.150879 2.33756 0.150879H16.1028C16.6436 0.150879 17.1066 0.343429 17.4917 0.728529C17.8768 1.11363 18.0693 1.57657 18.0693 2.11735V15.8826C18.0693 16.4234 17.8768 16.8864 17.4917 17.2715C17.1066 17.6566 16.6436 17.8491 16.1028 17.8491H2.33756ZM2.33756 15.8826H16.1028V2.11735H2.33756V15.8826ZM3.3208 13.9162H15.1196L11.4325 8.99999L8.48278 12.9329L6.2705 9.98323L3.3208 13.9162Z"
                      fill="black"
                    />
                  </svg>
                </button>

                <button
                  className="option-btn"
                  onClick={handleCameraCapture}
                  disabled={isUploading || !isOnline}
                >
                  <svg
                    width="21"
                    height="19"
                    viewBox="0 0 21 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6859 14.609C11.9149 14.609 12.9596 14.1788 13.8199 13.3185C14.6803 12.4581 15.1104 11.4135 15.1104 10.1844C15.1104 8.95537 14.6803 7.91068 13.8199 7.05035C12.9596 6.19002 11.9149 5.75986 10.6859 5.75986C9.45682 5.75986 8.41213 6.19002 7.5518 7.05035C6.69147 7.91068 6.26131 8.95537 6.26131 10.1844C6.26131 11.4135 6.69147 12.4581 7.5518 13.3185C8.41213 14.1788 9.45682 14.609 10.6859 14.609ZM10.6859 12.6425C9.9976 12.6425 9.41585 12.4049 8.94062 11.9297C8.46539 11.4544 8.22778 10.8727 8.22778 10.1844C8.22778 9.49615 8.46539 8.9144 8.94062 8.43917C9.41585 7.96394 9.9976 7.72633 10.6859 7.72633C11.3741 7.72633 11.9559 7.96394 12.4311 8.43917C12.9063 8.9144 13.1439 9.49615 13.1439 10.1844C13.1439 10.8727 12.9063 11.4544 12.4311 11.9297C11.9559 12.4049 11.3741 12.6425 10.6859 12.6425ZM2.81999 18.0503C2.27921 18.0503 1.81627 17.8577 1.43117 17.4726C1.04607 17.0875 0.853516 16.6246 0.853516 16.0838V4.285C0.853516 3.74423 1.04607 3.28129 1.43117 2.89619C1.81627 2.51109 2.27921 2.31854 2.81999 2.31854H5.91717L7.73616 0.352066H13.6356L15.4546 2.31854H18.5517C19.0925 2.31854 19.5555 2.51109 19.9406 2.89619C20.3257 3.28129 20.5182 3.74423 20.5182 4.285V16.0838C20.5182 16.6246 20.3257 17.0875 19.9406 17.4726C19.5555 17.8577 19.0925 18.0503 18.5517 18.0503H2.81999ZM2.81999 16.0838H18.5517V4.285H14.5696L12.7752 2.31854H8.59649L6.80209 4.285H2.81999V16.0838Z"
                      fill="black"
                    />
                  </svg>
                </button>
              </div>
              <button
                className="menu-button"
                onClick={() => setOpenModal(true)}
                aria-label="Open attachment options"
              >
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </button>
              
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileAttachment}
              className="hidden-input"
              multiple
            />
            <div className="attachment-container">
              {/* Menu button */}

              {/* Quick attachment button */}

              {/* Modal overlay */}
              {openModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setOpenModal(false)}
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-header">
                      <h3>Choose Attachment Type</h3>
                      <button
                        className="close-btn"
                        onClick={() => setOpenModal(false)}
                        aria-label="Close modal"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>

                    <div className="attachment-options">
                      <button
                        className="option-btn"
                        onClick={handleFileUpload}
                        disabled={isUploading || !isOnline}
                      >
                        <svg
                          width="13"
                          height="20"
                          viewBox="0 0 13 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.8139 13.6871C12.8139 15.3914 12.2157 16.8417 11.0195 18.038C9.8232 19.2342 8.37293 19.8324 6.66866 19.8324C4.96438 19.8324 3.51411 19.2342 2.31784 18.038C1.12157 16.8417 0.523438 15.3914 0.523438 13.6871V4.59222C0.523438 3.36318 0.953603 2.31849 1.81393 1.45816C2.67426 0.597829 3.71895 0.167664 4.94799 0.167664C6.17704 0.167664 7.22173 0.597829 8.08206 1.45816C8.94239 2.31849 9.37255 3.36318 9.37255 4.59222V13.1955C9.37255 13.9493 9.11036 14.5884 8.58596 15.1128C8.06157 15.6372 7.42247 15.8994 6.66866 15.8994C5.91484 15.8994 5.27574 15.6372 4.75135 15.1128C4.22696 14.5884 3.96476 13.9493 3.96476 13.1955V4.1006H5.93123V13.1955C5.93123 13.4086 6.00088 13.5847 6.14017 13.724C6.27946 13.8633 6.45562 13.933 6.66866 13.933C6.88169 13.933 7.05785 13.8633 7.19714 13.724C7.33644 13.5847 7.40608 13.4086 7.40608 13.1955V4.59222C7.38969 3.90396 7.14798 3.32221 6.68095 2.84698C6.21391 2.37175 5.63626 2.13413 4.94799 2.13413C4.25973 2.13413 3.67798 2.37175 3.20275 2.84698C2.72752 3.32221 2.48991 3.90396 2.48991 4.59222V13.6871C2.47352 14.8506 2.87501 15.838 3.69437 16.6491C4.51373 17.4603 5.50516 17.8659 6.66866 17.8659C7.81576 17.8659 8.7908 17.4603 9.59378 16.6491C10.3968 15.838 10.8146 14.8506 10.8474 13.6871V4.1006H12.8139V13.6871Z"
                            fill="black"
                          />
                        </svg>
                      </button>

                      <button
                        className="option-btn"
                        onClick={handleImageUpload}
                        disabled={isUploading || !isOnline}
                      >
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.33756 17.8491C1.79678 17.8491 1.33384 17.6566 0.948744 17.2715C0.563644 16.8864 0.371094 16.4234 0.371094 15.8826V2.11735C0.371094 1.57657 0.563644 1.11363 0.948744 0.728529C1.33384 0.343429 1.79678 0.150879 2.33756 0.150879H16.1028C16.6436 0.150879 17.1066 0.343429 17.4917 0.728529C17.8768 1.11363 18.0693 1.57657 18.0693 2.11735V15.8826C18.0693 16.4234 17.8768 16.8864 17.4917 17.2715C17.1066 17.6566 16.6436 17.8491 16.1028 17.8491H2.33756ZM2.33756 15.8826H16.1028V2.11735H2.33756V15.8826ZM3.3208 13.9162H15.1196L11.4325 8.99999L8.48278 12.9329L6.2705 9.98323L3.3208 13.9162Z"
                            fill="black"
                          />
                        </svg>
                      </button>

                      <button
                        className="option-btn"
                        onClick={handleCameraCapture}
                        disabled={isUploading || !isOnline}
                      >
                        <svg
                          width="21"
                          height="19"
                          viewBox="0 0 21 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.6859 14.609C11.9149 14.609 12.9596 14.1788 13.8199 13.3185C14.6803 12.4581 15.1104 11.4135 15.1104 10.1844C15.1104 8.95537 14.6803 7.91068 13.8199 7.05035C12.9596 6.19002 11.9149 5.75986 10.6859 5.75986C9.45682 5.75986 8.41213 6.19002 7.5518 7.05035C6.69147 7.91068 6.26131 8.95537 6.26131 10.1844C6.26131 11.4135 6.69147 12.4581 7.5518 13.3185C8.41213 14.1788 9.45682 14.609 10.6859 14.609ZM10.6859 12.6425C9.9976 12.6425 9.41585 12.4049 8.94062 11.9297C8.46539 11.4544 8.22778 10.8727 8.22778 10.1844C8.22778 9.49615 8.46539 8.9144 8.94062 8.43917C9.41585 7.96394 9.9976 7.72633 10.6859 7.72633C11.3741 7.72633 11.9559 7.96394 12.4311 8.43917C12.9063 8.9144 13.1439 9.49615 13.1439 10.1844C13.1439 10.8727 12.9063 11.4544 12.4311 11.9297C11.9559 12.4049 11.3741 12.6425 10.6859 12.6425ZM2.81999 18.0503C2.27921 18.0503 1.81627 17.8577 1.43117 17.4726C1.04607 17.0875 0.853516 16.6246 0.853516 16.0838V4.285C0.853516 3.74423 1.04607 3.28129 1.43117 2.89619C1.81627 2.51109 2.27921 2.31854 2.81999 2.31854H5.91717L7.73616 0.352066H13.6356L15.4546 2.31854H18.5517C19.0925 2.31854 19.5555 2.51109 19.9406 2.89619C20.3257 3.28129 20.5182 3.74423 20.5182 4.285V16.0838C20.5182 16.6246 20.3257 17.0875 19.9406 17.4726C19.5555 17.8577 19.0925 18.0503 18.5517 18.0503H2.81999ZM2.81999 16.0838H18.5517V4.285H14.5696L12.7752 2.31854H8.59649L6.80209 4.285H2.81999V16.0838Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>

                    {isUploading && (
                      <div className="upload-indicator">
                        <div className="spinner"></div>
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttachment}
                className="hidden-input"
                multiple
              />

              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleFileAttachment}
                className="hidden-input"
                multiple
              />

              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileAttachment}
                className="hidden-input"
              />
            </div>
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleFileAttachment}
              className="hidden-input"
              multiple
            />

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileAttachment}
              className="hidden-input"
            />
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBox;
