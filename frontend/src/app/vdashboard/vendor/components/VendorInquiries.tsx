"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Calendar,
} from "lucide-react";

export default function VendorInquiries() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* LEFT - INQUIRIES LIST */}
      <div className="w-[340px] bg-white rounded-2xl p-4 flex flex-col">
        <h2 className="font-semibold mb-3">Inquiries</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search inquiries..."
            className="w-full pl-9 py-2 bg-gray-100 rounded-xl text-sm outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {["All", "New", "Replied", "Archived"].map((f, i) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full text-xs font-medium ${i === 0
                  ? "bg-[#2D157A] text-white"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {[
            {
              name: "Emily & Michael",
              msg:
                "We’re interested in your premium package. Can y...",
              time: "9 hours ago",
              unread: true,
              img: 32,
            },
            {
              name: "Jessica & Ryan",
              msg:
                "Thursday works perfectly! Looking forward to it.",
              time: "1 day ago",
              active: true,
              img: 12,
            },
            {
              name: "Amanda & Chris",
              msg:
                "Yes! Drone coverage is included in our Premium a...",
              time: "3 days ago",
              img: 47,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer ${item.active ? "bg-[#FFF4F4]" : "hover:bg-gray-100"
                }`}
            >
              <img
                src={`https://i.pravatar.cc/100?img=${item.img}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium text-sm">
                  {item.name}
                  {item.unread && (
                    <span className="w-2 h-2 bg-[#5B2DFF] rounded-full" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{item.msg}</p>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  🕒 {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - CHAT PANEL */}
      <div className="flex-1 bg-white rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=12"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-sm">
                Jessica & Ryan
              </div>
              <div className="text-xs text-gray-500">
                jessica.ryan@email.com
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Wedding: May 8, 2025
            </div>
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#FAFAFB]">
          <div className="max-w-[70%] bg-gray-200 rounded-2xl px-4 py-3 text-sm">
            Thank you for the detailed quote! We'd love to
            schedule a call to discuss further.
            <div className="text-xs text-gray-400 mt-1">
              1 day ago
            </div>
          </div>

          <div className="max-w-[70%] ml-auto bg-[#2D157A] text-white rounded-2xl px-4 py-3 text-sm">
            Hi Jessica! I'd be happy to set up a call. How about Thursday at 3 PM?
            <div className="text-xs text-white/70 mt-1">
              23 hours ago
            </div>
          </div>

          <div className="max-w-[70%] bg-gray-200 rounded-2xl px-4 py-3 text-sm">
            Thursday works perfectly! Looking forward to it.
            <div className="text-xs text-gray-400 mt-1">Now</div>
          </div>
        </div>

        {/* Reply Box */}
        <div className="border-t px-6 py-4 flex items-center gap-3 bg-white">
          <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer" />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none"
          />

          <button className="bg-[#2D157A] text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
