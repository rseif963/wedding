// src/components/VendorMessages.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

type ActiveChat = { clientId: string; clientName: string };

export default function VendorMessages() {
  const { bookings, fetchVendorBookings, user, fetchMessages, messages = [] } =
    useAppContext();

  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const STORAGE_KEY = "vendor_active_chat";

  // --- Helpers ---
  const extractId = (val: any) => {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (val._id) return val._id;
    if (val.id) return val.id;
    if (val.user)
      return typeof val.user === "string" ? val.user : val.user._id ?? val.user.id;
    return null;
  };

  const getCoupleName = (clientObj: any) => {
    if (!clientObj) return null;
    const getFirst = (str?: string) => (str ? str.split(" ")[0] : null);

    if (clientObj.brideName && clientObj.groomName) {
      return `${getFirst(clientObj.brideName)} & ${getFirst(clientObj.groomName)}`;
    }
    if (clientObj.coupleName) {
      return clientObj.coupleName
        .split("&")
        .map((n: string) => getFirst(n.trim()))
        .join(" & ");
    }
    if (clientObj.name) return getFirst(clientObj.name);
    if (clientObj.email) return clientObj.email;
    return null;
  };

  // --- Effects ---
  useEffect(() => {
    fetchVendorBookings();
  }, [fetchVendorBookings]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ✅ only persist messages, not activeChat
  useEffect(() => {
    if (activeChat) {
      localStorage.setItem(
        `${STORAGE_KEY}_msgs_${activeChat.clientId}`,
        JSON.stringify(chatMessages)
      );
    }
  }, [activeChat, chatMessages]);

  // Sync messages from context → localStorage
  useEffect(() => {
    if (!activeChat?.clientId) return;
    const conv = (messages || []).filter((m: any) => {
      const fromId = m?.fromUser?._id ?? m?.fromUser?.id ?? m?.from;
      const toClientId =
        m?.toClient?._id ??
        m?.toClient?.id ??
        m?.toClientId ??
        m?.toUser?._id ??
        m?.toUser?.id ??
        m?.to;
      return fromId === activeChat.clientId || toClientId === activeChat.clientId;
    });

    conv.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (conv.length) {
      const merged = mergeMessages(conv, chatMessages);
      setChatMessages(merged);
      localStorage.setItem(
        `${STORAGE_KEY}_msgs_${activeChat.clientId}`,
        JSON.stringify(merged)
      );
    }
  }, [messages, activeChat]);

  // --- Helpers ---
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

  // ✅ Fixed: Open chat from booking (no missing route)
  const openChatFromBooking = (b: any) => {
    const clientObj = b.client ?? b.clientProfile ?? b.clientData ?? null;
    const clientId = extractId(
      clientObj?.user ?? clientObj ?? b.client?.user ?? b.client
    );
    const clientName =
      getCoupleName(clientObj) || clientObj?.email || "Client";
    if (!clientId) return;

    setActiveChat({ clientId, clientName });

    // ✅ Instead of calling a non-existing API route,
    // filter conversation from already-fetched messages
    const conv = (messages || []).filter((m: any) => {
      const fromId = m?.fromUser?._id ?? m?.fromUser?.id ?? m?.from;
      const toId =
        m?.toClient?._id ??
        m?.toClient?.id ??
        m?.toClientId ??
        m?.toUser?._id ??
        m?.toUser?.id ??
        m?.to;
      return fromId === clientId || toId === clientId;
    });

    const merged = mergeMessages(conv, chatMessages);
    setChatMessages(merged);
    localStorage.setItem(
      `${STORAGE_KEY}_msgs_${clientId}`,
      JSON.stringify(merged)
    );
  };

  // -------------------- SEND MESSAGE --------------------
  const handleSend = async () => {
    if (!activeChat || !chatText.trim()) return;
    const textToSend = chatText.trim();

    // optimistic message
    const optimistic = {
      _id: Date.now().toString(),
      fromUser: { _id: user?._id ?? user?.id, email: user?.email },
      toUser: { _id: activeChat.clientId },
      text: textToSend,
      createdAt: new Date().toISOString(),
    };

    const updated = [...chatMessages, optimistic];
    setChatMessages(updated);
    localStorage.setItem(
      `${STORAGE_KEY}_msgs_${activeChat.clientId}`,
      JSON.stringify(updated)
    );
    setChatText("");

    try {
      // ✅ save to backend (MongoDB)
      const { data: savedMessage } = await axios.post("/api/messages", {
        toUserId: activeChat.clientId,
        text: textToSend,
      });

      // ✅ replace optimistic with DB message
      const newList = [
        ...updated.filter((m) => m._id !== optimistic._id),
        savedMessage,
      ];
      setChatMessages(newList);
      localStorage.setItem(
        `${STORAGE_KEY}_msgs_${activeChat.clientId}`,
        JSON.stringify(newList)
      );

      // refresh context
      await fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // --- Render ---
  if (activeChat) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col z-50">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setActiveChat(null)} className="mr-3">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-base font-semibold truncate">
            {activeChat.clientName}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
          {chatMessages.map((m) => {
            const fromId = m?.fromUser?._id ?? m?.fromUser?.id ?? m?.from;
            const isFromMe = (user?.id || user?._id) === String(fromId);

            const senderName =
              m?.fromUser?.coupleName ??
              (m?.fromUser?.brideName && m?.fromUser?.groomName
                ? `${m.fromUser.brideName} & ${m.fromUser.groomName}`
                : null) ??
              m?.fromUser?.name ??
              m?.fromUser?.email ??
              (isFromMe ? "You" : activeChat.clientName ?? "Client");

            return (
              <div
                key={m._id ?? `${Math.random()}`}
                className={`p-2 rounded-lg max-w-[75%] break-words ${isFromMe ? "self-end ml-auto text-right" : "self-start"
                  }`}
              >
                {!isFromMe && (
                  <p className="text-xs text-gray-500 mb-1">{senderName}</p>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[75%] break-words ${isFromMe
                      ? "bg-purple-600 text-white self-end ml-auto text-right"
                      : "bg-gray-200 text-gray-800 self-start mr-auto text-left"
                    }`}
                >
                  {m.text}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
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

  return (
    <div className="bg-white rounded-xl shadow mt-6 p-6 w-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">Messages</h2>
      <ul className="space-y-4 text-sm flex-1 overflow-y-auto">
        {bookings.length > 0 ? (
          bookings.map((b: any) => {
            const clientObj =
              b.client ?? b.clientProfile ?? b.clientData ?? null;
            const name =
              getCoupleName(clientObj) ||
              clientObj?.email ||
              clientObj?.name ||
              "Client";
            const clientId = extractId(clientObj?.user ?? clientObj ?? b.client);
            return (
              <li
                key={b._id}
                className="flex justify-between items-start cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                onClick={() => clientId && openChatFromBooking(b)}
              >
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-gray-500 truncate w-48">Tap to chat</p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No clients yet</p>
        )}
      </ul>
    </div>
  );
}
