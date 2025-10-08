"use client";

import { useAppContext } from "@/context/AppContext";

export default function Checklist() {
  const { checklist, toggleTask } = useAppContext();

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6 w-full">
      <h2 className="text-md font-semibold mb-4">Checklist</h2>
      <ul className="space-y-2">
        {checklist && checklist.length > 0 ? (
          checklist.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
                className="w-4 h-4"
              />
              <span
                className={`text-sm ${
                  t.done ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {t.task}
              </span>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks yet.</p>
        )}
      </ul>
    </div>
  )
}