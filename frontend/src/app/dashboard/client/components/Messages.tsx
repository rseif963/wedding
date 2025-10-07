"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function Messages() {
  const { bookings, fetchClientBookings, sendMessage, user } = useAppContext();

  const [activeChat, setActiveChat] = useState<{
    vendorId: string;
    vendorName: string;
  } | null>(null);

  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // ✅ Fetch bookings on load
  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  // ✅ Load full conversation when chat opens
  useEffect(() => {
    const loadConversation = async () => {
      if (!activeChat) return;
      try {
        const { data } = await axios.get(`/api/messages/conversation/${activeChat.vendorId}`);
        setChatMessages(data || []);
      } catch (err) {
        console.error("Failed to load conversation:", err);
        setChatMessages([]);
      }
    };
    loadConversation();
  }, [activeChat]);

  const handleSend = async () => {
    if (!activeChat || !chatText.trim()) return;

    // Optimistic UI update
    const newMsg = {
      _id: Date.now().toString(),
      fromUser: { _id: user?._id },
      toVendor: { _id: activeChat.vendorId },
      text: chatText,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    const textToSend = chatText;
    setChatText("");

    // Send to backend
    await sendMessage(activeChat.vendorId, textToSend);

    // Refresh conversation from server
    const { data } = await axios.get(`/api/messages/conversation/${activeChat.vendorId}`);
    setChatMessages(data || []);
  };

  if (activeChat) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col z-50">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setActiveChat(null)} className="mr-3">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-base font-semibold truncate">
            {activeChat.vendorName}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
          {chatMessages.map((m) => {
            const isFromMe = m.fromUser?._id === user?._id;
            return (
              <div
                key={m._id}
                className={`p-2 rounded-lg max-w-[75%] break-words ${
                  isFromMe
                    ? "bg-indigo-600 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {m.text}
              </div>
            );
          })}
          {chatMessages.length === 0 && (
            <p className="text-gray-500 text-sm">No messages yet</p>
          )}
        </div>

        {/* Input */}
        <div className="flex p-3 border-t">
          <input
            type="text"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 rounded-r-lg text-sm"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  // ---- VENDOR LIST (from bookings) ----
  return (
    <div className="bg-white rounded-xl shadow mt-6 p-6 w-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">Messages</h2>
      <ul className="space-y-4 text-sm flex-1 overflow-y-auto">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <li
              key={b._id}
              className="flex justify-between items-start cursor-pointer p-2 rounded-lg hover:bg-gray-100"
              onClick={() =>
                setActiveChat({
                  vendorId: b.vendor.user, // 👈 NOTE: pass vendor.user (userId), not vendor._id
                  vendorName: b.vendor.businessName || b.vendor.email,
                })
              }
            >
              <div>
                <p className="font-medium">
                  {b.vendor.businessName || b.vendor.email}
                </p>
                <p className="text-gray-500 truncate w-48">Tap to chat</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No vendors yet</p>
        )}
      </ul>
    </div>
  );
}
