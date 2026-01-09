"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Calendar } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
  completed: boolean;
  createdAt: string;
}

export default function ChecklistPreview() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tasks");
      if (stored) setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Toggle completed
  const toggleCompleted = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t._id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Sort tasks newest first
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const completedTasks = sortedTasks.filter((t) => t.completed);
  const incompleteTasks = sortedTasks.filter((t) => !t.completed);

  return (
    <div className="bg-gray-50 p-6 rounded-2xl h-[100vh] overflow-y-auto">
      <h1 className="text-3xl font-bold text-[#311970] mb-4">Checklist Preview</h1>

      {/* Completed Tasks */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="text-green-600" /> Completed ({completedTasks.length})
        </h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-400">No completed tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {completedTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task._id)}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="line-through text-gray-700 font-semibold">
                    {task.title}
                  </span>
                </div>
                {task.dueDate && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Incomplete Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming Tasks ({incompleteTasks.length})</h2>
        {incompleteTasks.length === 0 ? (
          <p className="text-gray-400">No incomplete tasks.</p>
        ) : (
          <ul className="space-y-2">
            {incompleteTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task._id)}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="font-semibold">{task.title}</span>
                </div>
                {task.dueDate && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
