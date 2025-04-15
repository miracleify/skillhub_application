// firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVOmP9CwdqvJ6CjG5bJF45WVNyvbOKwQo",
  authDomain: "skillhub-26.firebaseapp.com",
  projectId: "skillhub-26",
  storageBucket: "skillhub-26.appspot.com",
  messagingSenderId: "238604113247",
  appId: "1:238604113247:web:c5189d0bac185af621d2ea",
  measurementId: "G-3416NKELYS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

/**
 * Sign in user anonymously
 */
const signInAnonymousUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Signed in anonymously:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Optional storage path
 * @returns {Promise<string>} Download URL
 */
const uploadFile = async (file, path = null) => {
  try {
    if (!auth.currentUser) {
      await signInAnonymousUser();
    }
    
    const userId = auth.currentUser.uid;
    const timestamp = Date.now();
    const filePath = path || `uploads/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    console.log("File uploaded successfully");
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Send a new message or a reply with optional attachment
 * @param {string} text
 * @param {Object|null} attachment - Optional file attachment
 * @param {string|null} replyToMessageId
 */
const sendMessage = async (text, attachment = null, replyToMessageId = null) => {
  try {
    if (!auth.currentUser) {
      await signInAnonymousUser();
    }

    const messageData = {
      text,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || "Anonymous User",
      timestamp: serverTimestamp(),
      isReply: Boolean(replyToMessageId),
    };

    // Add attachment data if provided
    if (attachment) {
      messageData.attachment = attachment;
    }

    // Handle replies
    if (replyToMessageId) {
      const originalMessageRef = doc(db, "messages", replyToMessageId);
      const originalSnap = await getDoc(originalMessageRef);

      if (originalSnap.exists()) {
        const original = originalSnap.data();
        messageData.replyToMessageId = replyToMessageId;
        messageData.replyToMessagePreview = {
          text: original.text || "",
          senderId: original.senderId || "",
          senderName: original.senderName || "Unknown",
        };
      }
    }

    const docRef = await addDoc(collection(db, "messages"), messageData);
    console.log("Message sent with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Subscribe to messages in real time
 * @param {(messages: object[]) => void} callback
 * @returns {() => void} Unsubscribe function
 */
const subscribeToMessages = (callback) => {
  const messagesQuery = query(
    collection(db, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));

    callback(messages);
  });
};

/**
 * Get a single message by ID
 * @param {string} messageId
 * @returns {Promise<object|null>}
 */
const getMessageById = async (messageId) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    const messageSnap = await getDoc(messageRef);

    if (messageSnap.exists()) {
      return {
        id: messageSnap.id,
        ...messageSnap.data(),
        timestamp: messageSnap.data().timestamp?.toDate() || new Date(),
      };
    } else {
      console.warn("No such message found.");
      return null;
    }
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
};

export {
  db,
  auth,
  storage,
  signInAnonymousUser,
  sendMessage,
  subscribeToMessages,
  getMessageById,
  uploadFile,
};