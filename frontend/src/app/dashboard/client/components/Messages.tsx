"use client";

import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Send, Paperclip, Search, X } from "lucide-react";

type ActiveChat = { userId: string; userName: string; role: "vendor" | "client" };

export default function ClientMessages() {
  const {
    bookings,
    user,
    messages: contextMessages = [],
    fetchMessages,
    sendMessage,
    fetchConversation,
    socket,
  } = useAppContext();

  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [fileToSend, setFileToSend] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "client_active_chat";

  const extractId = (val: any) => {
    if (!val) return null;
    if (val._id) return val._id;
    if (val.user?._id) return val.user._id;
    if (val.id) return val.id;
    return null;
  };

  const getUserName = (userObj: any) => {
    if (!userObj) return "User";
    return userObj.businessName || userObj.name || userObj.email || "User";
  };

  const mergeMessages = (fresh: any[], cached: any[]) => {
    const map = new Map();
    [...cached, ...fresh].forEach((m) => map.set(m._id ?? m.id ?? Math.random().toString(), m));
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  // 🔹 Fetch all messages + socket listener
  useEffect(() => {
    fetchMessages();
    if (socket) {
      socket.on("receiveMessage", (msg: any) => {
        if (
          activeChat &&
          (msg.sender?.id === activeChat.userId || msg.receiver?.id === activeChat.userId)
        ) {
          setChatMessages((prev) => [...prev, msg]);
        }
      });
    }
    return () => {
      if (socket) socket.off("receiveMessage");
    };
  }, [fetchMessages, socket, activeChat]);

  // 🔹 Merge context + local messages
  useEffect(() => {
    if (!activeChat?.userId) return;
    const conv = contextMessages.filter((m: any) => {
      const fromId = m.sender?.id;
      const toId = m.receiver?.id;
      return fromId === activeChat.userId || toId === activeChat.userId;
    });

    const merged = mergeMessages(conv, chatMessages);
    setChatMessages(merged);
    localStorage.setItem(`${STORAGE_KEY}_msgs_${activeChat.userId}`, JSON.stringify(merged));
  }, [contextMessages, activeChat]);

  // 🔹 Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 🔹 Open chat
  const openChat = async (chatUser: any) => {
    const userId = extractId(chatUser);
    if (!userId) return;

    const role = chatUser.businessName ? "vendor" : "client";
    const userName = getUserName(chatUser);
    setActiveChat({ userId, userName, role });

    // Load cached messages first
    const cached = localStorage.getItem(`${STORAGE_KEY}_msgs_${userId}`);
    const cachedMessages = cached ? JSON.parse(cached) : [];
    setChatMessages(cachedMessages);

    // Fetch latest conversation
    try {
      const fetchedMessages = await fetchConversation(userId);
      const merged = mergeMessages(fetchedMessages, cachedMessages);
      setChatMessages(merged);
      localStorage.setItem(`${STORAGE_KEY}_msgs_${userId}`, JSON.stringify(merged));
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  // 🔹 Send message
  const handleSend = async () => {
    if (!activeChat || (!chatText.trim() && !fileToSend)) return;

    try {
      const sent = await sendMessage(
        activeChat.userId,
        chatText.trim(),
        fileToSend,
        
      );
      if (sent) setChatMessages((prev) => [...prev, sent]);

      setChatText("");
      setFileToSend(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // 🔹 File selection & preview
  const handleFileSelect = (file: File) => {
    setFileToSend(file);
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          activeChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 bg-white`}
      >
        <div className="flex items-center justify-between p-3 border-b bg-gray-100">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Search className="text-gray-500" size={18} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {bookings.map((b: any) => {
            const vendorObj = b.vendor ?? b.vendorProfile ?? b.vendorData ?? null;
            const name = getUserName(vendorObj);
            const userId = extractId(vendorObj);
            if (!userId) return null;
            return (
              <div
                key={b._id}
                onClick={() => openChat(vendorObj)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 border-b border-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {contextMessages
                      .filter(
                        (m: any) =>
                          m.sender?.id === userId || m.receiver?.id === userId
                      )
                      .slice(-1)[0]?.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat && (
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b bg-gray-100">
            <button
              onClick={() => setActiveChat(null)}
              className="md:hidden text-gray-700"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="font-medium text-sm">{activeChat.userName}</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {chatMessages.map((m) => {
              const fromId = m.sender?.id ?? m.fromUser?._id ?? m.fromUser?.id;
              const isFromMe = String(user?.id || user?._id) === String(fromId);

              return (
                <div
                  key={m._id ?? Math.random()}
                  className={`flex flex-col mb-3 ${
                    isFromMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[75%] shadow-sm ${
                      isFromMe
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {m.text && <p className="text-sm">{m.text}</p>}
                    {m.mediaUrl && m.mediaType === "image" && (
                      <img
                        src={m.mediaUrl}
                        alt="sent media"
                        className="rounded-lg mt-1 max-w-full"
                      />
                    )}
                    {m.mediaUrl && m.mediaType === "video" && (
                      <video
                        src={m.mediaUrl}
                        controls
                        className="rounded-lg mt-1 max-w-full"
                      />
                    )}
                    {m.mediaUrl && m.mediaType === "audio" && (
                      <audio src={m.mediaUrl} controls className="mt-1 w-full" />
                    )}
                    {m.mediaUrl && m.mediaType === "file" && (
                      <a
                        href={m.mediaUrl}
                        target="_blank"
                        className="block mt-1 underline text-xs"
                      >
                        Download File
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="p-3 border-t bg-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setFileToSend(null);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t bg-gray-100">
            <label className="cursor-pointer text-gray-600 hover:text-purple-600">
              <Paperclip size={20} />
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFileSelect(e.target.files[0])
                }
              />
            </label>
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 px-3 py-2 rounded-full bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
