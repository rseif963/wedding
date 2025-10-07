// src/app/planning/page.tsx
"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Calculator, ListCheck, Users, HeartHandshake, Table } from "lucide-react";
import Link from "next/link";

export default function PlanningTools() {
  const tools = [
    {
      title: "Budget Calculator",
      desc: "Plan your wedding expenses and stay on track with your budget.",
      icon: <Calculator className="w-10 h-10 text-[#311970]" />,
      link: "/planning/budget",
    },
    {
      title: "Checklist",
      desc: "Keep track of every task from engagement to wedding day.",
      icon: <ListCheck className="w-10 h-10 text-[#311970]" />,
      link: "/planning/checklist",
    },
    {
      title: "Guest List",
      desc: "Manage your invitations, RSVPs, and seating chart easily.",
      icon: <Users className="w-10 h-10 text-[#311970]" />,
      link: "/planning/guests",
    },
    {
      title: "Seating Planner",
      desc: "Organize your seating arrangement for the big day.",
      icon: <Table className="w-10 h-10 text-[#311970]" />,
      link: "/planning/seating",
    },
    {
      title: "Vendor Shortlist",
      desc: "Save and compare your favorite wedding vendors in one place.",
      icon: <HeartHandshake className="w-10 h-10 text-[#311970]" />,
      link: "/planning/vendors",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50"> 
        <Navbar />
     <div className="max-w-6xl mx-auto text-center py-4 mb-12">
        <h1 className="text-3xl font-bold text-[#311970] mb-4">Wedding Planning Tools</h1>
        <p className="text-gray-600 text-am">
          Organize, plan, and simplify your wedding journey with our free tools.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tools.map((tool, i) => (
          <Link
            key={i}
            href={tool.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <div className="mb-4">{tool.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
            <p className="text-gray-600">{tool.desc}</p>
          </Link>
        ))}
      </div>
      <Footer/>
    </main>
  );
}
