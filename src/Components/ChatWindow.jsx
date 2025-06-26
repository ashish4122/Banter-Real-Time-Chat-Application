import { MessageSquareText, PlusIcon, SendIcon, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

function ChatWindow() {
  const params = useParams();
  const [msg, setMsg] = useState("");
  const [secondUser, setSecondUser] = useState();
  const [msgList, setMsgList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { userData } = useAuth();

  const receiverId = params?.chatid;
  const chatId = userData?.id && receiverId
    ? (userData.id > receiverId ? `${userData.id}-${receiverId}` : `${receiverId}-${userData.id}`)
    : null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "";

    setMediaPreview(previewUrl);
    setMedia(file);
    setMediaType(fileType);
  };

  const clearMediaPreview = () => {
    setMediaPreview(null);
    setMedia(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMediaUpload = async () => {
    if (!media || !chatId) return null;

    setIsUploading(true);
    try {
      const timestamp = new Date().getTime();
      const filePath = `media/${chatId}/${timestamp}_${media.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, media);
      const downloadURL = await getDownloadURL(fileRef);

      return {
        url: downloadURL,
        type: mediaType,
        name: media.name
      };
    } catch (error) {
      console.error("Media upload failed:", error);
      alert("Failed to upload media. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMsg = async () => {
    if (!chatId || !userData?.id || !receiverId) return;

    try {
      let mediaData = null;
      if (media) {
        mediaData = await handleMediaUpload();
        if (!mediaData) return;
      }

      if (!msg && !mediaData) return;

      const date = new Date();
      const timeStamp = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const messageData = {
        text: msg,
        time: timeStamp,
        sender: userData.id,
        receiver: receiverId,
      };

      if (mediaData) {
        messageData.media = mediaData.url;
        messageData.mediaType = mediaData.type;
        messageData.fileName = mediaData.name;
      }

      if (msgList?.length === 0) {
        await setDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: [messageData],
        });
      } else {
        await updateDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: arrayUnion(messageData),
        });
      }

      setMsg("");
      clearMediaPreview();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    if (!receiverId || !chatId) return;

    const getUser = async () => {
      try {
        const docRef = doc(db, "users", receiverId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSecondUser(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();

    let msgUnsubscribe;
    try {
      msgUnsubscribe = onSnapshot(doc(db, "user-chats", chatId), (doc) => {
        if (doc.exists()) {
          setMsgList(doc.data()?.messages || []);
        } else {
          setMsgList([]);
        }
      });
    } catch (error) {
      console.error("Error setting up message listener:", error);
      setMsgList([]);
    }

    return () => {
      if (msgUnsubscribe) msgUnsubscribe();
    };
  }, [receiverId, chatId]);

  if (!receiverId)
    return (
      <section className="w-[70%] h-full flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <MessageSquareText className="w-28 h-28 text-gray-500" strokeWidth={1.2} />
        <p className="text-sm text-center text-gray-400">
          select any contact to<br />start a chat with.
        </p>
      </section>
    );

  return (
    <section className="w-[70%] h-full flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl border border-gray-700 shadow-lg">
        {/* Header */}
        <div className="bg-gray-900 py-2 px-4 flex items-center gap-2 shadow-sm rounded-t-2xl border-b border-gray-800">
          <img
            src={secondUser?.profile_pic || "/default-user.png"}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border border-gray-700"
          />
          <div>
            <h3 className="text-white font-semibold">{secondUser?.name || "Loading..."}</h3>
            {secondUser?.lastSeen && (
              <p className="text-xs text-gray-400">
                last seen at {secondUser?.lastSeen}
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow flex flex-col gap-6 p-6 overflow-y-scroll">
          {msgList?.map((m, index) => (
            <div
              key={index}
              data-sender={m.sender === userData?.id}
              className={`w-fit rounded-lg p-3 shadow max-w-[400px] break-words text-sm
                ${m.sender === userData?.id
                  ? "ml-auto bg-teal-700 text-white"
                  : "bg-gray-800 text-gray-200"}
              `}
            >
              {m.media && m.mediaType === "image" && (
                <img
                  src={m.media}
                  alt="Shared"
                  className="max-w-full rounded mb-2 max-h-64 object-contain"
                />
              )}
              {m.media && m.mediaType === "video" && (
                <video
                  src={m.media}
                  controls
                  className="max-w-full rounded mb-2 max-h-64"
                />
              )}
              {m.text && <p>{m.text}</p>}
              {m.fileName && <p className="text-xs text-gray-400 italic mb-1">{m.fileName}</p>}
              <p className="text-xs text-gray-400 text-end">{m?.time}</p>
            </div>
          ))}
        </div>

        {/* Media Preview */}
        {mediaPreview && (
          <div className="bg-gray-800 p-2 relative border-t border-gray-700">
            <button
              onClick={clearMediaPreview}
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-900"
            >
              <X size={16} />
            </button>
            {mediaType === "image" ? (
              <img src={mediaPreview} alt="Preview" className="h-20 object-contain mx-auto rounded" />
            ) : (
              <video src={mediaPreview} className="h-20 object-contain mx-auto rounded" />
            )}
            {isUploading && <p className="text-xs text-center mt-1 text-gray-400">Uploading...</p>}
          </div>
        )}

        {/* Input */}
        <div className="bg-gray-900 py-3 px-6 shadow flex items-center gap-6 rounded-b-2xl border-t border-gray-800">
          <div className="relative">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-teal-400"
              disabled={isUploading}
              title="Browse media"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            className="w-full py-2 px-4 rounded bg-gray-800 text-gray-200 focus:outline-none"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
            disabled={isUploading}
          />

          <button
            onClick={handleSendMsg}
            disabled={isUploading || !chatId || !userData?.id}
            className={(isUploading || !chatId || !userData?.id) ? "opacity-50 cursor-not-allowed" : ""}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;
