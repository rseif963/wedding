"use client";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Trash2, Pencil, Calendar, CheckCircle } from "lucide-react";

export default function Checklist() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    showChecklist,
    toggleChecklist,
    fetchClientAll,
  } = useAppContext();

  const [formVisible, setFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
  });


  useEffect(() => {
    fetchClientAll();
  }, [fetchClientAll]);


  const handleShowForm = () => setFormVisible(!formVisible);

  const handleSubmit = async () => {
    if (!taskForm.title.trim()) return;

    if (editingTaskId) {
      await updateTask(editingTaskId, {
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
        category: taskForm.category,
      });
      setEditingTaskId(null);
    } else {
      await addTask({
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
        category: taskForm.category,
      });
    }

    setTaskForm({ title: "", description: "", dueDate: "", category: "" });
    setFormVisible(false);
    await fetchClientAll();
  };

  const handleEdit = (task: any) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      category: task.category || "",
    });
    setFormVisible(true);

    // Scroll to form after it becomes visible
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };


  // Toggle completed status (allow toggle for both completed and incomplete tasks)
  const handleToggleCompleted = async (task: any) => {
    const updated = { ...task, completed: !task.completed };
    await updateTask(task._id, { completed: updated.completed });
    await fetchClientAll();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    await fetchClientAll();
  };

  // Sort tasks newest first by createdAt
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  // Separate completed and incomplete tasks
  const completedTasks = sortedTasks.filter((t) => t.completed);

  // For incomplete tasks, sort by dueDate ascending (earliest due date first)
  const incompleteTasks = sortedTasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // no dueDate means later
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  // Calculate progress %
  const totalTasks = tasks.length || 1;
  const completedCount = completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="w-full h-[95vh] overflow-y-auto mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-[#311970] mb-1">Wedding Checklist</h1>
      <p className="text-gray-600 mb-6">Stay organized with your planning timeline</p>

      {/* Overall Progress Box */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Overall Progress</h2>
          <p className="text-sm text-gray-600 mt-1">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>
        <div className="w-full sm:w-2/3 mt-4 sm:mt-0 sm:ml-6 relative rounded-full h-4 bg-[#ebe9f7]">
          <div
            className="rounded-full h-4 bg-[#311970] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-2xl font-extrabold text-[#311970] ml-4 mt-3 sm:mt-0">{progressPercent}%</div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={handleShowForm}
        className="mb-6 inline-flex items-center gap-2 bg-[#311970] hover:bg-[#4a22c6] text-white rounded-xl px-6 py-3 font-semibold transition"
      >
        <Plus size={18} /> {editingTaskId ? "Edit Task" : "Add Task"}
      </button>

      {/* Task Form */}
      {formVisible && (
        <div ref={formRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
          />
          <input
            type="text"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={taskForm.dueDate || ""}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={taskForm.category}
            onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 justify-center bg-[#311970] hover:bg-[#4a22c6] text-white rounded-xl px-6 py-3 font-semibold transition"
          >
            {editingTaskId ? "Update Task" : "Save"}
          </button>
        </div>
      )}

      {/* Completed Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D9F0E9] text-[#138A49] p-2 rounded-full">
            <CheckCircle size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <span className="text-gray-500 font-normal">({completedTasks.length})</span>
        </div>

        {completedTasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No completed tasks.</p>
        ) : (
          <ul className="space-y-4">
            {completedTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-4 rounded-2xl bg-[#E8F6EF]"
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => handleToggleCompleted(task)}
                    className="bg-[#138A49] rounded-full p-1.5 cursor-pointer"
                    role="checkbox"
                    aria-checked={task.completed}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleToggleCompleted(task);
                    }}
                  >
                    <CheckCircle size={20} color="white" />
                  </div>

                  <div>
                    <div className="text-gray-500 line-through font-semibold">{task.title}</div>
                    {task.dueDate && (
                      <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-gray-400 text-sm italic">{task.category}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming Tasks Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
        <ul className="space-y-4">
          {incompleteTasks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No incomplete tasks.</p>
          ) : (
            incompleteTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-4 rounded-2xl border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                    className="w-5 h-5 border-2 border-gray-300 rounded-sm cursor-pointer"
                  />
                  <div>
                    <div className="text-gray-900 font-semibold">{task.title}</div>
                    {task.dueDate && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-[#311970] p-2 hover:bg-[#E8DFF9] rounded-lg transition"
                    aria-label="Edit Task"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id!)}
                    className="text-[#9B1B1B] p-2 hover:bg-[#F9D9D9] rounded-lg transition"
                    aria-label="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
