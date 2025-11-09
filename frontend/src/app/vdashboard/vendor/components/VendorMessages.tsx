"use client";

import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Send, Paperclip, Search, X } from "lucide-react";

type ActiveChat = { clientId: string; clientName: string };

export default function VendorMessages() {
  const {
    bookings,
    user,
    messages: contextMessages = [],
    fetchMessages,
    sendMessage,
    socket,
  } = useAppContext();

  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [fileToSend, setFileToSend] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = "vendor_active_chat";

  // ✅ Extract Profile ID, fallback to user ID
  const extractId = (val: any) => {
    if (!val) return null;
    if (val._id) return val._id;
    if (val.user?._id) return val.user._id;
    if (val.id) return val.id;
    return null;
  };

  const getCoupleName = (clientObj: any) => {
    if (!clientObj) return "Client";
    const getFirst = (str?: string) => (str ? str.split(" ")[0] : null);
    if (clientObj.brideName && clientObj.groomName)
      return `${getFirst(clientObj.brideName)} & ${getFirst(clientObj.groomName)}`;
    if (clientObj.coupleName)
      return clientObj.coupleName
        .split("&")
        .map((n: string) => getFirst(n.trim()))
        .join(" & ");
    if (clientObj.name) return getFirst(clientObj.name);
    if (clientObj.email) return clientObj.email;
    return "Client";
  };

  const mergeMessages = (fresh: any[], cached: any[]) => {
    const map = new Map();
    [...cached, ...fresh].forEach((m) =>
      map.set(m._id ?? m.id ?? Math.random().toString(), m)
    );
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  // 🔹 Fetch messages + socket listener
  useEffect(() => {
    fetchMessages();
    if (socket) {
      socket.on("receiveMessage", (msg: any) => {
        if (
          activeChat &&
          (msg.sender?.id === activeChat.clientId || msg.receiver?.id === activeChat.clientId)
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
    if (!activeChat?.clientId) return;
    const conv = contextMessages.filter((m: any) => {
      const fromId = m.sender?.id ?? m.fromUser?._id ?? m.fromUser?.id;
      const toId = m.receiver?.id ?? m.toClient?._id ?? m.toClient?.id ?? m.toUser?._id ?? m.toUser?.id;
      return fromId === activeChat.clientId || toId === activeChat.clientId;
    });

    const merged = mergeMessages(conv, chatMessages);
    setChatMessages(merged);
    localStorage.setItem(
      `${STORAGE_KEY}_msgs_${activeChat.clientId}`,
      JSON.stringify(merged)
    );
  }, [contextMessages, activeChat]);

  // 🔹 Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 🔹 Open chat and load cached messages
  const openChat = (clientObj: any) => {
    const clientId = extractId(clientObj);
    if (!clientId) return;
    const clientName = getCoupleName(clientObj);
    setActiveChat({ clientId, clientName });

    const cached = localStorage.getItem(`${STORAGE_KEY}_msgs_${clientId}`);
    if (cached) setChatMessages(JSON.parse(cached));
  };

  // 🔹 Send message
  const handleSend = async () => {
    if (!activeChat || (!chatText.trim() && !fileToSend)) return;

    try {
      const sent = await sendMessage(activeChat.clientId, chatText.trim(), fileToSend);
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
        className={`${activeChat ? "hidden md:flex" : "flex"
          } flex-col w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 bg-white`}
      >
        <div className="flex items-center justify-between p-3 border-b bg-gray-100">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Search className="text-gray-500" size={18} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {bookings.map((b: any) => {
            const clientObj = b.client ?? b.clientProfile ?? b.clientData ?? null;
            const name = getCoupleName(clientObj);
            const clientId = extractId(clientObj);
            if (!clientId) return null;
            return (
              <div
                key={b._id}
                onClick={() => openChat(clientObj)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 border-b border-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {contextMessages
                      .filter(
                        (m: any) =>
                          m.sender?.id === clientId || m.receiver?.id === clientId
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
            <h2 className="font-medium text-sm">{activeChat.clientName}</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {chatMessages.map((m) => {
              const fromId = m.sender?.id ?? m.fromUser?._id ?? m.fromUser?.id;
              const isFromMe = String(user?.id || user?._id) === String(fromId);

              return (
                <div
                  key={m._id ?? Math.random()}
                  className={`flex flex-col mb-3 ${isFromMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[75%] shadow-sm ${isFromMe ? "bg-purple-600 text-white" : "bg-white text-gray-900"
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
                      <video src={m.mediaUrl} controls className="rounded-lg mt-1 max-w-full" />
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
                      ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
